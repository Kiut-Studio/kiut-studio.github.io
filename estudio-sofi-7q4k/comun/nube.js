/* Dina Estudia — nube y registro de datos (lo usan el hub, todas las materias y la pantalla de progreso).

   NUBE: cada materia guarda su progreso en el teléfono (localStorage, una clave por materia).
   Además se manda una copia a la planilla de Google (pestaña "Respaldo", una fila por materia),
   así no se pierde si se borran los datos del sitio y se puede ver desde otro teléfono.
   - Al abrir el hub o una materia: se baja la copia de la nube y se une con la del teléfono.
   - Cada vez que se guarda algo: se sube la copia (unos segundos después, para no mandar de más).
   - Unir nunca borra: partidas y simulacros se juntan por fecha, récords y frutillas toman el mayor.

   REGISTRO: funciones comunes para anotar el historial (partidas, simulacros con detalle, días de estudio). */
(function(){
"use strict";
const URL_HOJA = (window.HOJA_URL||"").trim();
const K_PERFIL = "dinaEstudia.perfil", K_ESTADO = "dinaEstudia.nube";
const leer = k => { try{ return JSON.parse(localStorage.getItem(k)||"null"); }catch(_){ return null; } };
const escribir = (k,v) => { try{ localStorage.setItem(k, JSON.stringify(v)); }catch(_){} };

/* Perfil: de quién es la copia en la nube. Siempre "sofi", salvo que se cambie a mano (para probar sin tocar lo de Sofi). */
function perfil(){ const p = leer(K_PERFIL); return (typeof p==="string" && /^[a-z0-9-]{2,30}$/.test(p)) ? p : "sofi"; }

/* Estado para mostrar en pantalla: {ok, cuando, error} */
function estado(){ return leer(K_ESTADO) || {}; }
function ponerEstado(cambio){ const e = Object.assign(estado(), cambio); escribir(K_ESTADO, e); try{ dispatchEvent(new CustomEvent("dina-nube",{detail:e})); }catch(_){} return e; }

/* ---------- unir dos copias (la del teléfono manda en lo que no se puede sumar) ---------- */
const NO_SUBIR = ["cola"];                         // los envíos pendientes a la planilla son de cada teléfono
function porFecha(a, b, max){
  const m = new Map();
  (a||[]).concat(b||[]).forEach(x=>{ if(x && x.f!=null){ const v = m.get(x.f); if(!v || JSON.stringify(x).length > JSON.stringify(v).length) m.set(x.f, x); } });
  return [...m.values()].sort((x,y)=>x.f-y.f).slice(-max);
}
function unir(a, b){
  if(!b) return a; if(!a) return Object.assign({}, b, {cola:[]});
  const r = Object.assign({}, b, a);                // ajustes (letra, tamaño, reloj…): los del teléfono
  const mayor = (x,y) => { const o = Object.assign({}, y||{}); for(const k in (x||{})) o[k] = Math.max(x[k]??0, o[k]??0); return o; };
  r.est = mayor(a.est, b.est);
  r.mejor = mayor(a.mejor, b.mejor);
  r.vistas = Object.assign({}, b.vistas||{});
  for(const id in (a.vistas||{})){ const x=a.vistas[id], y=r.vistas[id];
    r.vistas[id] = (!y || (x.bien||0)+(x.mal||0) >= (y.bien||0)+(y.mal||0)) ? Object.assign({}, y||{}, x) : Object.assign({}, x, y); }
  r.ej = Object.assign({}, b.ej||{}, a.ej||{});
  r.simulacros = porFecha(a.simulacros, b.simulacros, 60);
  r.hist = porFecha(a.hist, b.hist, 400);
  r.ejHist = porFecha(a.ejHist, b.ejHist, 300);
  r.dias = mayor(a.dias, b.dias);
  if((!a.nombre || a.nombre==="Sofi") && b.nombre) r.nombre = b.nombre;
  r.cola = a.cola || [];
  r.act = Math.max(a.act||0, b.act||0);
  return r;
}
function paraSubir(d){ const o = {}; for(const k in d) if(!NO_SUBIR.includes(k)) o[k] = d[k]; return o; }
function igual(a, b){ return JSON.stringify(paraSubir(a||{})) === JSON.stringify(paraSubir(b||{})); }

/* ---------- bajar ---------- */
let bajando = null;
function bajar(){
  if(!URL_HOJA) return Promise.resolve(null);
  if(bajando) return bajando;
  bajando = (async()=>{
    try{
      const r = await fetch(URL_HOJA + "?accion=respaldo&perfil=" + encodeURIComponent(perfil()), {cache:"no-store"});
      const j = await r.json();
      if(!j || !j.ok || !j.datos){ ponerEstado({ok:false, error:"planilla"}); return null; }   // la planilla todavía tiene el código viejo
      ponerEstado({ok:true, bajado:Date.now(), error:null});
      return j.datos;
    }catch(_){ ponerEstado({error:"sin conexión"}); return null; }
    finally{ setTimeout(()=>{ bajando=null; }, 3000); }
  })();
  return bajando;
}

/* ---------- subir ---------- */
const pendientes = {}; let reloj = 0;
function subir(clave, datos, ya){
  if(!URL_HOJA || !clave || !datos) return;
  pendientes[clave] = datos;
  clearTimeout(reloj);
  reloj = setTimeout(vaciar, ya ? 200 : 4000);
}
async function vaciar(alSalir){
  clearTimeout(reloj);
  const claves = Object.keys(pendientes);
  for(const clave of claves){
    const d = pendientes[clave]; delete pendientes[clave];
    d.act = Date.now();
    const cuerpo = JSON.stringify({tipo:"respaldo", perfil:perfil(), clave, act:d.act, datos:JSON.stringify(paraSubir(d))});
    try{
      const r = await fetch(URL_HOJA, {method:"POST", body:cuerpo, keepalive: !!alSalir && cuerpo.length < 60000});
      if(alSalir) continue;
      const j = await r.json();
      if(j && j.ok) ponerEstado({ok:true, subido:Date.now(), error:null});
      else ponerEstado({ok:false, error:"planilla"});
    }catch(_){ if(!alSalir){ pendientes[clave] = pendientes[clave] || d; ponerEstado({error:"sin conexión"}); } }
  }
}
addEventListener("pagehide", ()=>vaciar(true));
document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="hidden") vaciar(true); });
addEventListener("online", ()=>{ if(Object.keys(pendientes).length) vaciar(); });

/* Al abrir una materia: bajar su copia, unir y avisar si cambió algo.
   obtener() devuelve los datos actuales (pueden haber cambiado mientras bajaba); alUnir(m) los reemplaza. */
async function abrir(clave, obtener, alUnir){
  const nube = await bajar();
  if(!nube) return;
  const local = obtener(), m = unir(local, nube[clave]);
  if(!igual(m, local)) alUnir(m);
  if(!igual(m, nube[clave])) subir(clave, m, true);
}

/* Hub y progreso: bajar todo, unir con cada materia del teléfono y subir lo que falte. Devuelve true si cambió algo. */
async function sincronizarTodo(claves){
  const nube = await bajar(); if(!nube) return false;
  let cambio = false;
  for(const clave of new Set(claves.concat(Object.keys(nube).filter(k=>/^dina[A-Za-z]+\.v\d+$/.test(k))))){
    if(nube[clave] && nube[clave].tipo) continue;              // no es una materia (por ejemplo, el calendario)
    const local = leer(clave), m = unir(local, nube[clave]);
    if(!m) continue;
    if(!igual(m, local)){ escribir(clave, Object.assign({}, m, {cola:(local&&local.cola)||[]})); cambio = true; }
    if(!igual(m, nube[clave])) subir(clave, m, true);
  }
  return cambio;
}

/* =====================  REGISTRO  ===================== */
function hoy(){ const d = new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
/* segundos de estudio por día (para la racha y el gráfico de días) */
function sumarTiempo(datos, seg, max){
  if(!(seg>0)) return; datos.dias = datos.dias || {};
  datos.dias[hoy()] = Math.round(((datos.dias[hoy()]||0) + Math.min(seg, max||900))*10)/10;
}
/* Nombre de la materia, temas y texto de cada pregunta vista: así la pantalla de progreso
   puede mostrar todo sin cargar el banco de preguntas de cada materia. */
function meta(datos, nombre, temas, banco){
  datos.materia = nombre;
  datos.temasInfo = {}; for(const k in temas) datos.temasInfo[k] = {nom:temas[k].nom, c:temas[k].c};
  const porId = {}; banco.forEach(p=>porId[p.id]=p);
  for(const id in (datos.vistas||{})){ const p = porId[id], v = datos.vistas[id];
    if(p){ v.b = p.b; v.q = p.q; v.c = p.o[0]; } }
}
/* Una partida terminada (de un tema, mezclada o repaso) */
function partida(datos, d){
  datos.hist = (datos.hist||[]).concat([d]).slice(-400);
}
/* Un simulacro terminado. El detalle de cada pregunta se guarda en los últimos 20. */
function simulacro(datos, d){
  const l = (datos.simulacros||[]).concat([d]);
  l.forEach((x,i)=>{ if(i < l.length-20) delete x.det; });
  datos.simulacros = l.slice(-60);
}
function ejercicio(datos, d){ datos.ejHist = (datos.ejHist||[]).concat([d]).slice(-300); }
/* aciertos por tema de una lista de respuestas [{b, ok}] → {tema:[aciertos, total]} */
function porTema(lista){ const t = {}; lista.forEach(x=>{ const v = t[x.b] || (t[x.b]=[0,0]); v[1]++; if(x.ok) v[0]++; }); return t; }

window.Nube = {perfil, estado, unir, bajar, subir, vaciar, abrir, sincronizarTodo, leer,
  hoy, sumarTiempo, meta, partida, simulacro, ejercicio, porTema};
})();

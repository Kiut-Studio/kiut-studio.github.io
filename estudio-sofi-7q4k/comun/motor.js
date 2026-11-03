/* Dina Estudia — motor común de las materias.
   Cada materia tiene su carpeta con index.html y datos.js. datos.js define window.MATERIA:
     nombre, titulo, lema, pie, clave (localStorage), muestra (texto de ejemplo del panel Aa)
     temas  {id:{nom, sub, c, s}}           colores: var(--b1)…var(--b4), var(--b1s)…, o un color
     banco  [{id, b, q, o:[correcta, …], e, s, fig?}]   la primera opción es la correcta
     resumen [{titulo, notas:[{t, d, ojo?, html?}]}]     d pasa por F(); html va tal cual
     ejercicios? {titulo, sub, ayuda, tipos:[{id, nom, sub, gen()}]}
        gen() → {t, q, fig?, p:[[etiqueta, texto|{html}]], r: texto|{html}}
     simulacro {porTema, problemas?:[id de tipo…]}  o  {total}
   Física 1 tiene su propio archivo y no usa este motor. */
(function(){
"use strict";
const M = window.MATERIA;
const A = "../fisica-1/assets/";                       // dibujos de Sofía
const TEMAS = M.temas, BANCO = M.banco;
const TIPOS = M.ejercicios ? M.ejercicios.tipos : [];

/* =====================  ESCRITURA  =====================
   [[a::b]] → fracción, 10⁻⁶ → potencia, q₁ → subíndice, X^H → X con superíndice, \n → renglón nuevo. */
const SUP = {"⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9","⁻":"−","⁺":"+"};
const SUB = {"₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9"};
function F(t){
  let s = String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;");
  s = s.replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");
  s = s.replace(/\[\[(.+?)::(.+?)\]\]/g,(m,a,b)=>`<span class="fr"><span>${a}</span><span>${b}</span></span>`);
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g,m=>`<sup>${[...m].map(c=>SUP[c]).join("")}</sup>`);
  s = s.replace(/[₀₁₂₃₄₅₆₇₈₉]+/g,m=>`<sub>${[...m].map(c=>SUB[c]).join("")}</sub>`);
  s = s.replace(/([A-Za-z])\^([A-Za-z])/g,"$1<sup>$2</sup>");
  s = s.replace(/ (=|≈|→|×) /g," $1 ").replace(/(\d) (%|años|días|horas)/g,"$1 $2");
  return s.replace(/\n/g,"<br>");
}
const T = x => (x && typeof x==="object") ? x.html : F(x);   // texto o HTML ya armado
window.F = F;

/* =====================  GUARDADO  ===================== */
let datos = {est:{}, mejor:{}, vistas:{}, ej:{}, apuro:true, mudo:false, nombre:"Sofi", cola:[], letra:"andika", escala:1};
try{ const g = JSON.parse(localStorage.getItem(M.clave)||"null"); if(g) datos = Object.assign(datos,g); }catch(_){}
// el nombre, la letra y el tamaño se comparten con Física 1 si acá todavía no se eligieron
try{ const f = JSON.parse(localStorage.getItem("dinaFisica.v1")||"null");
  if(f && !localStorage.getItem(M.clave)){ ["nombre","letra","escala","apuro","mudo"].forEach(k=>{ if(f[k]!=null) datos[k]=f[k]; }); } }catch(_){}
function guardar(ya){ try{ localStorage.setItem(M.clave, JSON.stringify(datos)); }catch(_){} if(window.Nube) Nube.subir(M.clave, datos, ya); }
// nombre de la materia, temas y texto de las preguntas vistas, para la pantalla de progreso
if(window.Nube) Nube.meta(datos, M.nombre, TEMAS, BANCO);

const LETRAS = {
  andika:  {nom:"Escolar",   f:"Andika",                g:"Andika:wght@400;700"},
  atkinson:{nom:"Muy clara", f:"Atkinson Hyperlegible", g:"Atkinson+Hyperlegible:wght@400;700"},
  lexend:  {nom:"Lectura",   f:"Lexend",                g:"Lexend:wght@400;700"},
  comic:   {nom:"A mano",    f:"Comic Neue",            g:"Comic+Neue:wght@400;700"},
  nunito:  {nom:"Redonda",   f:"Nunito",                g:"Nunito:wght@600;800"},
  open:    {nom:"Común",     f:"Open Sans",             g:"Open+Sans:wght@400;700"},
  literata:{nom:"De libro",  f:"Literata",              g:"Literata:wght@400;700"},
  fredoka: {nom:"Del juego", f:"Fredoka",               g:"Fredoka:wght@500;700"}
};
const ESCALAS = [0.9, 1, 1.15, 1.3, 1.5];
const cargadas = new Set();
function cargarLetra(k){ const l=LETRAS[k]; if(!l || cargadas.has(k)) return; cargadas.add(k);
  const ln=document.createElement("link"); ln.rel="stylesheet"; ln.href="https://fonts.googleapis.com/css2?family="+l.g+"&display=swap"; document.head.appendChild(ln); }
function ponerLetra(){
  if(!LETRAS[datos.letra]) datos.letra="andika";
  if(!ESCALAS.includes(datos.escala)) datos.escala=1;
  cargarLetra(datos.letra);
  const st=document.documentElement.style;
  st.setProperty("--texto", '"'+LETRAS[datos.letra].f+'","Verdana","Segoe UI",system-ui,sans-serif');
  st.setProperty("--escala", datos.escala);
}
ponerLetra();

/* =====================  HOJA DE GOOGLE  =====================
   Misma planilla que Física 1 (config de ../fisica-1/config.js). Cada envío lleva la materia. */
const HOJA = (window.HOJA_URL||"").trim();
async function mandarUno(d){
  try{ const r = await fetch(HOJA,{method:"POST",body:JSON.stringify(d)}); const j = await r.json(); return !!j; }catch(_){ return false; }
}
async function anotar(d){
  if(!HOJA) return;
  d.materia = M.nombre; d.nombre = datos.nombre || "Sofi"; d.cuando = new Date().toISOString();
  datos.cola.push(d); if(datos.cola.length>200) datos.cola.shift(); guardar();
  await reenviar();
}
let enviando=false;
async function reenviar(){
  if(!HOJA || enviando) return; enviando=true;
  try{ while(datos.cola.length){ const ok = await mandarUno(datos.cola[0]); if(!ok) break; datos.cola.shift(); guardar(); } }
  finally{ enviando=false; }
}
const conMateria = t => (M.corto||M.nombre)+" · "+t;

/* =====================  SONIDO  ===================== */
let AC=null;
function audio(){ if(datos.mudo) return null; try{ AC = AC || new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==="suspended") AC.resume(); }catch(_){ AC=null; } return AC; }
function tono(f,t0,d,tipo="sine",v=.18){ const a=audio(); if(!a) return; const o=a.createOscillator(),g=a.createGain(); o.type=tipo; o.frequency.value=f;
  const t=a.currentTime+t0; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.01); g.gain.exponentialRampToValueAtTime(.001,t+d); o.connect(g).connect(a.destination); o.start(t); o.stop(t+d+.02); }
function rocio(){ const a=audio(); if(!a) return; const n=a.sampleRate*.35, b=a.createBuffer(1,n,a.sampleRate), d=b.getChannelData(0);
  for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2); const s=a.createBufferSource(); s.buffer=b; const f=a.createBiquadFilter(); f.type="highpass"; f.frequency.value=3000;
  const g=a.createGain(); g.gain.value=.25; s.connect(f).connect(g).connect(a.destination); s.start(); }
const sBien = ()=>{ rocio(); tono(880,.12,.18); tono(1175,.22,.3); };
const sMal  = ()=>{ tono(160,0,.18,"triangle",.3); tono(120,.12,.25,"triangle",.3); };

/* =====================  ELECCIÓN DE PREGUNTAS  ===================== */
function mezclar(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function peso(p){ const v=datos.vistas[p.id]; if(!v) return 3; return 1 + 3*v.mal/(v.bien+v.mal) + (v.ultimaMal?2:0); }
function elegir(lista,n){ const pool=lista.slice(), r=[]; while(r.length<n && pool.length){ const tot=pool.reduce((s,p)=>s+peso(p),0); let x=Math.random()*tot, i=0;
  for(;i<pool.length;i++){ x-=peso(pool[i]); if(x<=0) break; } r.push(pool.splice(Math.min(i,pool.length-1),1)[0]); } return r; }
const claves = Object.keys(TEMAS);
const MIX = M.mixPorTema || Math.max(2, Math.round(12/claves.length));
const N_MIX = MIX*claves.length;
/* reparte n preguntas entre los temas, lo más parejo posible */
function repartir(n){ const base=Math.floor(n/claves.length); let resto=n-base*claves.length;
  return mezclar(claves).flatMap(k=>elegir(BANCO.filter(p=>p.b===k), base+(resto-->0?1:0))); }

/* =====================  PANTALLAS  ===================== */
const app = document.getElementById("app");
const $ = s => app.querySelector(s);
const fresas = n => "🍓".repeat(n) + "<span style='opacity:.3'>" + "🍓".repeat(3-n) + "</span>";
function estrellasDe(ok,tot){ const p=ok/tot; return p>=.99?3:p>=.75?2:p>=.5?1:0; }
const AA_BTN = `<button class="redondo aa" aria-label="Cambiar letra y tamaño">Aa</button>`;
const fig = p => p.fig ? `<div class="marco">${p.fig}</div>` : "";
/* preguntas escritas en otro idioma (Guaraní): "es" es la ayuda en castellano, se abre con un toque */
const ayudaEs = p => p.es ? `<details class="ayuda-es"><summary>💬 Ver en castellano</summary><p>${F(p.es)}</p></details>` : "";
const SIM = M.simulacro || {total:20};
const conProblemas = !!(SIM.problemas && SIM.problemas.length && TIPOS.length);

/* una pregunta respondida: cuenta para que las falladas vuelvan más seguido y para el progreso */
function marcarVista(p, bien){
  const v = datos.vistas[p.id] || {bien:0,mal:0}; v[bien?"bien":"mal"]++; v.ultimaMal=!bien;
  v.b=p.b; v.q=p.q; v.c=p.o[0]; datos.vistas[p.id]=v;
}
/* simulacro terminado, con el detalle de cada pregunta (se ve después en Mi progreso) */
function guardarSim(S, pct, pT, nombres){
  const fila = {f:Date.now(), pct, teoria:S.okT, nT:S.teoria.length, pT, problemas:S.notas, probs:nombres, min:S.min, usado:S.usado, acabo:S.seAcabo||undefined,
    t:Nube.porTema(S.teoria.map(x=>({b:x.p.b, ok:x.elegida>=0&&x.ops[x.elegida].bien}))),
    det:S.teoria.map(x=>({id:x.p.id, b:x.p.b, ok:(x.elegida>=0&&x.ops[x.elegida].bien)?1:0, q:x.p.q, c:x.p.o[0], el:x.elegida>=0?x.ops[x.elegida].txt:"", seg:Math.round(x.seg||0)}))};
  if(window.Nube){ Nube.simulacro(datos, fila); Nube.sumarTiempo(datos, (Date.now()-S.inicio)/1000 - S.teoria.reduce((a,x)=>a+(x.seg||0),0), S.min*60); }
  else datos.simulacros=(datos.simulacros||[]).concat([fila]).slice(-60);
  guardar(true);
}
/* abrir la materia con "#falladas" (desde Mi progreso): repaso de las preguntas que más falló */
function masFalladas(n){
  return BANCO.filter(p=>{ const v=datos.vistas[p.id]; return v && v.mal>0; })
    .sort((a,b)=>{ const x=datos.vistas[a.id], y=datos.vistas[b.id]; return (y.mal/(y.bien+y.mal)+(y.ultimaMal?1:0)) - (x.mal/(x.bien+x.mal)+(x.ultimaMal?1:0)) || y.mal-x.mal; })
    .slice(0,n);
}

function menu(){
  pararReloj(); pararSim(); S=null; P=null;
  let h = `<div class="top"><span class="izq"><a class="redondo" href="../" aria-label="Volver a las materias">🏠</a>${AA_BTN}</span><button class="redondo" id="mudo" aria-label="Sonido">${datos.mudo?"🔇":"🔊"}</button></div>
  <h1>${M.titulo}</h1><p class="lema">${M.lema||"¡Psst! Respondé bien y Dina no se come la torta"}</p>
  <div class="duo"><img src="${A}sofi.webp" alt="Sofi"><img class="d" src="${A}dina_corre.webp" alt="Dina"></div>
  <p class="ayuda">Mientras pensás, Dina baja hacia la torta. Si tocás la respuesta correcta, Sofi le echa agua y Dina se escapa.</p>
  <div class="lista">
   <button class="btn mix" data-modo="mix"><span class="nom">🎯 Prueba mezclada<small>${N_MIX} preguntas de todos los temas · empezá por esta</small></span><span class="der">${datos.mejor.mix!=null?"récord "+datos.mejor.mix+"/"+N_MIX:""}</span></button>`;
  for(const k in TEMAS){ const t=TEMAS[k], e=datos.est[k]||0;
    h += `<button class="btn" data-modo="${k}" style="background:${t.c};--s:${t.s}"><span class="nom">${t.nom}<small>${t.sub}</small></span><span class="der"><span class="frs">${fresas(e)}</span>${datos.mejor[k]!=null?"<br>récord "+datos.mejor[k]+"/8":""}</span></button>`; }
  const ultSim=(datos.simulacros||[]).slice(-1)[0];
  h += `<button class="btn sim" id="sim"><span class="nom">📋 Simulacro de examen<small>${conProblemas?"teoría + problemas, con tiempo":SIM.total+" preguntas, con tiempo"}</small></span><span class="der">${ultSim?"último: "+ultSim.pct+"/100":""}</span></button>`;
  if(TIPOS.length){ const bien=TIPOS.filter(t=>datos.ej[t.id]==="si").length;
    h += `<button class="btn ej" id="ejs"><span class="nom">✏️ ${M.ejercicios.titulo}<small>${M.ejercicios.sub}</small></span><span class="der">${bien}/${TIPOS.length} ✓</span></button>`; }
  h += `<button class="btn res" id="res"><span class="nom">📖 Resumen<small>${M.resumenSub||"lo más importante del cuaderno"}</small></span></button>`;
  h += `</div>
  <div class="chips"><a class="chip" href="../progreso/#${M.clave}">📈 Mi progreso</a><button class="chip" id="quien">👤 Juega: ${datos.nombre}</button>${yaInstalada()?"":`<button class="chip" id="instalar">📲 Instalar</button>`}</div>
  <p class="ayuda" id="ayudaInst" hidden></p>
  <div class="chips" role="group" aria-label="Tiempo">
    <button class="chip" id="conApuro" aria-pressed="${datos.apuro}">⏱ Con reloj</button>
    <button class="chip" id="sinApuro" aria-pressed="${!datos.apuro}">🐢 Sin apuro</button>
  </div>
  <p class="pie">${M.pie}<br>Dibujos de Sofía · Kiut Studio</p>`;
  app.innerHTML = h; window.scrollTo(0,0);
  app.querySelectorAll("[data-modo]").forEach(b=>b.onclick=()=>{ audio(); empezar(b.dataset.modo); });
  $("#mudo").onclick=()=>{ datos.mudo=!datos.mudo; guardar(); menu(); };
  if($("#ejs")) $("#ejs").onclick=listaEj;
  $("#res").onclick=resumen;
  $("#sim").onclick=simulacro;
  if($("#instalar")) $("#instalar").onclick=instalar;
  $("#quien").onclick=()=>{
    const c=$("#quien"); c.innerHTML=`👤 <input id="nom" maxlength="16" aria-label="Nombre" value="${datos.nombre.replace(/"/g,"")}">`;
    const i=$("#nom"); i.focus(); i.select();
    const listo=()=>{ const v=i.value.replace(/[<>"]/g,"").trim().slice(0,16); if(v) datos.nombre=v; guardar(); menu(); };
    i.onkeydown=e=>{ if(e.key==="Enter") listo(); }; i.onblur=listo; c.onclick=null;
  };
  $("#conApuro").onclick=()=>{ datos.apuro=true; guardar(); menu(); };
  $("#sinApuro").onclick=()=>{ datos.apuro=false; guardar(); menu(); };
}

/* ---------- partida ---------- */
let P = null;
const DURA = M.segundos || 40;

function empezar(modo, soloEstas){
  let qs;
  if(soloEstas) qs = mezclar(soloEstas);
  else if(modo==="mix") qs = mezclar(claves.flatMap(k=>elegir(BANCO.filter(p=>p.b===k),MIX)));
  else qs = elegir(BANCO.filter(p=>p.b===modo),8);
  P = {modo, qs, i:0, ok:0, racha:0, torta:8, res:[], repaso:!!soloEstas};
  pantallaJuego(); mostrar();
}
function pantallaJuego(){
  app.innerHTML = `<div class="hud">
     <button class="redondo" id="salir" aria-label="Volver al menú">✕</button>
     <div class="porciones" id="porc">${"<span></span>".repeat(8)}</div>
     <div><div class="puntos"><img src="${A}frutilla.webp" alt=""><span id="pts">0</span></div><div class="racha" id="racha"></div></div>
     ${AA_BTN}
   </div>
   <div class="puntitos" id="dots">${P.qs.map(()=>"<i></i>").join("")}</div>
   <div class="escena" id="esc"><div class="riel"></div><img class="sofi" src="${A}sofi.webp" alt="Sofi">
     <img class="torta" id="torta" src="${A}torta.webp" alt="Torta"><img class="dina bob" id="dina" src="${A}dina_corre.webp" alt="Dina">
     <span class="reloj" id="reloj" ${datos.apuro?"":"hidden"}></span></div>
   <div class="tarjeta" id="tarj"></div>`;
  $("#salir").onclick=menu;
}
function mostrar(){
  const p = P.qs[P.i], t = TEMAS[p.b];
  const ops = mezclar(p.o.map((txt,k)=>({txt,bien:k===0})));
  P.ops = ops; P.listo=false; P.t0=performance.now(); P.f=0; P.pausa=0;
  $("#dots").querySelectorAll("i").forEach((d,k)=>d.classList.toggle("ya",k===P.i));
  $("#tarj").innerHTML = `<span class="tema" style="--tc:${t.c}">${t.nom}</span>
    <p class="preg">${F(p.q)}</p>${ayudaEs(p)}${fig(p)}
    <div class="opciones">${ops.map((o,k)=>`<button class="op" data-k="${k}"><b>${"ABCD"[k]}</b><span>${F(o.txt)}</span></button>`).join("")}</div>
    <div id="dev"></div>`;
  $("#tarj").querySelectorAll(".op").forEach(b=>b.onclick=()=>responder(+b.dataset.k));
  const dina=$("#dina"); dina.className="dina bob"; dina.src=A+"dina_corre.webp"; dina.style.transform=""; dina.style.opacity="";
  arrancarReloj();
}
let raf=0;
function pararReloj(){ cancelAnimationFrame(raf); raf=0; }
function arrancarReloj(){
  pararReloj();
  const dina=$("#dina"), esc=$("#esc"), reloj=$("#reloj");
  const inicio = performance.now() - (P && P.pausa ? P.pausa*1000 : 0); if(P) P.pausa=0;
  const paso = ahora=>{
    if(!P || P.listo || !dina.isConnected) return;
    const fin = esc.clientHeight - 64 - 56;
    if(!datos.apuro){ dina.style.top = (fin*.12)+"px"; return; }
    const f = Math.min(1,(ahora-inicio)/1000/DURA); P.f=f;
    dina.style.top = (f*fin)+"px";
    if(reloj) reloj.textContent = Math.ceil(DURA*(1-f))+" s";
    if(f>=1){ responder(-1); return; }
    raf = requestAnimationFrame(paso);
  };
  raf = requestAnimationFrame(paso);
}
function gotas(){
  const esc=$("#esc"), sofi=esc.querySelector(".sofi"), r=esc.getBoundingClientRect(), s=sofi.getBoundingClientRect(), d=$("#dina").getBoundingClientRect();
  const x0=s.right-r.left-14, y0=s.top-r.top+s.height*.45, dx=d.left+d.width/2-r.left-x0, dy=d.top+d.height/2-r.top-y0;
  for(let k=0;k<14;k++){ const g=document.createElement("i"); g.className="gota"; g.style.left=x0+"px"; g.style.top=y0+"px";
    g.style.setProperty("--dx",(dx*(.6+Math.random()*.5))+"px"); g.style.setProperty("--dy",(dy*(.6+Math.random()*.5)+(Math.random()*30-15))+"px");
    g.style.animationDelay=(k*.02)+"s"; esc.appendChild(g); setTimeout(()=>g.remove(),900); }
}
function globo(txt,color){ if(!$("#esc")) return; const g=document.createElement("div"); g.className="globo"; g.textContent=txt; g.style.color=color; $("#esc").appendChild(g); setTimeout(()=>g.remove(),950); }
function responder(k){
  if(P.listo) return; P.listo=true; pararReloj();
  const p=P.qs[P.i], bien = k>=0 && P.ops[k].bien, dina=$("#dina");
  $("#tarj").querySelectorAll(".op").forEach((b,j)=>{ b.disabled=true; if(P.ops[j].bien) b.classList.add("bien"); else if(j===k) b.classList.add("mal"); });
  const crudo = (performance.now()-P.t0)/1000, seg = Math.round(crudo);
  marcarVista(p, bien); if(window.Nube) Nube.sumarTiempo(datos, crudo); guardar();
  P.res.push({p,bien,elegida:k>=0?P.ops[k].txt:null,seg});
  $("#dots").querySelectorAll("i")[P.i].classList.add(bien?"ok":"no");
  if(bien){
    P.ok++; P.racha++; sBien(); gotas(); globo(P.racha>=3?"¡Psst! ×"+P.racha:"¡Psst!", "var(--b4s)");
    dina.classList.remove("bob"); setTimeout(()=>dina.classList.add("huye"),120);
    if(P.racha>0 && P.racha%4===0 && P.torta<8){ P.torta++; }
  }else{
    P.racha=0; sMal(); P.torta=Math.max(0,P.torta-1);
    dina.classList.remove("bob"); const esc=$("#esc"); dina.style.transition="top .35s ease-in"; dina.style.top=(esc.clientHeight-64-48)+"px";
    setTimeout(()=>{ dina.style.transition=""; dina.classList.add("come"); dina.src=A+"dina.webp"; $("#torta") && $("#torta").classList.add("tiembla"); globo(k<0?"¡Ñam! Se acabó el tiempo":"¡Ñam!","var(--mal)"); },350);
    setTimeout(()=>$("#torta") && $("#torta").classList.remove("tiembla"),800);
  }
  $("#pts").textContent=P.ok;
  $("#racha").textContent = P.racha>=2 ? "🔥 "+P.racha : "";
  $("#porc").querySelectorAll("span").forEach((s,j)=>s.classList.toggle("comida",j>=P.torta));
  $("#dev").innerHTML = `<div class="devolucion ${bien?"si":"no"}">
     <h3>${bien?"¡Bien! Dina sale corriendo":(k<0?"Se acabó el tiempo":"Uy, Dina mordió la torta")}</h3>
     ${bien?"":`<p><b>Correcta:</b> ${F(p.o[0])}</p>`}
     <p>${F(p.e)}</p><span class="sec">📖 ${p.s}</span></div>
     <button class="sig" id="sig">${P.i+1<P.qs.length?"Siguiente →":"Ver resultado"}</button>`;
  const sig=$("#sig"); sig.onclick=()=>{ P.i++; if(P.i<P.qs.length) mostrar(); else resultado(); };
  sig.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function resultado(){
  pararReloj();
  const n=P.qs.length, est=estrellasDe(P.ok,n), mix=P.modo==="mix";
  if(!P.repaso){
    if(!mix) datos.est[P.modo]=Math.max(datos.est[P.modo]||0,est);
    datos.mejor[P.modo]=Math.max(datos.mejor[P.modo]??0,P.ok);
  }
  if(window.Nube) Nube.partida(datos, {f:Date.now(), m:P.modo, rep:P.repaso||undefined, ok:P.ok, n, seg:P.res.reduce((a,r)=>a+r.seg,0),
    t:Nube.porTema(P.res.map(r=>({b:r.p.b, ok:r.bien}))), mal:P.res.filter(r=>!r.bien).map(r=>r.p.id)});
  guardar(true);
  anotar({tipo:"partida", modo: conMateria(mix?"Prueba mezclada":TEMAS[P.modo].nom), repaso:P.repaso, aciertos:P.ok, total:n,
    respuestas:P.res.map(r=>({id:r.p.id, tema:TEMAS[r.p.b].nom, pregunta:r.p.q, bien:r.bien, elegida:r.elegida||"(se acabó el tiempo)", correcta:r.p.o[0], seg:r.seg}))});
  const tit = est===3?"¡Torta intacta!":est===2?"¡Muy bien!":est===1?"¡Vas bien!":"Dina se comió casi toda la torta";
  const msj = est===3?"Sabés este tema. Ahora probá con otro tema o con la prueba mezclada.":est>=1?"Mirá abajo las que fallaste y jugá otra vez.":"Leé el resumen de este tema y jugá de nuevo. Las preguntas que fallaste van a volver a salir.";
  let h = `<div class="top"><span></span>${AA_BTN}</div><div class="res-cab"><img src="${A}${est>=2?"sofi":"dina"}.webp" alt=""><h2>${tit}</h2>
    <div class="nota">${P.ok} de ${n} bien</div><div class="estrellas">${fresas(est)}</div><p>${msj}</p></div>`;
  if(mix){
    h += `<div class="temas"><h3>Cómo te fue en cada tema</h3>`;
    for(const k in TEMAS){ const rs=P.res.filter(r=>r.p.b===k); if(!rs.length) continue; const ok=rs.filter(r=>r.bien).length;
      h += `<div class="fila" style="--tc:${TEMAS[k].c}"><span>${TEMAS[k].nom}</span><span>${ok}/${rs.length}${ok===rs.length?" ✓":ok===0?" · a repasar":""}</span><div class="barra"><i style="width:${100*ok/rs.length}%"></i></div></div>`; }
    h += `</div>`;
  }
  const fall = P.res.filter(r=>!r.bien);
  if(fall.length){
    h += `<div class="falladas"><h3>Para repasar</h3>${fall.map(r=>`<div class="falla"><div class="q">${F(r.p.q)}</div>
      <div class="r">✓ ${F(r.p.o[0])}</div><div class="e">${F(r.p.e)} · 📖 ${r.p.s}</div></div>`).join("")}</div>`;
  } else h += `<p class="todo-bien">¡Ninguna fallada!</p>`;
  const tc = mix?"var(--rosa)":TEMAS[P.modo].c, ts = mix?"var(--rosa-osc)":TEMAS[P.modo].s;
  h += `<div class="acciones">
    ${fall.length?`<button class="sig" id="rep">Repasar solo las falladas (${fall.length})</button>`:""}
    <button class="btn" id="otra" style="background:${tc};--s:${ts};justify-content:center"><span class="nom" style="text-align:center;flex:none">Jugar otra vez</span></button>
    <button class="btn mix" id="volver" style="justify-content:center"><span class="nom" style="text-align:center;flex:none">Menú</span></button></div>`;
  app.innerHTML = h; window.scrollTo(0,0);
  const modo=P.modo;
  if(fall.length) $("#rep").onclick=()=>empezar(modo, fall.map(r=>r.p));
  $("#otra").onclick=()=>empezar(modo);
  $("#volver").onclick=menu;
}

/* ---------- resumen ---------- */
function resumen(){
  pararReloj(); P=null;
  let h = `<div class="cab-ej"><button class="redondo" id="volver" aria-label="Volver al menú">←</button><h2>Resumen</h2>${AA_BTN}</div>`;
  M.resumen.forEach(g=>{
    const t = g.tema ? TEMAS[g.tema] : null;
    h += `<div class="nivel">${t?`<span class="tema" style="--tc:${t.c}">${t.nom}</span>`:F(g.titulo)}</div>`;
    g.notas.forEach(n=> h += `<div class="nota-res${n.ojo?" ojo":""}">${n.t?`<h3>${n.ojo?"⚠️ ":""}${F(n.t)}</h3>`:""}${n.d?`<p>${F(n.d)}</p>`:""}${n.html||""}</div>`);
  });
  app.innerHTML = h; window.scrollTo(0,0);
  $("#volver").onclick=menu;
}

/* ---------- ejercicios generados (cruzamientos, etc.) ---------- */
const ICONO = {si:"✅", masomenos:"🟡", no:"❌"};
function listaEj(){
  pararReloj(); P=null; pararSim();
  let h = `<div class="cab-ej"><button class="redondo" id="volver" aria-label="Volver al menú">←</button><h2>${M.ejercicios.titulo}</h2>${AA_BTN}</div>
    <p class="ayuda" style="text-align:left;margin:4px 0 0">${M.ejercicios.ayuda}</p>
    <button class="btn dado" id="sorpresa"><span class="nom">🎲 Ejercicio sorpresa<small>cualquier tipo, siempre distinto</small></span></button>
    <div class="nivel">Elegí el tipo</div>`;
  TIPOS.forEach((t,i)=>{ const st=datos.ej[t.id];
    h += `<button class="ej-item" data-i="${i}"><span class="n">${i+1}</span><span class="t">${F(t.nom)}<br><small style="color:var(--tinta-suave)">${F(t.sub)}</small></span><span class="st">${st?ICONO[st]:""}</span></button>`; });
  app.innerHTML = h; window.scrollTo(0,0);
  $("#volver").onclick=menu;
  $("#sorpresa").onclick=()=>verEj(Math.floor(Math.random()*TIPOS.length));
  app.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>verEj(+b.dataset.i));
}
function verEj(i){
  const tipo=TIPOS[i], e=tipo.gen(); let vistos=0;
  app.innerHTML = `<div class="cab-ej"><button class="redondo" id="volver" aria-label="Volver a la lista">←</button><h2>${F(tipo.nom)} 🎲</h2>${AA_BTN}</div>
    <div class="tarjeta"><span class="tema" style="--tc:var(--tinta)">${F(e.t)}</span>
      <p class="enun">${F(e.q)}</p>${fig(e)}
      <div class="papel">📝 ${M.ejercicios.papel||"Primero resolvé en el cuaderno."}</div>
      <div class="pasos" id="pasos"></div>
      <button class="sig" id="mas">Ver el primer paso</button>
      <div id="fin"></div></div>
    <button class="btn dado" id="otraVez"><span class="nom">🎲 Otro del mismo tipo</span></button>`;
  window.scrollTo(0,0);
  $("#volver").onclick=listaEj;
  $("#otraVez").onclick=()=>verEj(i);
  const mas=$("#mas");
  mas.onclick=()=>{
    const cont=$("#pasos");
    if(vistos<e.p.length){ const [et,tx]=e.p[vistos++]; cont.insertAdjacentHTML("beforeend",`<div class="paso"><b>${F(et)}</b>${T(tx)}</div>`);
      mas.textContent = vistos<e.p.length ? "Ver el siguiente paso" : "Ver la respuesta"; }
    else{
      cont.insertAdjacentHTML("beforeend",`<div class="paso final"><b>Respuesta</b>${T(e.r)}</div>`); mas.hidden=true;
      $("#fin").innerHTML=`<p class="preg" style="font-size:17px">¿Pudiste resolver?</p><div class="tal">
        <button data-r="si">✅ Sí</button><button data-r="masomenos">🟡 Más o menos</button><button data-r="no">❌ No</button></div>`;
      $("#fin").querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{
        const r=b.dataset.r; datos.ej[tipo.id]=r; if(window.Nube) Nube.ejercicio(datos, {f:Date.now(), id:tipo.id, nom:tipo.nom, r}); guardar(true);
        anotar({tipo:"ejercicio", id:tipo.id+"*", nivel:conMateria(M.ejercicios.titulo), ejercicio:tipo.nom, resultado:{si:"Sí",masomenos:"Más o menos",no:"No"}[r], enunciado:e.q, respuesta:textoPlano(e.r)});
        if(r==="si") sBien();
        $("#fin").innerHTML=`<p class="anotado">${r==="si"?"¡Muy bien! ":""}Anotado ${ICONO[r]}</p>`;
      });
    }
    mas.scrollIntoView({behavior:"smooth",block:"nearest"});
  };
}
function textoPlano(x){ if(x && typeof x==="object"){ const d=document.createElement("div"); d.innerHTML=x.html; return d.textContent.replace(/\s+/g," ").trim(); } return String(x); }

/* =====================  SIMULACRO DE EXAMEN  =====================
   Con problemas: teoría (porTema por tema, 5 puntos c/u = 40) + 3 problemas (20 c/u = 60).
   Sin problemas: total preguntas que suman 100. */
let S=null, simTick=0;
function pararSim(){ clearInterval(simTick); simTick=0; }
function simulacro(){
  pararReloj(); P=null; pararSim(); S=null;
  const opciones = M.simMinutos || (conProblemas?[40,60,90]:[20,30,45]);
  const min = opciones.includes(datos.simMin) ? datos.simMin : opciones[1];
  const nT = conProblemas ? SIM.porTema*claves.length : SIM.total;
  const ptsT = conProblemas ? 40/nT : 100/nT;
  const hechos = (datos.simulacros||[]).slice(-3).reverse();
  app.innerHTML = `<div class="cab-ej"><button class="redondo" id="volver" aria-label="Volver al menú">←</button><h2>Simulacro de examen</h2>${AA_BTN}</div>
    <div class="tarjeta">
      <p class="enun" style="margin-top:0">Como un examen de verdad: sin explicaciones hasta el final.</p>
      <ol class="metodo" style="box-shadow:none;background:var(--crema);margin-top:10px">
        <li><b>Teoría:</b> ${nT} preguntas de opción múltiple (${F(String(+ptsT.toFixed(2)).replace(".",","))} puntos cada una).</li>
        ${conProblemas?`<li><b>Problemas:</b> ${SIM.problemas.length} para resolver en el cuaderno (20 puntos cada uno).</li>
        <li><b>Corrección:</b> la teoría se corrige sola. Los problemas los corregís vos, comparando con la solución.</li>`
        :`<li><b>Corrección:</b> se corrige sola al final, con la explicación de cada una.</li>`}</ol>
      <p class="sub-t">Tiempo total</p>
      <div class="chips" role="group" aria-label="Tiempo total">${opciones.map(m=>`<button class="chip" data-min="${m}" aria-pressed="${m===min}">${m} minutos</button>`).join("")}</div>
      ${conProblemas?`<p class="papel">📝 Tené a mano el cuaderno${M.calculadora?", la calculadora y la tabla periódica":""}.</p>`:""}
      <button class="sig" id="empezarSim">Empezar el simulacro</button>
    </div>
    ${hechos.length?`<div class="temas"><h3>Últimos simulacros</h3>${hechos.map(x=>`<div class="fila" style="--tc:var(--rosa)"><span>${new Date(x.f).toLocaleDateString("es-PY",{day:"numeric",month:"short"})}</span><span>${x.pct} / 100</span><div class="barra"><i style="width:${x.pct}%"></i></div></div>`).join("")}</div>`:""}`;
  window.scrollTo(0,0);
  $("#volver").onclick=menu;
  app.querySelectorAll("[data-min]").forEach(b=>b.onclick=()=>{ datos.simMin=+b.dataset.min; guardar(); simulacro(); });
  $("#empezarSim").onclick=()=>{
    const qs = conProblemas ? mezclar(claves.flatMap(k=>elegir(BANCO.filter(p=>p.b===k),SIM.porTema))) : mezclar(repartir(SIM.total));
    const teoria = qs.map(p=>({p, ops:mezclar(p.o.map((txt,k)=>({txt,bien:k===0}))), elegida:-1}));
    const probs = conProblemas ? SIM.problemas.map(x=>{ const id=Array.isArray(x)?x[Math.floor(Math.random()*x.length)]:x; const t=TIPOS.find(y=>y.id===id); return {...t.gen(), nom:t.nom}; }) : [];
    S = {fin: Date.now()+min*60000, inicio: Date.now(), min, teoria, probs, ptsT, parte:"t", i:0, notas:[]};
    simTick = setInterval(crono,1000);
    simPantalla();
  };
}
function crono(){
  if(!S) return pararSim();
  const resta=Math.max(0,S.fin-Date.now()), el=document.getElementById("crono");
  if(el){ const m=Math.floor(resta/60000), s=Math.floor(resta/1000)%60; el.textContent=`⏱ ${m}:${String(s).padStart(2,"0")}`; el.classList.toggle("poco",resta<5*60000); }
  if(resta<=0 && (S.parte==="t"||S.parte==="p")){ pararSim(); S.seAcabo=true; corregirTeoria(); }
}
const cabSim = ()=>`<div class="cab-ej sim"><button class="redondo" id="salirSim" aria-label="Salir del simulacro">✕</button><span class="crono" id="crono">⏱</span>${AA_BTN}</div>`;
function salirConfirmando(){
  const b=$("#salirSim");
  b.onclick=()=>{ if(b.dataset.ok){ pararSim(); S=null; menu(); return; } b.dataset.ok=1; b.textContent="¿Salir?"; b.classList.add("ancho"); setTimeout(()=>{ if(b.isConnected){ delete b.dataset.ok; b.textContent="✕"; b.classList.remove("ancho"); } },3000); };
}
function contarTiempo(){ if(S && S.parte==="t" && S.tEntra){ const it=S.teoria[S.i]; it.seg=(it.seg||0)+(Date.now()-S.tEntra)/1000; } if(S) S.tEntra=Date.now(); }
function simPantalla(){
  if(S.parte==="t"){
    const it=S.teoria[S.i], t=TEMAS[it.p.b], n=S.teoria.length, ult=S.i+1>=n;
    app.innerHTML = cabSim()+`<div class="puntitos">${S.teoria.map((x,k)=>`<i class="${x.elegida>=0?"ok":""} ${k===S.i?"ya":""}"></i>`).join("")}</div>
      <div class="tarjeta"><span class="tema" style="--tc:${t.c}">Teoría · ${S.i+1} de ${n}</span>
        <p class="preg">${F(it.p.q)}</p>${ayudaEs(it.p)}${fig(it.p)}
        <div class="opciones">${it.ops.map((o,k)=>`<button class="op ${k===it.elegida?"elegida":""}" data-k="${k}"><b>${"ABCD"[k]}</b><span>${F(o.txt)}</span></button>`).join("")}</div>
        <div class="nav">${S.i>0?`<button class="chip" id="ant">← Anterior</button>`:"<span></span>"}
          <button class="sig" id="sigS">${!ult?"Siguiente →":S.probs.length?"Pasar a los problemas →":"Terminar y corregir"}</button></div></div>`;
    app.querySelectorAll(".op").forEach(b=>b.onclick=()=>{ it.elegida=+b.dataset.k; contarTiempo(); simPantalla(); });
    if($("#ant")) $("#ant").onclick=()=>{ contarTiempo(); S.i--; simPantalla(); };
    $("#sigS").onclick=()=>{ contarTiempo(); if(!ult) S.i++; else if(S.probs.length){ S.parte="p"; S.i=0; } else { pararSim(); corregirTeoria(); return; } simPantalla(); };
  }else if(S.parte==="p"){
    const e=S.probs[S.i], n=S.probs.length;
    app.innerHTML = cabSim()+`<div class="tarjeta"><span class="tema" style="--tc:var(--tinta)">Problema ${S.i+1} de ${n} · ${F(e.nom)}</span>
        <p class="enun">${F(e.q)}</p>${fig(e)}
        <div class="papel">📝 Resolvé en el cuaderno, con todos los pasos.</div>
        <div class="nav"><button class="chip" id="ant">← ${S.i>0?"Anterior":"Volver a la teoría"}</button>
          <button class="sig" id="sigS">${S.i+1<n?"Siguiente problema →":"Terminar y corregir"}</button></div></div>`;
    $("#ant").onclick=()=>{ if(S.i>0) S.i--; else { S.parte="t"; S.i=S.teoria.length-1; } simPantalla(); };
    $("#sigS").onclick=()=>{ if(S.i+1<n){ S.i++; simPantalla(); } else { pararSim(); corregirTeoria(); } };
  }
  salirConfirmando(); crono(); window.scrollTo(0,0);
}
const pts = x => String(+x.toFixed(1)).replace(".",",");
function corregirTeoria(){
  contarTiempo(); S.usado=Math.round((Date.now()-S.inicio)/60000);
  S.parte="c";
  const ok=S.teoria.filter(x=>x.elegida>=0 && x.ops[x.elegida].bien).length;
  S.okT=ok;
  S.teoria.forEach(x=>marcarVista(x.p, x.elegida>=0 && x.ops[x.elegida].bien)); guardar();
  const maxT = S.probs.length ? 40 : 100;
  app.innerHTML = `<div class="cab-ej"><span></span><h2>Corrección</h2>${AA_BTN}</div>
    ${S.seAcabo?`<p class="aviso">⏱ Se terminó el tiempo. Corregimos lo que hiciste.</p>`:""}
    <div class="tarjeta"><span class="tema" style="--tc:var(--rosa-osc)">Teoría</span>
      <p class="preg">${ok} de ${S.teoria.length} bien → ${pts(ok*S.ptsT)} de ${maxT} puntos</p></div>
    <div class="falladas">${S.teoria.map(x=>{ const bien=x.elegida>=0&&x.ops[x.elegida].bien;
      return `<div class="falla ${bien?"bienc":""}"><div class="q">${bien?"✅":"❌"} ${F(x.p.q)}</div>
        ${bien?"":`<div class="tu">Elegiste: ${x.elegida>=0?F(x.ops[x.elegida].txt):"(sin responder)"}</div><div class="r">✓ ${F(x.p.o[0])}</div><div class="e">${F(x.p.e)} · 📖 ${x.p.s}</div>`}</div>`; }).join("")}</div>
    <div class="acciones"><button class="sig" id="aProb">${S.probs.length?"Corregir los problemas →":"Ver la nota →"}</button></div>`;
  window.scrollTo(0,0);
  anotar({tipo:"partida", modo:conMateria("Simulacro (teoría)"), repaso:false, aciertos:ok, total:S.teoria.length,
    respuestas:S.teoria.map(x=>({id:x.p.id, tema:TEMAS[x.p.b].nom, pregunta:x.p.q, bien:x.elegida>=0&&x.ops[x.elegida].bien,
      elegida:x.elegida>=0?x.ops[x.elegida].txt:"(sin responder)", correcta:x.p.o[0], seg:Math.round(x.seg||0)}))});
  $("#aProb").onclick=()=>{ S.i=0; if(S.probs.length) corregirProblema(); else notaFinal(); };
}
function corregirProblema(){
  const e=S.probs[S.i], n=S.probs.length;
  app.innerHTML = `<div class="cab-ej"><span></span><h2>Problema ${S.i+1} de ${n}</h2>${AA_BTN}</div>
    <div class="tarjeta"><span class="tema" style="--tc:var(--tinta)">${F(e.t)}</span>
      <p class="enun">${F(e.q)}</p>${fig(e)}
      <div class="pasos">${e.p.map(([et,tx])=>`<div class="paso"><b>${F(et)}</b>${T(tx)}</div>`).join("")}<div class="paso final"><b>Respuesta</b>${T(e.r)}</div></div>
      <p class="preg" style="font-size:17px">Comparalo con tu cuaderno. ¿Cómo te salió?</p>
      <div class="tal"><button data-n="20">✅ Bien<br><small>20 puntos</small></button><button data-n="10">🟡 A medias<br><small>10 puntos</small></button><button data-n="0">❌ Mal<br><small>0 puntos</small></button></div>
      <p class="ayuda" style="text-align:left;margin-top:8px">"A medias": ${M.ejercicios.aMedias||"el planteo estaba bien pero hubo un error en el camino."}</p></div>`;
  window.scrollTo(0,0);
  app.querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>{
    const p=+b.dataset.n; S.notas[S.i]=p;
    anotar({tipo:"ejercicio", id:"sim*", nivel:conMateria("Simulacro"), ejercicio:e.nom, resultado:p===20?"Bien":p===10?"A medias":"Mal", enunciado:e.q, respuesta:textoPlano(e.r)});
    if(S.i+1<n){ S.i++; corregirProblema(); } else notaFinal();
  });
}
function notaFinal(){
  const pT=Math.round(S.okT*S.ptsT), pP=S.notas.reduce((a,b)=>a+b,0), pct=Math.min(100,pT+pP);
  const maxT = S.probs.length ? 40 : 100;
  guardarSim(S, pct, Math.min(40,pT), S.probs.map(e=>e.nom));
  anotar({tipo:"simulacro", nota:pct, teoria:`${S.okT} de ${S.teoria.length}`, puntosTeoria:Math.min(40,pT),
    problemas:S.probs.map((e,k)=>({ejercicio:e.nom, puntos:S.notas[k]})), minutos:S.min, usados:S.usado, seAcabo:!!S.seAcabo});
  const tit = pct>=80?"¡Muy bien preparada!":pct>=60?"¡Vas bien!":"Todavía falta un poco";
  const msj = pct>=80?"Seguí repasando con la prueba mezclada para no perder el ritmo."
    : pct>=60?"Repasá las preguntas que fallaste y leé otra vez el resumen de esos temas."
    : "Volvé a los temas con menos frutillas y leé el resumen. Después hacé otro simulacro.";
  app.innerHTML = `<div class="top"><span></span>${AA_BTN}</div>
    <div class="res-cab"><img src="${A}${pct>=60?"sofi":"dina"}.webp" alt=""><h2>${tit}</h2>
      <div class="nota">${pct} de 100 puntos</div><p>${msj}</p></div>
    <div class="temas"><h3>Detalle</h3>
      <div class="fila" style="--tc:var(--b1)"><span>Teoría (${S.okT} de ${S.teoria.length})</span><span>${pT} / ${maxT}</span><div class="barra"><i style="width:${pT/maxT*100}%"></i></div></div>
      ${S.probs.map((e,k)=>`<div class="fila" style="--tc:var(--b3)"><span>Problema ${k+1}: ${F(e.nom)}</span><span>${S.notas[k]} / 20</span><div class="barra"><i style="width:${S.notas[k]/20*100}%"></i></div></div>`).join("")}
    </div>
    <div class="acciones"><button class="sig" id="otroSim">Hacer otro simulacro</button>
      <button class="btn mix" id="volver" style="justify-content:center"><span class="nom" style="text-align:center;flex:none">Menú</span></button></div>`;
  window.scrollTo(0,0);
  if(pct>=60) sBien();
  S=null;
  $("#otroSim").onclick=simulacro; $("#volver").onclick=menu;
}

/* ---------- teclado ---------- */
document.addEventListener("keydown",e=>{
  if(!P || !$("#tarj") || document.querySelector(".hoja")) return;
  const k="1234abcd".indexOf(e.key.toLowerCase());
  if(k>=0 && !P.listo){ if(k%4 < P.ops.length) responder(k%4); }
  else if((e.key==="Enter"||e.key===" ") && P.listo && $("#sig")){ e.preventDefault(); $("#sig").click(); }
});
/* ---------- panel de letra y tamaño ---------- */
function abrirLetras(){
  if(document.querySelector(".hoja")) return;
  Object.keys(LETRAS).forEach(cargarLetra);
  const enJuego = P && !P.listo && datos.apuro && document.getElementById("dina");
  if(enJuego){ P.pausa = (P.f||0)*DURA; pararReloj(); }
  const hoja=document.createElement("div"); hoja.className="hoja";
  const pintar=()=>{
    const pct=Math.round(datos.escala*100);
    hoja.innerHTML=`<div class="panel" role="dialog" aria-modal="true" aria-label="Letra y tamaño">
      <div class="fila-cab"><h2>Letra y tamaño</h2><button class="redondo" id="cerrarL" aria-label="Cerrar">✕</button></div>
      ${enJuego?`<p class="sub" style="margin-top:0">⏸ El reloj está en pausa mientras elegís.</p>`:""}
      <div class="sub">Letra</div>
      <div class="letras">${Object.entries(LETRAS).map(([k,l])=>`<button class="letra" data-l="${k}" aria-pressed="${k===datos.letra}" style="font-family:'${l.f}',Verdana,sans-serif">
        <span class="ln">${l.nom}</span><span class="lm">${F(M.muestraCorta||"Aa Bb 1992")}</span><span class="lf">${l.f}</span></button>`).join("")}</div>
      <div class="sub">Tamaño</div>
      <div class="tam"><button class="menos" id="tmenos" aria-label="Letra más chica" ${datos.escala<=ESCALAS[0]?"disabled":""}>A−</button>
        <span class="val">${pct} %</span>
        <button class="mas" id="tmas" aria-label="Letra más grande" ${datos.escala>=ESCALAS[ESCALAS.length-1]?"disabled":""}>A+</button></div>
      <div class="muestra">${F(M.muestra||"")}</div>
      <button class="sig" id="listoL">Listo</button></div>`;
    hoja.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{ datos.letra=b.dataset.l; guardar(); ponerLetra(); pintar(); });
    const mover=d=>{ const i=ESCALAS.indexOf(datos.escala)+d; if(i<0||i>=ESCALAS.length) return; datos.escala=ESCALAS[i]; guardar(); ponerLetra(); pintar(); };
    hoja.querySelector("#tmenos").onclick=()=>mover(-1);
    hoja.querySelector("#tmas").onclick=()=>mover(1);
    hoja.querySelector("#cerrarL").onclick=cerrar; hoja.querySelector("#listoL").onclick=cerrar;
  };
  const cerrar=()=>{ hoja.remove(); document.removeEventListener("keydown",esc,true); if(enJuego && P && !P.listo) arrancarReloj(); };
  const esc=e=>{ if(e.key==="Escape"){ e.stopPropagation(); cerrar(); } };
  hoja.addEventListener("click",e=>{ if(e.target===hoja) cerrar(); });
  document.addEventListener("keydown",esc,true);
  pintar(); document.body.appendChild(hoja);
}
document.addEventListener("click",e=>{ if(e.target.closest(".aa")) abrirLetras(); });

/* ---------- instalar como app ---------- */
let avisoInstalar=null;
function yaInstalada(){ return matchMedia("(display-mode: standalone)").matches || navigator.standalone===true; }
const esIos=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
addEventListener("beforeinstallprompt",e=>{ e.preventDefault(); avisoInstalar=e; });
addEventListener("appinstalled",()=>{ avisoInstalar=null; if($("#instalar")) menu(); });
async function instalar(){
  if(avisoInstalar){ avisoInstalar.prompt(); try{ await avisoInstalar.userChoice; }catch(_){} avisoInstalar=null; menu(); }
  else{ const a=$("#ayudaInst"); a.hidden=false;
    a.innerHTML = esIos() ? "En el iPhone: tocá <b>Compartir</b> (el cuadrado con la flecha) y después <b>Agregar a pantalla de inicio</b>."
      : "Tocá el menú <b>⋮</b> de Chrome (arriba a la derecha) y elegí <b>Agregar a pantalla principal</b> → <b>Instalar</b>."; }
}
if("serviceWorker" in navigator) addEventListener("load",()=>navigator.serviceWorker.register("../sw.js",{scope:"../"}).catch(()=>{}));

/* arranque: "#falladas" abre directo el repaso de las más falladas (botón de Mi progreso) */
function arrancar(){
  const f = location.hash==="#falladas" ? masFalladas(10) : [];
  history.replaceState(null,"",location.pathname);
  if(f.length) empezar("mix", f); else menu();
}
arrancar();
reenviar();
/* copia en la nube: unir con lo que haya (por si se usó en otro teléfono o se borraron los datos) */
if(window.Nube) Nube.abrir(M.clave, ()=>datos, m=>{
  Object.assign(datos, m); Nube.meta(datos, M.nombre, TEMAS, BANCO);
  try{ localStorage.setItem(M.clave, JSON.stringify(datos)); }catch(_){}
  if(!P && !S && app.querySelector(".lista")) menu();          // si está en el menú, mostrar las frutillas nuevas
});
})();

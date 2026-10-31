/* Dina Biología — datos de la materia (los usa ../comun/motor.js).
   Tema del examen (Prueba Global, martes 3/11): genética. Organismo puro, genotipo y fenotipo,
   leyes de Mendel, análisis de pedigrí y herencia ligada al sexo (cuaderno de Sofía).
   En el banco, la primera opción de cada pregunta es la correcta (se mezclan al mostrarlas).
   X^H se escribe X con H arriba. */
(function(){
"use strict";

/* =====================  DIBUJOS  ===================== */
/* Cuadro de Punnett. g1 = gametos de arriba, g2 = gametos de la izquierda, celda(a,b) → {txt, cl} */
function punnett(g1, g2, celda, chico){
  const h = x => x.replace(/X([A-Za-z])/g,"X<sup>$1</sup>");
  return `<div class="desliza"><table class="punnett${chico?" chico":""}"><tr><th></th>${g1.map(g=>`<th>${h(g)}</th>`).join("")}</tr>`
    + g2.map(b=>`<tr><th>${h(b)}</th>${g1.map(a=>{ const c=celda(a,b); return `<td class="${c.cl||""}">${h(c.txt)}</td>`; }).join("")}</tr>`).join("")
    + `</table></div>`;
}

/* Árbol genealógico (pedigrí).
   g: generaciones, cada una con personas {s:"m"|"f", x:columna, a:afectado, p:portadora}
   parejas: [gen, i, j]   hijos: [gen, i, j, [índices en la generación siguiente]] */
function pedigri(sp){
  const W=58, X0=48, Y0=26, H=88, R=13;
  const pos = (g,i)=>[X0+sp.g[g][i].x*W, Y0+g*H];
  const maxX = Math.max(...sp.g.flat().map(p=>p.x));
  const ancho = X0 + maxX*W + 34, alto = Y0 + (sp.g.length-1)*H + 40;
  let s = `<svg class="ped" viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="Árbol genealógico">`;
  (sp.parejas||[]).forEach(([g,i,j])=>{ const [a,y]=pos(g,i), [b]=pos(g,j); s+=`<line class="l" x1="${a+R}" y1="${y}" x2="${b-R}" y2="${y}"/>`; });
  (sp.hijos||[]).forEach(([g,i,j,ks])=>{ const [a,y]=pos(g,i), [b]=pos(g,j), mx=(a+b)/2, yb=y+H/2;
    const xs=ks.map(k=>pos(g+1,k)[0]);
    s+=`<line class="l" x1="${mx}" y1="${y}" x2="${mx}" y2="${yb}"/><line class="l" x1="${Math.min(mx,...xs)}" y1="${yb}" x2="${Math.max(mx,...xs)}" y2="${yb}"/>`;
    xs.forEach(x=> s+=`<line class="l" x1="${x}" y1="${yb}" x2="${x}" y2="${y+H-R}"/>`); });
  sp.g.forEach((fila,g)=>{
    s += `<text class="gen" x="8" y="${Y0+g*H+5}">${["I","II","III","IV"][g]}</text>`;
    fila.forEach((p,i)=>{ const [x,y]=pos(g,i), cl="i"+(p.a?" a":"");
      s += p.s==="m" ? `<rect class="${cl}" x="${x-R}" y="${y-R}" width="${2*R}" height="${2*R}"/>` : `<circle class="${cl}" cx="${x}" cy="${y}" r="${R}"/>`;
      if(p.p) s += `<circle class="pt" cx="${x}" cy="${y}" r="4.5"/>`;
      s += `<text x="${x}" y="${y+R+15}" text-anchor="middle">${i+1}</text>`; });
  });
  return s + `</svg>`;
}
const m=(x,o)=>Object.assign({s:"m",x},o), f=(x,o)=>Object.assign({s:"f",x},o);

// Padres sanos, una hija afectada → autosómica recesiva
const PED_REC = pedigri({g:[[m(0.5),f(2.5)],[m(0),f(1.5,{a:true}),m(3)]], parejas:[[0,0,1]], hijos:[[0,0,1,[0,1,2]]]});
// Madre portadora, un hijo varón afectado → ligada al X recesiva
const PED_X = pedigri({g:[[m(1),f(3,{p:true})],[m(0,{a:true}),f(1.33),m(2.66),f(4,{p:true})]], parejas:[[0,0,1]], hijos:[[0,0,1,[0,1,2,3]]]});
// Aparece en todas las generaciones → autosómica dominante
const PED_DOM = pedigri({g:[[m(1,{a:true}),f(3)],[f(0,{a:true}),m(1.3),m(2.7),m(4,{a:true})],[m(0,{a:true}),f(1.3)]],
  parejas:[[0,0,1],[1,0,1]], hijos:[[0,0,1,[0,2,3]],[1,0,1,[0,1]]]});
// Abuelo daltónico → hija portadora → nieto daltónico
const PED_ABUELO = pedigri({g:[[m(0.5,{a:true}),f(2.5)],[f(0.5,{p:true}),m(1.8),m(3.4)],[m(0,{a:true}),f(1.6)]],
  parejas:[[0,0,1],[1,0,1]], hijos:[[0,0,1,[0,2]],[1,0,1,[0,1]]]});
// Símbolos
const PED_SIMB = pedigri({g:[[m(0),f(1.6)],[m(0,{a:true}),f(1.6,{a:true}),f(3.2,{p:true})]], parejas:[[0,0,1]], hijos:[[0,0,1,[0,1,2]]]});
const LEYENDA = `<p class="ley">□ varón · ○ mujer · ■ ● afectado · ⊙ portadora (punto) · ─ pareja · las líneas de abajo van a los hijos · I, II, III = generaciones</p>`;

/* =====================  CRUZAMIENTOS CON NÚMEROS NUEVOS  ===================== */
const azar = a => a[Math.floor(Math.random()*a.length)];
const RASGOS = [
  {org:"cobayos",          uno:"un cobayo",          car:"color del pelaje",   D:"negro",    R:"blanco",  L:"N"},
  {org:"plantas de arveja", uno:"una planta de arveja", car:"color de la semilla", D:"amarilla", R:"verde",   L:"A"},
  {org:"plantas de arveja", uno:"una planta de arveja", car:"forma de la semilla", D:"lisa",     R:"rugosa",  L:"R"},
  {org:"plantas de arveja", uno:"una planta de arveja", car:"altura del tallo",    D:"alto",     R:"enano",   L:"T"},
  {org:"conejos",          uno:"un conejo",          car:"largo del pelo",      D:"corto",    R:"largo",   L:"L"},
  {org:"plantas",          uno:"una planta",         car:"color de la flor",    D:"púrpura",  R:"blanca",  L:"P"}
];
const DIHIB = [
  [RASGOS[0], {org:"cobayos", car:"largo del pelo", D:"corto", R:"largo", L:"L"}],
  [RASGOS[1], RASGOS[2]],
  [RASGOS[3], RASGOS[5]]
];
const ordenar = g => g.split("").sort((a,b)=> a.toLowerCase()===b.toLowerCase() ? (a<b?-1:1) : 0).join(""); // Nn, nunca nN
const gametos1 = g => [...new Set(g.split(""))];
const pct = (k,n) => { const v=100*k/n; return String(+v.toFixed(2)).replace(".",",")+" %"; };
const frac = (k,n) => { const g=(a,b)=>b?g(b,a%b):a, d=g(k,n); return `${k/d}/${n/d}`; };
const comoTexto = g => g.replace(/X([A-Za-z])/g,"X^$1");

function mono(){
  const r=azar(RASGOS), D=r.L, d=r.L.toLowerCase();
  const [p1,p2] = azar([[D+D,d+d],[D+d,D+d],[D+d,d+d],[D+D,D+d]]);
  const nombre = g => `${g} (${g.includes(D)?r.D:r.R})`;
  const g1=gametos1(p1), g2=gametos1(p2);
  const cuenta={}; let n=0; g1.forEach(a=>g2.forEach(b=>{ const x=ordenar(a+b); cuenta[x]=(cuenta[x]||0)+1; n++; }));
  // con 1 gameto por lado igual se piensa en 4 casillas
  const mult = 4/n; Object.keys(cuenta).forEach(k=>cuenta[k]*=mult); n=4;
  const geno = [D+D,D+d,d+d].filter(k=>cuenta[k]);
  const dom = (cuenta[D+D]||0)+(cuenta[D+d]||0), rec = cuenta[d+d]||0;
  const tipoG = k => k===D+D?"homocigoto dominante":k===D+d?"heterocigoto":"homocigoto recesivo";
  const fen = [dom?`${pct(dom,4)} ${r.D}`:"", rec?`${pct(rec,4)} ${r.R}`:""].filter(Boolean).join(", ");
  const tabla = punnett(g1.length===1?[g1[0],g1[0]]:g1, g2.length===1?[g2[0],g2[0]]:g2, (a,b)=>({txt:ordenar(a+b), cl:ordenar(a+b)===d+d?"po":""}));
  return {t:"Monohíbrido · "+r.car,
    q:`En ${r.org} (carácter: ${r.car}), ${r.D} (${D}) domina sobre ${r.R} (${d}). Se cruza ${r.uno} ${nombre(p1)} con ${r.uno} ${nombre(p2)}. ¿Qué genotipos y fenotipos tendrán los hijos y en qué porcentaje?`,
    p:[["Alelos", `${D} = ${r.D} (dominante)\n${d} = ${r.R} (recesivo)`],
       ["Genotipos de los padres", `${p1} × ${p2}`],
       ["Gametos", `Padre 1: ${g1.join(" y ")}\nPadre 2: ${g2.join(" y ")}`],
       ["Cuadro de Punnett", {html:tabla}],
       ["Contá las casillas", geno.map(k=>`${k}: ${cuenta[k]} de 4`).join("\n")]],
    r:`Genotipo: ${geno.map(k=>`${pct(cuenta[k],4)} ${k} (${tipoG(k)})`).join(", ")}\nFenotipo: ${fen}`};
}

function dihib(){
  const [r1,r2]=azar(DIHIB), A=r1.L, a=A.toLowerCase(), B=r2.L, b=B.toLowerCase();
  const caso = azar(["F2","prueba","F1","F2"]);
  const [p1,p2] = caso==="F2" ? [A+a+B+b, A+a+B+b] : caso==="prueba" ? [A+a+B+b, a+a+b+b] : [A+A+B+B, a+a+b+b];
  const gam = g => [...new Set([g[0]+g[2],g[0]+g[3],g[1]+g[2],g[1]+g[3]])];
  const g1=gam(p1), g2=gam(p2);
  const fenot = x => (x.includes(A)?r1.D:r1.R)+" y "+(x.includes(B)?r2.D:r2.R);
  const cl = x => (!x.includes(A) && !x.includes(B)) ? "po" : "";
  const cuenta={}; let n=0;
  g1.forEach(u=>g2.forEach(v=>{ const k=fenot(u+v); cuenta[k]=(cuenta[k]||0)+1; n++; }));
  const orden=[r1.D+" y "+r2.D, r1.D+" y "+r2.R, r1.R+" y "+r2.D, r1.R+" y "+r2.R].filter(k=>cuenta[k]);
  const geno = (u,v) => ordenar(u[0]+v[0])+ordenar(u[1]+v[1]);
  const desc = g => `${g} (${g.includes(A)?r1.D:r1.R} y ${g.includes(B)?r2.D:r2.R})`;
  const tabla = punnett(g2, g1, (v,u)=>({txt:geno(u,v), cl:cl(u+v)}), g1.length*g2.length>4);
  const total = n;
  const prop = orden.map(k=>`${total===16?frac(cuenta[k],total):pct(cuenta[k],total)} ${k}`).join("\n");
  return {t:"Dihíbrido · "+r1.car+" y "+r2.car,
    q:`En ${r1.org}, ${r1.D} (${A}) domina sobre ${r1.R} (${a}) y ${r2.D} (${B}) domina sobre ${r2.R} (${b}). Se cruza ${r1.uno} ${desc(p1)} con ${r1.uno} ${desc(p2)}. ¿Qué fenotipos tendrán los hijos y en qué proporción?`,
    p:[["Alelos", `${A} = ${r1.D}, ${a} = ${r1.R}\n${B} = ${r2.D}, ${b} = ${r2.R}`],
       ["Genotipos de los padres", `${p1} × ${p2}`],
       ["Gametos", `Padre 1: ${g1.join(", ")}\nPadre 2: ${g2.join(", ")}`+(g1.length===4&&g2.length===4?"\nCada padre da 4 gametos → 4 × 4 = 16 casillas":"")],
       ["Cuadro de Punnett", {html:tabla}],
       ["Agrupá por fenotipo", orden.map(k=>`${k}: ${cuenta[k]} de ${total}`).join("\n")+(orden.length===4?`\nSon ${orden.length} grupos. Revisá que sumen ${total}.`:"")]],
    r:`Fenotipo:\n${prop}`+(caso==="F2"?"\nProporción 9 : 3 : 3 : 1":caso==="prueba"?"\nProporción 1 : 1 : 1 : 1":"\nTodos iguales (primera ley de Mendel)")};
}

const ENF = [
  {nom:"hemofilia", art:"La", L:"H", af:"con hemofilia", sano:"normal", mujerAf:false},
  {nom:"daltonismo", art:"El", L:"D", af:"daltónico", afF:"daltónica", sano:"normal", mujerAf:true}
];
function sexo(){
  const e=azar(ENF), H=e.L, h=H.toLowerCase();
  const casos=[["XHXh","XHY"],["XHXh","XhY"],["XHXH","XhY"]]; if(e.mujerAf) casos.push(["XhXh","XHY"]);
  let [ma,pa]=azar(casos); ma=ma.replace(/H/g,H).replace(/h/g,h); pa=pa.replace(/H/g,H).replace(/h/g,h);
  const descM = g => g==="X"+H+"X"+H ? "una mujer normal (no portadora)" : g==="X"+H+"X"+h ? "una mujer portadora" : `una mujer ${e.afF}`;
  const descP = g => g==="X"+H+"Y" ? "un varón normal" : `un varón ${e.af}`;
  const gM=[ma.slice(0,2),ma.slice(2)], gP=[pa.slice(0,2),"Y"];
  const hijo = (x,y)=>{ // x de la madre, y del padre
    if(y==="Y") return x==="X"+h ? {g:x+"Y", t:`varón ${e.af}`, cl:"af"} : {g:x+"Y", t:"varón normal"};
    const g=[x,y].sort((u,v)=>u<v?-1:1).join(""); // X^H antes que X^h
    const n=(g.match(new RegExp("X"+h,"g"))||[]).length;
    return n===2 ? {g, t:`mujer ${e.afF||e.af}`, cl:"af"} : n===1 ? {g, t:"mujer portadora (sana)", cl:"po"} : {g, t:"mujer normal"};
  };
  const cel=[]; gM.forEach(x=>gP.forEach(y=>cel.push(hijo(x,y))));
  const grupos={}; cel.forEach(c=>{ const k=c.g+"|"+c.t; grupos[k]=(grupos[k]||0)+1; });
  const lista=Object.entries(grupos).map(([k,v])=>{ const [g,t]=k.split("|"); return `${pct(v,4)} ${comoTexto(g)} → ${t}`; });
  const hijas=cel.filter(c=>!c.g.endsWith("Y")), hijos=cel.filter(c=>c.g.endsWith("Y"));
  const resumir = (arr,todas) => { const c={}; arr.forEach(x=>c[x.t]=(c[x.t]||0)+1); const e=Object.entries(c);
    return e.length===1 ? `${todas}: ${e[0][0]}` : e.map(([t])=>`la mitad: ${t}`).join(" · "); };
  const tabla = punnett(gP, gM, (y,x)=>{ const c=hijo(x,y); return {txt:c.g, cl:c.cl}; });
  return {t:"Herencia ligada al sexo · "+e.nom,
    q:`${e.art} ${e.nom} se debe a un alelo recesivo (${h}) del cromosoma X. El alelo normal es ${H}. Se casan ${descM(ma)} y ${descP(pa)}. ¿Cómo pueden ser sus hijos e hijas?`,
    p:[["Alelos", `X^${H} = normal\nX^${h} = ${e.nom}\nEl cromosoma Y no lleva este gen.`],
       ["Genotipos de los padres", `Madre ${comoTexto(ma)} × Padre ${comoTexto(pa)}`],
       ["Gametos", `Madre: X^${ma[1]} y X^${ma[3]}\nPadre: X^${pa[1]} y Y`],
       ["Cuadro de Punnett", {html:tabla}],
       ["Separá por sexo", `Hijas (reciben el X del padre): ${resumir(hijas,"todas")}\nHijos varones (reciben el Y del padre y el X de la madre): ${resumir(hijos,"todos")}`]],
    r:`${lista.join("\n")}`};
}

/* =====================  MATERIA  ===================== */
window.MATERIA = {
  nombre:"Biología", corto:"Biología", titulo:"Dina Biología", clave:"dinaBio.v1",
  lema:"¡Psst! Respondé bien y Dina no se come la torta",
  pie:"Preguntas del cuaderno de Biología: herencia y genética",
  muestraCorta:"X^HX^h  Nn",
  muestra:"Nn × Nn → 75 % negro, 25 % blanco\nX^HX^h × X^HY",
  temas:{
    b1:{nom:"Conceptos", sub:"puro, genotipo, fenotipo, alelos", c:"var(--b1)", s:"var(--b1s)"},
    b2:{nom:"Leyes de Mendel", sub:"monohíbrido, dihíbrido, proporciones", c:"var(--b2)", s:"var(--b2s)"},
    b3:{nom:"Ligada al sexo", sub:"hemofilia, daltonismo, Duchenne", c:"var(--b3)", s:"var(--b3s)"},
    b4:{nom:"Pedigrí", sub:"leer un árbol genealógico", c:"var(--b4)", s:"var(--b4s)"}
  },
  banco:[
/* ---------- Conceptos ---------- */
{id:"c1",b:"b1",q:"¿Qué es un organismo puro?",o:["El que es homocigoto para un carácter (AA o aa)","El que es heterocigoto (Aa)","El que no tiene ninguna enfermedad","El que tiene solo alelos dominantes en todos sus genes"],e:"Organismo puro = homocigoto para un carácter: sus dos alelos son iguales (AA o aa).",s:"Cuaderno: Conceptos"},
{id:"c2",b:"b1",q:"¿Qué es el genotipo?",o:["La dotación genética de un individuo: los alelos que tiene para un carácter","La característica que se ve por fuera","El número de cromosomas de una célula","La célula sexual que da cada padre"],e:"Genotipo: la dotación genética, formada generalmente por dos genes (alelos), por ejemplo Nn.",s:"Cuaderno: Conceptos"},
{id:"c3",b:"b1",q:"¿Qué es el fenotipo?",o:["La característica externa que presenta un individuo, determinada por el genotipo","Los dos alelos que tiene un individuo","Un gen que siempre se manifiesta","El cuadro que se usa para hacer los cruces"],e:"Fenotipo: lo que se ve o se manifiesta (pelaje negro, semilla verde). Depende del genotipo.",s:"Cuaderno: Conceptos"},
{id:"c4",b:"b1",q:"¿Cuál de estos es un fenotipo?",o:["Pelaje negro","Nn","NN","nn"],e:"Nn, NN y nn son genotipos (letras de los alelos). \"Pelaje negro\" es lo que se ve: fenotipo.",s:"Cuaderno: Conceptos"},
{id:"c5",b:"b1",q:"¿Qué genotipo es heterocigoto?",o:["Nn","NN","nn","NN y nn"],e:"Heterocigoto: los dos alelos son distintos (Nn). Homocigoto: los dos iguales (NN o nn).",s:"Cuaderno: Conceptos"},
{id:"c6",b:"b1",q:"El negro (N) domina sobre el blanco (n). ¿De qué color es un cobayo Nn?",o:["Negro","Blanco","Gris, una mezcla","No se puede saber"],e:"Con un solo alelo dominante (N) ya se manifiesta el carácter dominante. Nn es negro.",s:"Cuaderno: Conceptos"},
{id:"c7",b:"b1",q:"Un individuo muestra el carácter recesivo. ¿Cuál es su genotipo?",o:["Homocigoto recesivo (aa)","Heterocigoto (Aa)","Homocigoto dominante (AA)","Puede ser AA o Aa"],e:"El carácter recesivo solo se ve cuando están los dos alelos recesivos: aa.",s:"Cuaderno: Conceptos"},
{id:"c8",b:"b1",q:"¿Qué es un alelo?",o:["Cada una de las formas distintas que puede tener un mismo gen","Un cromosoma completo","Una enfermedad hereditaria","Un individuo de la primera generación"],e:"Ejemplo: para el color del pelaje hay dos alelos, N (negro) y n (blanco).",s:"Cuaderno: Conceptos"},
{id:"c9",b:"b1",q:"¿Cuántos alelos de cada gen tiene un individuo?",o:["Dos: uno del padre y uno de la madre","Uno solo","Cuatro","Depende del fenotipo"],e:"Por eso el genotipo se escribe con dos letras (Nn): una vino del padre y otra de la madre.",s:"Cuaderno: Conceptos"},
{id:"c10",b:"b1",q:"¿Cuántos alelos de un gen lleva cada gameto (óvulo o espermatozoide)?",o:["Uno","Dos","Cuatro","Ninguno"],e:"Los gametos llevan un solo alelo de cada gen. Al unirse, el hijo vuelve a tener dos.",s:"Cuaderno: Conceptos"},
{id:"c11",b:"b1",q:"NN y Nn, ¿tienen el mismo fenotipo?",o:["Sí, los dos muestran el dominante, aunque el genotipo es distinto","No, NN es más oscuro","No, Nn muestra el recesivo","Sí, porque tienen el mismo genotipo"],e:"Distinto genotipo, mismo fenotipo: los dos son negros porque tienen al menos una N.",s:"Cuaderno: Conceptos"},
{id:"c12",b:"b1",q:"¿Cómo se escribe el alelo dominante?",o:["Con letra mayúscula (N)","Con letra minúscula (n)","Con un número","Con la letra X"],e:"Dominante en mayúscula (N), recesivo en minúscula (n), con la misma letra.",s:"Cuaderno: Conceptos"},
{id:"c13",b:"b1",q:"¿Con qué trabajó Gregor Mendel para descubrir las leyes de la herencia?",o:["Con plantas de arveja","Con moscas de la fruta","Con cobayos","Con bacterias"],e:"Mendel cruzó plantas de arveja y contó cómo aparecían los caracteres en los hijos.",s:"Leyes de Mendel"},
{id:"c14",b:"b1",q:"¿Qué es un alelo recesivo?",o:["El que solo se manifiesta si está en los dos alelos (aa)","El que siempre se manifiesta","El que está solo en los varones","El que aparece en la F1"],e:"El recesivo queda \"tapado\" por el dominante. Solo se ve en homocigosis: aa.",s:"Cuaderno: Conceptos"},
/* ---------- Leyes de Mendel ---------- */
{id:"m1",b:"b2",q:"Primera ley de Mendel (uniformidad): si se cruzan dos individuos puros distintos (AA × aa), ¿cómo es la F1?",o:["Todos iguales: Aa, con el fenotipo dominante","La mitad AA y la mitad aa","75 % dominante y 25 % recesivo","Todos aa"],e:"AA solo da gametos A y aa solo da a. Todos los hijos son Aa: 100 % heterocigotos, con el dominante.",s:"Cuaderno: Leyes de Mendel, ejercicio 1"},
{id:"m2",b:"b2",q:"Negro (N) domina sobre blanco (n). Se cruza NN × nn. ¿Cómo es la F1?",o:["100 % negro, 100 % Nn","50 % negro y 50 % blanco","75 % negro y 25 % blanco","100 % blanco"],e:"Todos reciben N de un padre y n del otro: Nn, negros. Es la primera ley.",s:"Cuaderno: Leyes de Mendel, ejercicio 1"},
{id:"m3",b:"b2",q:"Se cruza Nn × Nn (F1 × F1). ¿Qué fenotipos salen en la F2?",o:["75 % negro y 25 % blanco","100 % negro","50 % negro y 50 % blanco","25 % negro y 75 % blanco"],e:"Cuadro: NN, Nn, Nn, nn. Tres negros y uno blanco: 3 : 1 (75 % y 25 %).",s:"Cuaderno: Leyes de Mendel, ejercicio 1"},
{id:"m4",b:"b2",q:"Se cruza Nn × Nn. ¿Qué genotipos salen?",o:["25 % NN, 50 % Nn, 25 % nn","50 % NN y 50 % nn","75 % Nn y 25 % nn","100 % Nn"],e:"Proporción de genotipos 1 : 2 : 1. Ojo: la de fenotipos es 3 : 1.",s:"Cuaderno: Leyes de Mendel, ejercicio 1"},
{id:"m5",b:"b2",q:"¿Qué dice la segunda ley de Mendel (segregación)?",o:["Los dos alelos de un gen se separan al formar los gametos, y en la F2 reaparece el recesivo","Todos los hijos de dos puros son iguales","Los caracteres se heredan juntos","Los varones heredan todo de la madre"],e:"Cada gameto lleva un solo alelo. Por eso al cruzar Aa × Aa vuelve a aparecer aa (25 %).",s:"Leyes de Mendel"},
{id:"m6",b:"b2",q:"¿Qué dice la tercera ley de Mendel (transmisión independiente)?",o:["Cada carácter se hereda independiente del otro","Los alelos dominantes desaparecen","Todos los hijos son iguales","Un carácter solo se hereda por el padre"],e:"Por ejemplo, el color del pelaje no influye en el largo del pelo. Por eso sale 9 : 3 : 3 : 1.",s:"Cuaderno: Leyes de Mendel, ejercicio 2"},
{id:"m7",b:"b2",q:"Se cruza Nn × nn. ¿Qué fenotipos salen?",o:["50 % dominante y 50 % recesivo","75 % dominante y 25 % recesivo","100 % dominante","100 % recesivo"],e:"Cuadro: Nn, Nn, nn, nn. Mitad y mitad (1 : 1).",s:"Leyes de Mendel"},
{id:"m8",b:"b2",q:"¿Para qué sirve el cruzamiento de prueba?",o:["Para saber si un individuo dominante es AA o Aa, cruzándolo con uno aa","Para saber si un individuo es varón o mujer","Para obtener siempre individuos puros","Para ver si un carácter está ligado al sexo"],e:"Se cruza con un homocigoto recesivo (aa). Si sale algún hijo recesivo, el padre era Aa.",s:"Leyes de Mendel"},
{id:"m9",b:"b2",q:"En un cruce de prueba con aa, todos los hijos salen con el fenotipo dominante. ¿Cómo era el otro padre?",o:["AA (homocigoto dominante)","Aa (heterocigoto)","aa","No se puede saber"],e:"Si fuera Aa, la mitad de los hijos sería aa. Como todos son dominantes, era AA.",s:"Leyes de Mendel"},
{id:"m10",b:"b2",q:"¿Qué gametos da un individuo NnLl?",o:["NL, Nl, nL y nl","Nn y Ll","N, n, L y l","NL y nl"],e:"Cada gameto lleva un alelo de cada gen. Combinaciones: NL, Nl, nL, nl.",s:"Cuaderno: Leyes de Mendel, ejercicio 2"},
{id:"m11",b:"b2",q:"En el dihíbrido NnLl × NnLl, ¿cuántas casillas tiene el cuadro de Punnett?",o:["16","4","8","9"],e:"Cada padre da 4 gametos distintos: 4 × 4 = 16 casillas.",s:"Cuaderno: Leyes de Mendel, ejercicio 2"},
{id:"m12",b:"b2",q:"Dihíbrido NnLl × NnLl (negro N > blanco n; corto L > largo l). ¿Qué fracción sale negra de pelo largo?",o:["3/16","9/16","1/16","4/16"],e:"9 negro corto, 3 negro largo, 3 blanco corto, 1 blanco largo. No te olvides del grupo negro largo.",s:"Cuaderno: Leyes de Mendel, ejercicio 2"},
{id:"m13",b:"b2",q:"Dihíbrido NnLl × NnLl. ¿Cuántos grupos de fenotipo distintos salen?",o:["4: 9 + 3 + 3 + 1","3: 9 + 3 + 1","2: 3 + 1","16, uno por casilla"],e:"Cuatro grupos que suman 16: 9 : 3 : 3 : 1. Si te salen 3 grupos, te falta uno.",s:"Cuaderno: Leyes de Mendel, ejercicio 2"},
{id:"m14",b:"b2",q:"Dihíbrido NnLl × NnLl. ¿Qué fracción sale blanca de pelo largo (nnll)?",o:["1/16","3/16","9/16","4/16"],e:"Solo una de las 16 casillas tiene los dos recesivos: nnll.",s:"Cuaderno: Leyes de Mendel, ejercicio 2"},
{id:"m15",b:"b2",q:"¿Qué significa F1?",o:["Primera generación filial: los hijos del primer cruce","El padre de la familia","El fenotipo dominante","El primer alelo del gen"],e:"P = padres, F1 = sus hijos, F2 = hijos de cruzar la F1 entre sí.",s:"Leyes de Mendel"},
/* ---------- Ligada al sexo ---------- */
{id:"s1",b:"b3",q:"¿Qué cromosomas sexuales tiene una mujer y un varón?",o:["Mujer XX, varón XY","Mujer XY, varón XX","Mujer YY, varón XY","Los dos XX"],e:"La mujer tiene dos X. El varón tiene un X y un Y.",s:"Herencia ligada al sexo"},
{id:"s2",b:"b3",q:"¿Dónde están los genes de la herencia ligada al sexo, como la hemofilia y el daltonismo?",o:["En el cromosoma X","En el cromosoma Y","En todos los cromosomas","En la sangre"],e:"Están en el X. El Y no tiene esos genes.",s:"Herencia ligada al sexo"},
{id:"s3",b:"b3",q:"¿Por qué estas enfermedades aparecen más en varones?",o:["Porque tienen un solo X: si tiene el alelo recesivo, no hay otro X que lo tape","Porque el Y lleva la enfermedad","Porque las mujeres no tienen el gen","Porque los varones tienen dos X"],e:"El varón (XY) manifiesta lo que trae su único X. La mujer necesita los dos X afectados.",s:"Herencia ligada al sexo"},
{id:"s4",b:"b3",q:"¿Qué es una mujer portadora?",o:["Una mujer X^HX^h: sana, pero puede pasar el alelo a sus hijos","Una mujer con la enfermedad","Una mujer X^HX^H","Un varón X^hY"],e:"Tiene un X normal que tapa al afectado. No está enferma, pero la mitad de sus gametos lleva X^h.",s:"Cuaderno: Herencia ligada al sexo"},
{id:"s5",b:"b3",q:"Mujer portadora (X^HX^h) × varón normal (X^HY). ¿Qué porcentaje de las hijas tiene hemofilia?",o:["0 %: la mitad de las hijas es portadora y la otra mitad normal","25 %","50 %","100 %"],e:"Las hijas reciben el X^H del padre, que es normal. Ninguna sale con hemofilia: X^HX^H o X^HX^h.",s:"Cuaderno: Herencia ligada al sexo"},
{id:"s6",b:"b3",q:"Mujer portadora (X^HX^h) × varón normal (X^HY). ¿Qué porcentaje del total de hijos es varón con hemofilia?",o:["25 %","50 %","0 %","100 %"],e:"Cuadro: X^HX^H, X^HX^h, X^HY, X^hY. Una de cuatro casillas: 25 % (la mitad de los varones).",s:"Cuaderno: Herencia ligada al sexo"},
{id:"s7",b:"b3",q:"Varón con hemofilia (X^hY) × mujer normal (X^HX^H). ¿Cómo son las hijas?",o:["Todas portadoras (sanas)","Todas con hemofilia","Todas normales, no portadoras","La mitad con hemofilia"],e:"Cada hija recibe el X^h del padre y un X^H de la madre: X^HX^h, portadoras.",s:"Herencia ligada al sexo"},
{id:"s8",b:"b3",q:"Varón con hemofilia (X^hY) × mujer normal (X^HX^H). ¿Cómo son los hijos varones?",o:["Todos sanos: del padre reciben el Y","Todos con hemofilia","La mitad con hemofilia","Todos portadores"],e:"El padre le pasa el Y al hijo varón, no el X. El hijo recibe X^H de la madre: X^HY, sano.",s:"Herencia ligada al sexo"},
{id:"s9",b:"b3",q:"¿Quién define si el hijo será varón o mujer?",o:["El padre: puede dar un X (mujer) o un Y (varón)","La madre","Los dos por igual","El alelo dominante"],e:"La madre siempre da un X. El espermatozoide del padre lleva X o Y.",s:"Herencia ligada al sexo"},
{id:"s10",b:"b3",q:"¿Qué es el daltonismo?",o:["La incapacidad de ver ciertos colores, en general el rojo y el verde","Una falla en la coagulación de la sangre","Una debilidad de los músculos","La ceguera total"],e:"Pasa cuando ciertas neuronas del ojo, llamadas conos, no perciben algunos colores.",s:"Cuaderno: Enfermedades ligadas al sexo"},
{id:"s11",b:"b3",q:"¿Qué es la hemofilia?",o:["Una anormalidad en la coagulación de la sangre","La incapacidad de ver ciertos colores","Una debilidad muscular que empieza en las piernas","Una enfermedad del cromosoma Y"],e:"La sangre no coagula bien, entonces cuesta parar una hemorragia.",s:"Cuaderno: Enfermedades ligadas al sexo"},
{id:"s12",b:"b3",q:"¿Qué es la distrofia muscular de Duchenne?",o:["Una debilidad muscular de rápida progresión que empieza en piernas y pelvis","Una falla en la coagulación","La incapacidad de ver colores","Una enfermedad que solo tienen las mujeres"],e:"Comienza en las piernas y la pelvis y después afecta a todo el cuerpo. Está ligada al X.",s:"Cuaderno: Enfermedades ligadas al sexo"},
{id:"s13",b:"b3",q:"¿Cómo se escribe el genotipo de un varón daltónico?",o:["X^dY","X^DY","X^dX^d","X^DX^d"],e:"El varón tiene un X y un Y. Si es daltónico, su X lleva el alelo recesivo d.",s:"Herencia ligada al sexo"},
{id:"s14",b:"b3",q:"Mujer daltónica (X^dX^d) × varón normal (X^DY). ¿Cómo son los hijos varones?",o:["Todos daltónicos","Todos normales","La mitad daltónicos","Todos portadores"],e:"Los hijos varones reciben su único X de la madre, y ella solo tiene X^d. Todos X^dY.",s:"Herencia ligada al sexo"},
/* ---------- Pedigrí ---------- */
{id:"p1",b:"b4",q:"En un pedigrí, ¿qué representa un cuadrado pintado?",fig:PED_SIMB+LEYENDA,o:["Un varón afectado","Una mujer afectada","Una mujer portadora","Un varón sano"],e:"Cuadrado = varón, círculo = mujer. Pintado = afectado. Un punto en el medio = portadora.",s:"Análisis de pedigrí"},
{id:"p2",b:"b4",q:"¿Qué indica la línea horizontal que une a un varón con una mujer?",o:["Que son pareja (padres)","Que son hermanos","Que los dos están afectados","Que son de distinta generación"],e:"La línea entre los dos es la pareja. De ella baja una línea hacia los hijos.",s:"Análisis de pedigrí"},
{id:"p3",b:"b4",q:"¿Qué tipo de herencia muestra este pedigrí?",fig:PED_REC,o:["Autosómica recesiva: padres sanos con una hija afectada","Autosómica dominante","Ligada al cromosoma Y","No es hereditaria"],e:"Si dos padres sanos tienen un hijo o hija afectado, el carácter es recesivo. Como hay una mujer afectada con padre sano, no es ligada al X.",s:"Análisis de pedigrí"},
{id:"p4",b:"b4",q:"En este pedigrí (herencia recesiva), ¿cuál es el genotipo de los padres I-1 y I-2?",fig:PED_REC,o:["Los dos Aa (portadores)","Los dos AA","Los dos aa","Uno AA y el otro aa"],e:"Son sanos, pero tuvieron una hija aa. Cada uno le pasó un a, entonces los dos son Aa.",s:"Análisis de pedigrí"},
{id:"p5",b:"b4",q:"La madre I-2 es portadora y solo un varón está afectado. ¿Qué tipo de herencia es?",fig:PED_X,o:["Ligada al cromosoma X, recesiva","Autosómica dominante","Ligada al cromosoma Y","Autosómica, pasa solo por el padre"],e:"Madre portadora (punto) y un hijo varón afectado: típico de la herencia ligada al X, como la hemofilia.",s:"Análisis de pedigrí"},
{id:"p6",b:"b4",q:"En este pedigrí, ¿de quién heredó la enfermedad el varón II-1?",fig:PED_X,o:["De la madre, que le pasó el X con el alelo","Del padre, que le pasó el Y","De los dos por igual","De su hermana"],e:"Al hijo varón el padre le da el Y. El X (con el alelo h) vino de la madre portadora.",s:"Análisis de pedigrí"},
{id:"p7",b:"b4",q:"¿Qué tipo de herencia muestra este pedigrí?",fig:PED_DOM,o:["Autosómica dominante: aparece en todas las generaciones","Autosómica recesiva","Ligada al X recesiva","No se puede saber nada"],e:"Cada afectado tiene un padre o una madre afectado y el carácter no salta generaciones: es dominante.",s:"Análisis de pedigrí"},
{id:"p8",b:"b4",q:"El abuelo I-1 es daltónico. ¿Por qué su nieto III-1 también lo es?",fig:PED_ABUELO,o:["Porque la hija II-1 recibió el X^d del padre y fue portadora","Porque el abuelo le pasó el Y al nieto","Porque el padre II-2 es daltónico","Por casualidad, no es hereditario"],e:"El abuelo le pasó su X^d a la hija (portadora). Ella se lo pasó a su hijo varón: X^dY.",s:"Análisis de pedigrí"},
{id:"p9",b:"b4",q:"Un carácter salta una generación: los padres son sanos y aparece en un hijo. ¿Qué indica?",o:["Que es recesivo","Que es dominante","Que está en el cromosoma Y","Que no es hereditario"],e:"Los recesivos pueden quedar \"escondidos\" en padres heterocigotos y aparecer en los hijos.",s:"Análisis de pedigrí"},
{id:"p10",b:"b4",q:"¿Qué representan los números romanos (I, II, III) a la izquierda del pedigrí?",o:["Las generaciones","La cantidad de hijos","Los afectados","La edad de cada persona"],e:"I = abuelos, II = padres, III = hijos. Cada persona se nombra con generación y número: II-1.",s:"Análisis de pedigrí"}
  ],
  resumen:[
    {tema:"b1", notas:[
      {t:"Palabras clave", html:`<table class="tabla">
        <tr><th>Palabra</th><th>Qué es</th><th>Ejemplo</th></tr>
        <tr><td>Alelo</td><td>Cada forma de un gen</td><td>N y n</td></tr>
        <tr><td>Genotipo</td><td>Los dos alelos que tiene (las letras)</td><td>Nn</td></tr>
        <tr><td>Fenotipo</td><td>Lo que se ve, depende del genotipo</td><td>pelaje negro</td></tr>
        <tr><td>Homocigoto</td><td>Dos alelos iguales</td><td>NN o nn</td></tr>
        <tr><td>Heterocigoto</td><td>Dos alelos distintos</td><td>Nn</td></tr>
        <tr><td>Organismo puro</td><td>Homocigoto para un carácter</td><td>NN o nn</td></tr>
        <tr><td>Dominante</td><td>Se ve con un solo alelo (mayúscula)</td><td>N</td></tr>
        <tr><td>Recesivo</td><td>Se ve solo si están los dos (minúscula)</td><td>nn</td></tr></table>`},
      {t:"Gametos", d:"Cada gameto lleva **un** alelo de cada gen. El hijo recibe uno del padre y uno de la madre."}]},
    {tema:"b2", notas:[
      {t:"1.ª ley: uniformidad", d:"Puro × puro distinto (NN × nn) → F1 100 % Nn, todos con el dominante."},
      {t:"2.ª ley: segregación", d:"F1 × F1 (Nn × Nn) → F2:\nFenotipo 3 : 1 (75 % y 25 %)\nGenotipo 1 : 2 : 1 (25 % NN, 50 % Nn, 25 % nn)"},
      {t:"3.ª ley: transmisión independiente", d:"Dihíbrido NnLl × NnLl → 16 casillas, 4 grupos:\n9 dominante-dominante · 3 dominante-recesivo · 3 recesivo-dominante · 1 recesivo-recesivo"},
      {t:"Ojo con el dihíbrido", ojo:true, d:"Siempre son **4 grupos** y suman 16. Con negro (N) y pelo corto (L):\n9/16 negro corto · 3/16 negro largo · 3/16 blanco corto · 1/16 blanco largo.\nSi te salen 3 grupos, te falta uno."},
      {t:"Cruce de prueba", d:"Se cruza un dominante con un aa. Si salen hijos recesivos, era Aa. Si todos salen dominantes, era AA."},
      {t:"Cómo resolver un cruzamiento", d:"1. Anotá los alelos (mayúscula dominante).\n2. Escribí el genotipo de cada padre.\n3. Sacá los gametos de cada uno.\n4. Armá el cuadro de Punnett.\n5. Contá genotipos y fenotipos.\n6. Pasá a fracción o porcentaje."}]},
    {tema:"b3", notas:[
      {t:"Cromosomas sexuales", d:"Mujer XX · varón XY. Los genes de la hemofilia, el daltonismo y la distrofia de Duchenne están en el X. El Y no los tiene."},
      {t:"Cómo se escribe", d:"X^H normal · X^h afectado\nMujer: X^HX^H normal · X^HX^h portadora (sana) · X^hX^h afectada\nVarón: X^HY normal · X^hY afectado"},
      {t:"Las tres enfermedades", d:"**Daltonismo:** no ve algunos colores, en general rojo y verde (fallan los conos del ojo).\n**Hemofilia:** la sangre no coagula bien.\n**Distrofia de Duchenne:** debilidad muscular que avanza rápido, empieza en piernas y pelvis y después afecta todo el cuerpo."},
      {t:"Ojo: portadora × varón normal", ojo:true, d:"X^HX^h × X^HY → 25 % mujer normal, 25 % mujer portadora, 25 % varón normal, 25 % varón afectado.\n**Ninguna hija sale enferma:** del padre reciben un X^H.",
        html:punnett(["XH","Y"],["XH","Xh"],(y,x)=>({txt:y==="Y"?x+"Y":[x,y].sort().join(""), cl:(x==="Xh"&&y==="Y")?"af":(x==="Xh"?"po":"")}))},
      {t:"Reglas que ayudan", d:"El padre le da su X a **todas las hijas** y su Y a **todos los hijos varones**.\nEl hijo varón recibe su X siempre de la madre."}]},
    {tema:"b4", notas:[
      {t:"Símbolos", html:PED_SIMB+LEYENDA},
      {t:"Cómo reconocer la herencia", d:"**Recesiva:** padres sanos con un hijo o hija afectado (salta generaciones).\n**Dominante:** aparece en todas las generaciones; cada afectado tiene un padre o madre afectado.\n**Ligada al X recesiva:** casi solo varones afectados, que la reciben de madres portadoras."}]}
  ],
  ejercicios:{titulo:"Cruzamientos", sub:"siempre nuevos, con cuadro de Punnett",
    ayuda:"Primero resolvé en el cuaderno con los pasos del resumen. Después mirá la solución paso a paso y marcá cómo te fue.",
    tipos:[
      {id:"mono", nom:"Monohíbrido", sub:"un carácter: 3 : 1 y 1 : 2 : 1", gen:mono},
      {id:"di", nom:"Dihíbrido", sub:"dos caracteres: 9 : 3 : 3 : 1", gen:dihib},
      {id:"sexo", nom:"Ligada al sexo", sub:"hemofilia y daltonismo", gen:sexo}
    ]},
  simulacro:{porTema:2, problemas:["mono","di","sexo"]}
};
})();

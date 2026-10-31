/* Dina Química — Química I (3.º curso). Datos para ../comun/motor.js.
   Sale del cuaderno de Sofía (Prof. Bioq. Luján Barreto): potencial de hidrógeno (pH y pOH),
   soluciones y solubilidad, concentración porcentual (% m/m, % m/v, con densidad) y molaridad.
   La primera opción de cada pregunta es la correcta. */
(function(){
"use strict";

/* =====================  NÚMEROS  ===================== */
const SUPC = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻"};
const sup = n => String(n).split("").map(c=>SUPC[c]).join("");
const coma = x => String(x).replace(".",",");
const r = (x,d=2) => coma(String(+x.toFixed(d)));              // 2,85 · 15 · 0,62
const sci = (a,b) => `${coma(a)} × 10${sup(-b)}`;              // 1,4 × 10⁻³
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const azar = a => a[Math.floor(Math.random()*a.length)];
const caracter = ph => ph < 6.995 ? "ácida" : ph > 7.005 ? "básica" : "neutra";
const PH = "pH = −log [H⁺]", POH = "pOH = −log [OH⁻]";

/* Sustancias con su masa molar (con la tabla periódica: H 1, C 12, N 14, O 16, Na 23, S 32, Cl 35,5, K 39, Ca 40, Br 80, Ba 137,3) */
const SUST = [
  {nom:"cloruro de sodio", f:"NaCl", pm:58.5, cuenta:"Na 23 + Cl 35,5"},
  {nom:"hidróxido de potasio", f:"KOH", pm:56, cuenta:"K 39 + O 16 + H 1"},
  {nom:"hidróxido de sodio", f:"NaOH", pm:40, cuenta:"Na 23 + O 16 + H 1"},
  {nom:"cloruro de potasio", f:"KCl", pm:74.5, cuenta:"K 39 + Cl 35,5"},
  {nom:"ácido sulfúrico", f:"H₂SO₄", pm:98, cuenta:"H 2 × 1 + S 32 + O 4 × 16"},
  {nom:"bromuro de calcio", f:"CaBr₂", pm:200, cuenta:"Ca 40 + Br 2 × 80"},
  {nom:"cloruro de bario", f:"BaCl₂", pm:208.3, cuenta:"Ba 137,3 + Cl 2 × 35,5"},
  {nom:"glucosa", f:"C₆H₁₂O₆", pm:180, cuenta:"C 6 × 12 + H 12 × 1 + O 6 × 16"},
  {nom:"ácido nítrico", f:"HNO₃", pm:63, cuenta:"H 1 + N 14 + O 3 × 16"}
];
const SALES = ["cloruro de sodio","permanganato de potasio","bromuro de potasio","nitrato férrico","cloruro férrico","hidróxido de potasio","glucosa","carbonato ácido de sodio","cloruro de bario"];

/* =====================  EJERCICIOS CON NÚMEROS NUEVOS  ===================== */
function ph(){
  const conOH = Math.random()<.4, a = rnd(10,99)/10, b = rnd(2,12);
  const c = a*10**-b;
  if(!conOH){
    const v = -Math.log10(c);
    return {t:"pH a partir de [H⁺]",
      q:`En una solución acuosa, la concentración de iones [H⁺] es ${sci(a,b)} M. Calculá el pH y decí si la solución es ácida, básica o neutra.`,
      p:[["Fórmula", PH],
         ["Reemplazá", `pH = −log (${sci(a,b)})`],
         ["En la calculadora", `−log ( ${coma(a)} × 10^(−${b}) ) = ${r(v)}`],
         ["¿Ácida, básica o neutra?", `pH ${v<7?"<":">"} 7 → ${caracter(v)}`]],
      r:`pH ≈ ${r(v)} → solución ${caracter(v)}`};
  }
  const poh = -Math.log10(c), v = 14 - poh;
  return {t:"pH a partir de [OH⁻]",
    q:`Una solución tiene una concentración de iones [OH⁻] de ${sci(a,b)} M. Calculá el pOH, el pH y decí si es ácida, básica o neutra.`,
    p:[["Fórmula", POH],
       ["Reemplazá", `pOH = −log (${sci(a,b)}) = ${r(poh)}`],
       ["Usá pH + pOH = 14", `pH = 14 − ${r(poh)} = ${r(v)}`],
       ["¿Ácida, básica o neutra?", `pH ${v<7?"<":">"} 7 → ${caracter(v)}`]],
    r:`pOH ≈ ${r(poh)} · pH ≈ ${r(v)} → solución ${caracter(v)}`};
}
function hdesdeph(){
  const v = rnd(150,1250)/100, n = Math.ceil(v), a = 10**(n-v);
  const conPOH = Math.random()<.35;
  if(conPOH){
    const poh = rnd(150,1250)/100, pv = 14-poh;
    return {t:"pH a partir del pOH",
      q:`¿Cuál es el pH de una solución que tiene un pOH = ${r(poh)}? ¿Es ácida, básica o neutra?`,
      p:[["Fórmula", "pH + pOH = 14"],["Despejá", `pH = 14 − ${r(poh)}`]],
      r:`pH = ${r(pv)} → solución ${caracter(pv)}`};
  }
  return {t:"[H⁺] a partir del pH",
    q:`${v<7?"El pH del agua de lluvia de una región":"El pH de una solución"} es ${r(v)}. Calculá la concentración de iones H⁺.`,
    p:[["Fórmula", "[H⁺] = 10^(−pH)"],
       ["Reemplazá", `[H⁺] = 10^(−${r(v)})`],
       ["En la calculadora", `Tecla 10ˣ (SHIFT + log) y escribí −${r(v)}`]],
    r:`[H⁺] ≈ ${sci(r(a,2),n)} M`};
}
function mm(){
  const sal = azar(SALES), caso = rnd(0,2);
  if(caso===0){ // soluto en solvente → %
    const s = rnd(2,45), w = rnd(4,30)*10 + (Math.random()<.5?0:5), sol = s+w, pc = s/sol*100;
    return {t:"% m/m",
      q:`Se disuelven ${s} g de ${sal} en ${w} g de agua. Calculá la concentración porcentual (% m/m) de la solución.`,
      p:[["Datos", `Soluto = ${s} g\nSolvente (agua) = ${w} g\nSolución = soluto + solvente = ${sol} g`],
         ["Fórmula", "% m/m = [[masa de soluto::masa de solución]] × 100"],
         ["Reemplazá", `% m/m = [[${s} g::${sol} g]] × 100`]],
      r:`% m/m ≈ ${r(pc)} %`};
  }
  if(caso===1){ // solución y % → masa de soluto
    const sol = rnd(2,30)*10, pc = azar([2,4,5,8,10,12,15,20,25]), s = pc*sol/100;
    return {t:"Masa de soluto (% m/m)",
      q:`¿Cuántos gramos de ${sal} se necesitan para preparar ${sol} g de solución al ${pc} %?`,
      p:[["Datos", `Solución = ${sol} g\n% m/m = ${pc} %\nSoluto = ?`],
         ["Fórmula", "% m/m = [[masa de soluto::masa de solución]] × 100"],
         ["Despejá", `masa de soluto = [[% × masa de solución::100]] = [[${pc} × ${sol}::100]]`]],
      r:`Se necesitan ${r(s)} g de ${sal}.`};
  }
  const pc = azar([2,4,5,8,10,15,20]), s = rnd(2,40)*pc/10, sol = s*100/pc; // soluto y % → masa de solución
  return {t:"Masa de solución (% m/m)",
    q:`¿Cuántos gramos de solución al ${pc} % de ${sal} contienen ${r(s)} g de esa sal?`,
    p:[["Datos", `Soluto = ${r(s)} g\n% m/m = ${pc} %\nSolución = ?`],
       ["Fórmula", "% m/m = [[masa de soluto::masa de solución]] × 100"],
       ["Despejá", `masa de solución = [[masa de soluto × 100::%]] = [[${r(s)} × 100::${pc}]]`]],
    r:`Masa de solución = ${r(sol)} g`};
}
function mv(){
  const sal = azar(SALES);
  if(Math.random()<.5){
    const v = azar([50,100,150,200,250,300,500]), pc = azar([2,3,5,8,10,12,15]), s = pc*v/100;
    return {t:"Masa de soluto (% m/v)",
      q:`Calculá cuántos gramos de ${sal} se necesitan para preparar ${v} ml de una solución al ${pc} % m/v.`,
      p:[["Datos", `Volumen de solución = ${v} ml\n% m/v = ${pc} %\nSoluto = ?`],
         ["Fórmula", "% m/v = [[gramos de soluto::ml de solución]] × 100"],
         ["Despejá", `gramos de soluto = [[${pc} × ${v}::100]]`],
         ["Ojo", `El volumen va en ml, tal cual: ${v} ml (no lo pases a otra unidad).`]],
      r:`Se necesitan ${r(s)} g de ${sal}.`};
  }
  const v = azar([100,200,250,400,500,800,1000]), s = rnd(2,60)/2, pc = s/v*100;
  return {t:"% m/v",
    q:`Se disuelven ${r(s)} g de ${sal} en agua hasta completar ${v} ml de solución. ¿Cuál es la concentración en % m/v?`,
    p:[["Datos", `Soluto = ${r(s)} g\nVolumen de solución = ${v} ml`],
       ["Fórmula", "% m/v = [[gramos de soluto::ml de solución]] × 100"],
       ["Reemplazá", `% m/v = [[${r(s)} g::${v} ml]] × 100`]],
    r:`% m/v ≈ ${r(pc)} %`};
}
function densidad(){
  const acido = azar([{n:"ácido nítrico",d:[1.2,1.4],pc:[60,65,68]},{n:"ácido sulfúrico",d:[1.84],pc:[96,98]},{n:"ácido fosfórico",d:[1.68],pc:[85]},{n:"ácido clorhídrico",d:[1.18,1.19],pc:[36,37]}]);
  const d = azar(acido.d), pc = azar(acido.pc);
  if(Math.random()<.55){
    const V = rnd(5,40)*10 + rnd(0,9), m = d*V, s = m*pc/100;
    return {t:"Densidad y % m/m",
      q:`Calculá cuántos gramos de ${acido.n} hay en ${V} ml de solución de ${acido.n} de densidad ${coma(d)} g/ml y concentración ${pc} % m/m.`,
      p:[["Datos", `V = ${V} ml\nd = ${coma(d)} g/ml\n% m/m = ${pc} %`],
         ["Masa de la solución con la densidad", `d = [[m::V]] → m = d · V = ${coma(d)} × ${V} = ${r(m)} g`],
         ["Masa de soluto con el %", `masa de soluto = [[${pc} × ${r(m)}::100]]`]],
      r:`Hay ${r(s)} g de ${acido.n}.`};
  }
  const s = rnd(10,120), m = s*100/pc, V = m/d;
  return {t:"Densidad y % m/m",
    q:`Calculá el volumen de solución de ${acido.n} de densidad ${coma(d)} g/ml y ${pc} % m/m que contiene ${s} g de ${acido.n}.`,
    p:[["Datos", `Soluto = ${s} g\nd = ${coma(d)} g/ml\n% m/m = ${pc} %\nV = ?`],
       ["Masa de solución con el %", `masa de solución = [[${s} × 100::${pc}]] = ${r(m)} g`],
       ["Volumen con la densidad", `V = [[m::d]] = [[${r(m)}::${coma(d)}]]`]],
    r:`V ≈ ${r(V,1)} ml`};
}
function molaridad(){
  const x = azar(SUST), V = azar([100,200,250,300,500,750,1000,1500,2000]), L = V/1000;
  if(Math.random()<.65){
    const m = Math.max(1, Math.round(x.pm*azar([0.1,0.2,0.25,0.5,1,1.5,2])*L*10)/10), n = m/x.pm, M = n/L;
    return {t:"Molaridad",
      q:`Calculá la molaridad de una solución que contiene ${r(m,1)} g de ${x.nom} (${x.f}) en ${V} ml de solución.`,
      p:[["Masa molar (tabla periódica)", `PM ${x.f} = ${x.cuenta} = ${r(x.pm,1)} g/mol`],
         ["Moles de soluto", `n = [[m::PM]] = [[${r(m,1)} g::${r(x.pm,1)} g/mol]] = ${r(n,3)} mol`],
         ["Volumen en litros", `${V} ml ÷ 1000 = ${r(L,3)} L`],
         ["Molaridad", `M = [[n::V (L)]] = [[${r(n,3)} mol::${r(L,3)} L]]`]],
      r:`M ≈ ${r(M,2)} mol/L (${r(M,2)} M)`};
  }
  const M = azar([0.1,0.2,0.25,0.5,1,2]), n = M*L, m = n*x.pm;
  return {t:"Masa a partir de la molaridad",
    q:`¿Cuántos gramos de ${x.nom} (${x.f}) se necesitan para preparar ${V} ml de una solución ${r(M)} M?`,
    p:[["Volumen en litros", `${V} ml ÷ 1000 = ${r(L,3)} L`],
       ["Moles", `n = M · V = ${r(M)} × ${r(L,3)} = ${r(n,3)} mol`],
       ["Masa molar", `PM ${x.f} = ${x.cuenta} = ${r(x.pm,1)} g/mol`],
       ["Gramos", `m = n · PM = ${r(n,3)} × ${r(x.pm,1)}`]],
    r:`Se necesitan ${r(m,2)} g de ${x.f}.`};
}

/* =====================  MATERIA  ===================== */
window.MATERIA = {
  nombre:"Química I", corto:"Química I", titulo:"Dina Química", clave:"dinaQuimica.v1",
  pie:"Preguntas del cuaderno de Química I (Prof. Bioq. Luján Barreto)",
  muestraCorta:"pH = −log [H⁺]", muestra:"% m/m = [[masa de soluto::masa de solución]] × 100\n[OH⁻] = 1,4 × 10⁻³ M",
  calculadora:true,
  temas:{
    q1:{nom:"pH y pOH", sub:"escala, −log, pH + pOH = 14", c:"var(--b1)", s:"var(--b1s)"},
    q2:{nom:"Soluciones", sub:"soluto, solvente, solubilidad", c:"var(--b2)", s:"var(--b2s)"},
    q3:{nom:"Concentración %", sub:"% m/m, % m/v y densidad", c:"var(--b3)", s:"var(--b3s)"},
    q4:{nom:"Molaridad", sub:"moles, masa molar, M = n / V", c:"var(--b4)", s:"var(--b4s)"}
  },
  banco:[
/* ---------- pH y pOH ---------- */
{id:"h1",b:"q1",q:"¿Para qué sirve la escala de pH?",o:["Para indicar si una solución es ácida, básica o neutra","Para medir la temperatura de una solución","Para medir la masa del soluto","Para saber cuántos litros tiene una solución"],e:"El pH (potencial de hidrógeno) mide la acidez o basicidad.",s:"Cuaderno: Potencial de hidrógeno"},
{id:"h2",b:"q1",q:"En la escala de pH (de 0 a 14), ¿cómo es una solución con pH 3?",o:["Ácida","Básica","Neutra","No se puede saber"],e:"pH < 7 ácida · pH = 7 neutra · pH > 7 básica.",s:"Cuaderno: Escala de pH"},
{id:"h3",b:"q1",q:"¿Cómo es una solución con pH 11?",o:["Básica","Ácida","Neutra","Salina"],e:"Más de 7 es básica, como el hidróxido de sodio (NaOH).",s:"Cuaderno: Escala de pH"},
{id:"h4",b:"q1",q:"¿Cuál es el pH del agua pura?",o:["7, neutra","0, muy ácida","14, muy básica","1"],e:"En el agua pura [H⁺] = [OH⁻] = 1 × 10⁻⁷ M, entonces pH = 7.",s:"Cuaderno: Producto iónico del agua"},
{id:"h5",b:"q1",q:"¿Cuál es la fórmula del pH?",o:["pH = −log [H⁺]","pH = log [OH⁻]","pH = [H⁺] × 100","pH = 14 + pOH"],e:"El pOH es −log [OH⁻].",s:"Cuaderno: Potencial de hidrógeno"},
{id:"h6",b:"q1",q:"¿Qué relación hay entre el pH y el pOH?",o:["pH + pOH = 14","pH − pOH = 7","pH · pOH = 14","pH = pOH siempre"],e:"Si sabés uno, el otro es 14 menos ese valor.",s:"Cuaderno: Potencial de hidrógeno"},
{id:"h7",b:"q1",q:"¿Qué es el producto iónico del agua?",o:["[H⁺] · [OH⁻] = 1 × 10⁻¹⁴","[H⁺] + [OH⁻] = 14","[H⁺] = 1 × 10⁻¹⁴","El agua no tiene iones"],e:"El agua se disocia muy poquito: H₂O → H⁺ + OH⁻.",s:"Cuaderno: Producto iónico del agua"},
{id:"h8",b:"q1",q:"Si [H⁺] = 1 × 10⁻³ M, ¿cuál es el pH?",o:["3","−3","11","0,001"],e:"−log (10⁻³) = 3. Con 1 × 10⁻ⁿ, el pH es n.",s:"Cuaderno: Ejercicios de pH"},
{id:"h9",b:"q1",q:"Si [OH⁻] = 1 × 10⁻² M, ¿cuál es el pH?",o:["12","2","−2","7"],e:"pOH = 2 → pH = 14 − 2 = 12. Ojo: primero da el pOH.",s:"Cuaderno: Ejercicios de pH"},
{id:"h10",b:"q1",q:"Una solución tiene pOH = 8,85. ¿Cuál es su pH?",o:["5,15 (ácida)","8,85 (básica)","22,85","7"],e:"pH = 14 − 8,85 = 5,15. Como es menor que 7, es ácida.",s:"Cuaderno: Actividad 2.b"},
{id:"h11",b:"q1",q:"El pH del agua de lluvia es 4,82. ¿Cómo se calcula [H⁺]?",o:["[H⁺] = 10^(−4,82) ≈ 1,51 × 10⁻⁵ M","[H⁺] = 14 − 4,82","[H⁺] = log 4,82","[H⁺] = 4,82 × 100"],e:"Es la operación inversa: [H⁺] = 10^(−pH) (tecla 10ˣ de la calculadora).",s:"Cuaderno: Ejercicio 4"},
{id:"h12",b:"q1",q:"¿Qué son los indicadores de pH?",o:["Sustancias que cambian de color e indican si una solución es ácida, neutra o básica","Los números de la escala","Los iones H⁺","Las bases fuertes"],e:"Por ejemplo, el papel tornasol.",s:"Cuaderno: Actividad 3.c"},
{id:"h13",b:"q1",q:"¿Cómo se mide la fuerza de los ácidos?",o:["Según si se disocian completa o parcialmente","Según su color","Según su temperatura","Según la cantidad de agua"],e:"Ácido fuerte: se disocia completamente. Ácido débil: se disocia en parte.",s:"Cuaderno: Actividad 3.b"},
{id:"h14",b:"q1",q:"Si [H⁺] = 5,3 × 10⁻⁹ M, ¿la solución es…?",o:["Básica (pH ≈ 8,28)","Ácida (pH ≈ 5,3)","Neutra","Ácida (pH ≈ 9)"],e:"−log (5,3 × 10⁻⁹) ≈ 8,28 > 7 → básica.",s:"Cuaderno: Actividad 1.c"},
/* ---------- Soluciones ---------- */
{id:"s1",b:"q2",q:"¿Qué es una solución?",o:["Una mezcla homogénea de dos o más sustancias","Una mezcla en la que se ven distintas fases","Una sustancia pura","Solo agua con sal"],e:"Su característica principal: forman una mezcla homogénea.",s:"Cuaderno: Soluciones"},
{id:"s2",b:"q2",q:"Agua con aceite, ¿qué tipo de mezcla es?",o:["Heterogénea: se ven distintas fases","Homogénea","Una solución","Una solución iónica"],e:"En una mezcla homogénea no se distinguen fases, como el agua con sal (NaCl).",s:"Cuaderno: Soluciones"},
{id:"s3",b:"q2",q:"En el azúcar disuelta en agua, ¿cuál es el soluto?",o:["El azúcar, que está en menor cantidad","El agua, que está en mayor cantidad","Los dos","Ninguno"],e:"Soluto: menor cantidad. Solvente: mayor cantidad (acá, el agua).",s:"Cuaderno: Soluto y solvente"},
{id:"s4",b:"q2",q:"¿Por qué al agua se la llama solvente universal?",o:["Por su polaridad: tiene un polo + y uno −, y atrae a muchos solutos","Porque no tiene polos","Porque disuelve los aceites","Porque es la más pesada"],e:"Los solutos con carga se juntan con el agua \"como si fueran imanes\".",s:"Cuaderno: El agua"},
{id:"s5",b:"q2",q:"En una solución, ¿cuántos solventes puede haber?",o:["Uno solo, aunque haya varios solutos","Siempre dos","Tantos como solutos","Ninguno"],e:"Y el solvente no siempre es el agua.",s:"Cuaderno: Soluto y solvente"},
{id:"s6",b:"q2",q:"El bronce es una solución de…",o:["Sólido en sólido (cobre y estaño)","Gas en gas","Gas en líquido","Sólido en líquido"],e:"Aire: gas-gas · agua carbonatada: gas-líquido · azúcar en agua: sólido-líquido · bronce: sólido-sólido.",s:"Cuaderno: Ejemplos de soluciones"},
{id:"s7",b:"q2",q:"¿Qué son las soluciones iónicas?",o:["Aquellas en que el soluto se disocia en iones; conducen la corriente eléctrica","Aquellas que no conducen la corriente","Las que solo tienen gases","Las que no tienen solvente"],e:"Las soluciones moleculares, en cambio, no conducen la corriente.",s:"Cuaderno: Soluciones iónicas y moleculares"},
{id:"s8",b:"q2",q:"¿Qué sustancias son solubles en agua?",o:["Las polares: azúcar, sales, alcohol","Las no polares: aceites y grasas","Los hidrocarburos","Ninguna"],e:"Las no polares (aceites, grasas, hidrocarburos) son insolubles en agua.",s:"Cuaderno: Solubilidad en agua"},
{id:"s9",b:"q2",q:"¿Qué es una solución saturada?",o:["La que tiene la máxima cantidad de soluto que se puede disolver","La que tiene muy poco soluto","La que supera el máximo de soluto","La que no tiene soluto"],e:"Insaturada: poco soluto · saturada: el máximo · sobresaturada: más que el máximo.",s:"Cuaderno: Clasificación de soluciones"},
{id:"s10",b:"q2",q:"La solubilidad de una sustancia es 1,33 g por 100 g de agua (20 °C). Una solución tiene 2,23 g por 100 g de agua. ¿Cómo es?",o:["Sobresaturada","Insaturada","Saturada","Diluida"],e:"Tiene más soluto (2,23 g) que el máximo (1,33 g).",s:"Cuaderno: Ejercicio 5"},
{id:"s11",b:"q2",q:"La solubilidad del NaCl es 35 g por 100 g de agua. Si disolvés 10 g en 100 g de agua, la solución es…",o:["Insaturada","Saturada","Sobresaturada","Heterogénea"],e:"10 g es menos que el máximo (35 g): todavía se puede disolver más.",s:"Cuaderno: Solubilidad"},
{id:"s12",b:"q2",q:"¿Qué factores afectan la solubilidad?",o:["La naturaleza del soluto y del solvente, la temperatura y la presión (en los gases)","Solo el color","La forma del recipiente","La hora del día"],e:"La presión importa sobre todo en los gases.",s:"Cuaderno: Factores que afectan la solubilidad"},
{id:"s13",b:"q2",q:"Dos líquidos que se mezclan en todas las proporciones son…",o:["Miscibles","Inmiscibles","Insaturados","Sobresaturados"],e:"Los que no se mezclan se llaman inmiscibles.",s:"Cuaderno: Factores que afectan la solubilidad"},
{id:"s14",b:"q2",q:"¿Qué indica la concentración de una solución?",o:["Qué cantidad de soluto hay en una cantidad dada de solución","El color de la solución","La temperatura","Cuántos solventes tiene"],e:"Empíricas: porcentuales. Valoradas: molares, normales, molales.",s:"Cuaderno: Concentración de las soluciones"},
/* ---------- Concentración porcentual ---------- */
{id:"p1",b:"q3",q:"¿Cuál es la fórmula del % m/m?",o:["% m/m = [[masa de soluto::masa de solución]] × 100","% m/m = [[masa de soluto::masa de solvente]] × 100","% m/m = masa de soluto × masa de solución","% m/m = [[masa de solución::masa de soluto]]"],e:"Abajo va la masa de la solución, no la del solvente.",s:"Cuaderno: Concentración porcentual"},
{id:"p2",b:"q3",q:"¿Cómo se calcula la masa de la solución?",o:["Masa de soluto + masa de solvente","Masa de solvente − masa de soluto","Masa de soluto × 100","Es igual a la masa del agua"],e:"Ejemplo: 12 g de NaCl + 68 g de agua = 80 g de solución.",s:"Cuaderno: Ejercicio 1"},
{id:"p3",b:"q3",q:"Se disuelven 12 g de NaCl en 68 g de agua. ¿Cuál es el % m/m?",o:["15 %","17,6 %","12 %","80 %"],e:"[[12::80]] × 100 = 15 %. Si dividís por 68 (el agua) te da mal.",s:"Cuaderno: Ejercicio 1"},
{id:"p4",b:"q3",q:"Se disuelven 25 g de KOH en 475 g de agua. ¿Cuál es el % m/m?",o:["5 %","5,26 %","25 %","19 %"],e:"Solución = 25 + 475 = 500 g. [[25::500]] × 100 = 5 %.",s:"Cuaderno: Ejercicio 3"},
{id:"p5",b:"q3",q:"¿Cuántos gramos de NaCl se necesitan para 60 g de solución al 15 %?",o:["9 g","15 g","4 g","400 g"],e:"masa de soluto = [[15 × 60::100]] = 9 g.",s:"Cuaderno: Ejercicio 2"},
{id:"p6",b:"q3",q:"¿Cuántos gramos de solución al 5 % contienen 3,2 g de NaCl?",o:["64 g","16 g","0,16 g","32 g"],e:"masa de solución = [[3,2 × 100::5]] = 64 g.",s:"Cuaderno: Ejercicio 4"},
{id:"p7",b:"q3",q:"¿Cuál es la fórmula del % m/v?",o:["% m/v = [[gramos de soluto::ml de solución]] × 100","% m/v = [[ml de solución::gramos de soluto]] × 100","% m/v = gramos × ml","% m/v = [[gramos de soluto::gramos de solución]] × 100"],e:"Arriba gramos, abajo mililitros.",s:"Cuaderno: Concentración porcentual en volumen"},
{id:"p8",b:"q3",q:"¿Cuántos gramos de BaCl₂ se necesitan para 50 ml de solución al 12 % m/v?",o:["6 g","600 g","0,24 g","4,17 g"],e:"[[12 × 50::100]] = 6 g. El volumen va en ml, tal cual (50, no 50 000).",s:"Cuaderno: Volumen, ejercicio 1"},
{id:"p9",b:"q3",q:"¿Qué fórmula relaciona masa, densidad y volumen?",o:["d = [[m::V]]","d = m · V","d = [[V::m]]","d = m + V"],e:"Entonces m = d · V y V = [[m::d]].",s:"Cuaderno: Ejercicios 11 a 13"},
{id:"p10",b:"q3",q:"309 ml de solución de densidad 1,2 g/ml, ¿cuántos gramos pesan?",o:["370,8 g","257,5 g","310,2 g","1,2 g"],e:"m = d · V = 1,2 × 309 = 370,8 g. Después, con el % se saca el soluto.",s:"Cuaderno: Ejercicio 11"},
{id:"p11",b:"q3",q:"Una solución de 450 g contiene 9 g de soluto. ¿Cuál es su concentración?",o:["2 %","9 %","50 %","0,02 %"],e:"[[9::450]] × 100 = 2 %.",s:"Cuaderno: Ejercicio 8"},
{id:"p12",b:"q3",q:"Si una solución es al 40 % m/m, ¿qué significa?",o:["Que hay 40 g de soluto por cada 100 g de solución","Que hay 40 g de agua","Que hay 40 ml de solución","Que el soluto pesa 40 kg"],e:"El porcentaje siempre es \"por cada 100\" de solución.",s:"Cuaderno: Concentración porcentual"},
/* ---------- Molaridad ---------- */
{id:"m1",b:"q4",q:"¿Qué representa la molaridad?",o:["Los moles de soluto en un litro de solución","Los gramos de soluto en 100 g de solución","Los litros de solvente","El pH de la solución"],e:"M = [[n::V (L)]]. Su unidad es mol/L (M).",s:"Cuaderno: Soluciones molares"},
{id:"m2",b:"q4",q:"¿Cómo se calculan los moles de soluto?",o:["n = [[masa::PM]] (masa molar)","n = masa × PM","n = [[PM::masa]]","n = masa + PM"],e:"PM es la masa molar, que se calcula con la tabla periódica.",s:"Cuaderno: Soluciones molares"},
{id:"m3",b:"q4",q:"¿Cuántos litros son 250 ml?",o:["0,25 L","2,5 L","25 L","250 L"],e:"Dividí por 1000: 250 ÷ 1000 = 0,25 L.",s:"Cuaderno: Soluciones molares"},
{id:"m4",b:"q4",q:"¿Cuál es la masa molar del KOH? (K 39, O 16, H 1)",o:["56 g/mol","39 g/mol","55 g/mol","40 g/mol"],e:"39 + 16 + 1 = 56 g/mol.",s:"Cuaderno: Molaridad, ejercicio 3"},
{id:"m5",b:"q4",q:"7 g de KOH (56 g/mol) en 250 ml de solución. ¿Cuál es la molaridad?",o:["0,5 M","0,125 M","28 M","1,75 M"],e:"n = 7 ÷ 56 = 0,125 mol. M = 0,125 ÷ 0,25 L = 0,5 M.",s:"Cuaderno: Molaridad, ejercicio 3"},
{id:"m6",b:"q4",q:"26 g de BaCl₂ (208,3 g/mol) en 500 ml. ¿Cuál es la molaridad?",o:["≈ 0,25 M","≈ 0,125 M","≈ 52 M","≈ 0,5 M"],e:"n ≈ 0,125 mol. M = 0,125 ÷ 0,5 L ≈ 0,25 M.",s:"Cuaderno: Molaridad, ejercicio 2"},
{id:"m7",b:"q4",q:"¿Cuál es la masa molar del NaOH? (Na 23, O 16, H 1)",o:["40 g/mol","39 g/mol","24 g/mol","56 g/mol"],e:"23 + 16 + 1 = 40 g/mol.",s:"Tabla periódica"},
{id:"m8",b:"q4",q:"Una solución 2 M tiene…",o:["2 moles de soluto por cada litro de solución","2 gramos por litro","2 litros de solvente","pH 2"],e:"M = mol/L.",s:"Cuaderno: Soluciones molares"},
{id:"m9",b:"q4",q:"En CaBr₂, ¿cuántos átomos de bromo hay para calcular la masa molar?",o:["2: se multiplica la masa del Br por 2","1","3","Ninguno"],e:"El subíndice 2 indica dos átomos: Ca 40 + 2 × Br.",s:"Cuaderno: Molaridad, ejercicio 1"},
{id:"m10",b:"q4",q:"¿Qué necesitás tener a mano para calcular una masa molar?",o:["La tabla periódica","Un termómetro","El pH","La densidad"],e:"Con las masas atómicas de la tabla sumás cada elemento.",s:"Cuaderno: \"rendir con tabla periódica\""},
{id:"m11",b:"q4",q:"Si duplicás el volumen de solución con los mismos moles, la molaridad…",o:["Se reduce a la mitad","Se duplica","No cambia","Se hace cero"],e:"M = [[n::V]]: si V es el doble, M es la mitad.",s:"Cuaderno: Soluciones molares"},
{id:"m12",b:"q4",q:"Las concentraciones molares, normales y molales son…",o:["Concentraciones valoradas (estándar)","Concentraciones porcentuales","Indicadores de pH","Tipos de mezclas heterogéneas"],e:"Las porcentuales son las empíricas.",s:"Cuaderno: Concentración de las soluciones"}
  ],
  resumen:[
    {tema:"q1", notas:[
      {t:"Escala de pH", d:"0 a 7 → **ácida** (HCl) · 7 → **neutra** (H₂O) · 7 a 14 → **básica** (NaOH)"},
      {t:"Fórmulas", d:"pH = −log [H⁺]\npOH = −log [OH⁻]\npH + pOH = 14\n[H⁺] = 10^(−pH)\n[H⁺] · [OH⁻] = 1 × 10⁻¹⁴ (agua pura: 1 × 10⁻⁷ M cada uno)"},
      {t:"Ojo con [OH⁻]", ojo:true, d:"Si te dan [OH⁻], el −log da el **pOH**, no el pH. Después hacé pH = 14 − pOH."},
      {t:"En la calculadora", d:"pH: (−) log ( 1,4 × 10^(−3) ) = 2,85\n[H⁺] desde el pH: SHIFT log (10ˣ) y escribí −pH."},
      {t:"Ácidos e indicadores", d:"Ácido fuerte: se disocia completamente. Débil: en parte.\nIndicadores de pH: cambian de color según la solución sea ácida, neutra o básica."}]},
    {tema:"q2", notas:[
      {t:"Solución", d:"Mezcla homogénea (no se ven fases). **Soluto:** menor cantidad. **Solvente:** mayor cantidad. Puede haber varios solutos, pero un solo solvente."},
      {t:"Ejemplos", d:"Aire: gas-gas · agua carbonatada: gas-líquido · azúcar en agua: sólido-líquido · bronce (cobre + estaño): sólido-sólido."},
      {t:"El agua", d:"Solvente universal por su **polaridad** (polo + y polo −). Disuelve lo polar (azúcar, sales, alcohol); no disuelve lo no polar (aceites, grasas, hidrocarburos)."},
      {t:"Iónicas y moleculares", d:"**Iónicas:** el soluto se disocia en iones → conducen la corriente.\n**Moleculares:** el soluto queda en moléculas → no conducen."},
      {t:"Según la cantidad de soluto", d:"**Insaturada:** poco soluto · **saturada:** el máximo que se disuelve · **sobresaturada:** más que el máximo.\nEj.: NaCl se disuelve hasta 35 g por 100 g de agua."},
      {t:"Factores de la solubilidad", d:"Naturaleza del soluto y del solvente, temperatura y presión (gases). Líquidos que se mezclan: miscibles; que no: inmiscibles."}]},
    {tema:"q3", notas:[
      {t:"Fórmulas", d:"% m/m = [[masa de soluto::masa de solución]] × 100\n% m/v = [[gramos de soluto::ml de solución]] × 100\nmasa de solución = soluto + solvente\nd = [[m::V]] → m = d · V"},
      {t:"Despejes", d:"masa de soluto = [[% × masa de solución::100]]\nmasa de solución = [[masa de soluto × 100::%]]"},
      {t:"Ojo", ojo:true, d:"Abajo va la **solución**, no el solvente: 12 g en 68 g de agua → [[12::80]] × 100 = 15 %.\nEn % m/v el volumen va en ml tal cual: 50 ml al 12 % → [[12 × 50::100]] = 6 g."}]},
    {tema:"q4", notas:[
      {t:"Fórmulas", d:"M = [[n::V (L)]]   n = [[m::PM]]\nml → L: dividí por 1000 (250 ml = 0,25 L)"},
      {t:"Masa molar (PM)", d:"Sumá las masas atómicas de la tabla periódica, multiplicando por el subíndice.\nKOH = 39 + 16 + 1 = 56 g/mol\nBaCl₂ = 137,3 + 2 × 35,5 = 208,3 g/mol\nCaBr₂ = 40 + 2 × 80 = 200 g/mol"},
      {t:"Pasos", d:"1. Masa molar.\n2. Moles: n = m ÷ PM.\n3. Volumen en litros.\n4. M = n ÷ V."},
      {t:"Para el examen", ojo:true, d:"El cuaderno dice que se rinde **con tabla periódica**. Llevá calculadora."}]}
  ],
  ejercicios:{titulo:"Ejercicios", sub:"con números nuevos, paso a paso",
    ayuda:"Primero resolvé en el cuaderno con la calculadora. Después mirá la solución paso a paso y marcá cómo te fue.",
    papel:"Primero resolvé en el cuaderno: datos, fórmula, reemplazo y resultado con unidad.",
    aMedias:"el planteo estaba bien pero hubo un error de cuenta, de unidad o de despeje.",
    tipos:[
      {id:"ph", nom:"pH y pOH", sub:"desde [H⁺] o [OH⁻]", gen:ph},
      {id:"hph", nom:"[H⁺] o pH desde otro dato", sub:"10^(−pH) y pH + pOH = 14", gen:hdesdeph},
      {id:"mm", nom:"% m/m", sub:"porcentaje, masa de soluto o de solución", gen:mm},
      {id:"mv", nom:"% m/v", sub:"gramos en ml de solución", gen:mv},
      {id:"dens", nom:"Densidad y %", sub:"m = d · V", gen:densidad},
      {id:"mol", nom:"Molaridad", sub:"M = n / V", gen:molaridad}
    ]},
  simulacro:{porTema:2, problemas:[["ph","hph"],["mm","mv","dens"],["mol"]]}
};
})();

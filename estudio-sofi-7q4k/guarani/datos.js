/* Dina Guaraní — Guaraní Ñe'ẽ (3.º curso, 2.ª etapa). Datos para ../comun/motor.js.
   Sale del cuaderno de Sofi (escaneo del 3/11/2026): káso ñemombe'u, hecho y opinión,
   realidad y fantasía, modos, afiche, currículum, entrevista y carta.
   El caso "Mboriahu ryguatã káso" es de David Galeano Olivera (dgaleanolivera.wordpress.com):
   acá solo van frases cortas para practicar; el relato se cuenta en castellano en el resumen.
   Sofi entiende poco guaraní: todo va con su traducción. "es" = ayuda en castellano (botón "Ver en castellano").
   La primera opción de cada pregunta es la correcta. */
(function(){
"use strict";
const al = a => a[Math.floor(Math.random()*a.length)];

/* =====================  TARJETAS DE PALABRAS  =====================
   [guaraní, castellano, pista o ejemplo] */
const PALABRAS = [
  // consignas del examen
  ["Amoñe'ẽ","Leo","«Amoñe'ẽ ko káso» = Leo este caso"],
  ["Ahendu","Escucho","«Ahendu ko káso» = Escucho este caso"],
  ["Ambohovái","Contesto","«Ambohovái ko'ã porandu» = Contesto estas preguntas"],
  ["Amyesakã","Aclaro, explico","«Amyesakã ñe'ẽ he'iséva» = Aclaro el significado de las palabras"],
  ["Aheka","Busco","«Aheka mba'épa he'ise» = Busco qué significa"],
  ["Ahai","Escribo","«Ahai che remimo'ã» = Escribo mi opinión"],
  ["Amombe'u","Cuento, narro","«Amombe'u ambue káso» = Cuento otro caso"],
  ["Amba'apo","Trabajo","«Amba'apo ajapo hag̃ua marandu'anga» = Trabajo haciendo afiches"],
  ["Mbo'epy","Tema, lección","Arriba de cada clase: «Mbo'epy: Káso» = Tema: el caso"],
  ["Tembiaporã","Tarea, actividad","Lo que hay que hacer"],
  ["Reikuaa hag̃ua","Para saber","Recuadro con la teoría"],
  ["Jehaipyre","Texto (lo escrito)","«jehaipyrépe» = en el texto"],
  ["Porandu","Pregunta",""],
  ["Che remimo'ã","Mi opinión","«Ahai che remimo'ã» = Escribo mi opinión"],
  ["He'iséva","Lo que quiere decir, el significado","«ñe'ẽ he'iséva» = el significado de la palabra"],
  // palabras para preguntar
  ["Mávapa","¿Quién?","«Mávapa oñe'ẽ?» = ¿Quién habla?"],
  ["Mba'épa","¿Qué?","«Mba'épa ojehu?» = ¿Qué pasó?"],
  ["Moõpa","¿Dónde?","«Moõpa reiko?» = ¿Dónde vivís?"],
  ["Araka'épa","¿Cuándo?",""],
  ["Mba'érepa","¿Por qué?",""],
  ["Mba'éichapa","¿Cómo? (y también ¿cómo estás?)","«Mba'éichapa nde réra?» = ¿Cómo te llamás?"],
  ["Mbovýpa","¿Cuántos?","«Mbovýpa mitã?» = ¿Cuántos niños?"],
  // palabras de los casos
  ["Káso ñemombe'u","Relato de un caso","Lo que la gente cuenta que pasó"],
  ["Jaryi","Abuela",""],
  ["Tetã rembiguái","Soldado","Literal: servidor de la patria"],
  ["Ñe'ẽ pohýi","Palabra pesada, voz fuerte","pohýi = pesado"],
  ["Ñanihápe","Corriendo, al trote",""],
  ["Naiñakãi","Sin cabeza","akã = cabeza"],
  ["Póra","Fantasma, aparecido","Ojo: porã (con tilde en la a) = lindo"],
  ["Porã","Lindo, bueno","Ojo: póra = fantasma"],
  ["Ohepyme'ẽ","Vende, comercializa",""],
  ["Oñekarãi","Se rasguñó, rasguñado",""],
  ["Mba'e vai","Desgracia, cosa mala, daño","vai = feo, malo"],
  ["Mba'e porã","Cosa buena",""],
  ["Ñemoñare","Descendencia, hijos y nietos",""],
  ["Jo'oha","Pala","ojo'o = cava"],
  ["Ñakãrapu'ã","Triunfo, salir adelante",""],
  ["Hembireko","Su esposa",""],
  ["Pohãnohára","Curandero (el que cura)","pohã = remedio"],
  ["Mbokaja","Cocotero (palmera)","mbokaja tuja = cocotero viejo"],
  ["Juky","Sal",""],
  ["Mandyju","Algodón",""],
  ["Manduvi","Maní",""],
  ["Kokue","Chacra",""],
  ["Plata yvyguy","Tesoro enterrado","yvy = tierra · guy = debajo"],
  ["Ñorairõ Guasu","La Guerra Grande (contra la Triple Alianza)",""],
  ["Ka'arupytũ","Anochecer, noche","ka'aru = tarde · pytũ = oscuro"],
  ["Ñande rapo","Nuestras raíces",""],
  ["Arandu ka'aty","Sabiduría popular",""],
  // textos funcionales
  ["Marandu'anga","Afiche, cartel",""],
  ["Kuatiañe'ẽ","Carta",""],
  ["Tekove arandupy","Currículum vitae",""],
  ["Ñe'ẽjovake","Entrevista",""],
  ["Tenda","Lugar, dirección","En el sobre: la dirección"],
  ["Tetã","País",""],
  ["Táva","Ciudad, pueblo",""],
  ["Terakuéra","Nombres (de pila)",""],
  ["Terajoapy","Apellido",""],
  ["Pumbyry","Teléfono, celular",""],
  ["Mbo'ehára","Profesor, profesora",""],
  ["Mbo'ehao","Colegio, escuela",""],
  ["Aguyje","Gracias",""],
  ["Maitei","Saludos (saludo cordial)","Se usa para despedirse en una carta"],
  ["Jasypateĩ","Noviembre","jasy = mes · pa = diez · teĩ = uno → mes 11"],
  ["Jasypa","Octubre","mes 10"],
  // palabras chiquitas que aparecen siempre
  ["Ñe'ẽpoty","Poesía","ñe'ẽ = palabra · poty = flor"],["Ñe'ẽpapára","Poeta",""],["Haihára","Autor, escritor",""],["Ruguy","Sangre","«López ruguy» = la sangre de López"],
  ["Che ru","Mi papá",""],["Oñorairõva'ekue","El que peleó en la guerra",""],["Tetã rayhupápe","Por amor a la patria",""],["Tatatĩ","Humo","en el poema: tatatĩna = la amenaza"],
  ["-kuéra / -nguéra","Plural","kavajukuéra = los caballos · mitãnguéra = los niños"],["-kue","Lo que fue","rogakue = su antigua casa"],["-rã","Lo que va a ser, para","tembi'urã = para comer"],
  ["Ha","Y",""],["Avei","También",""],["Ko","Este, esta",""],["Umi","Esos, esas",""],
  ["Heta","Mucho, muchos",""],["Peteĩ","Uno, una",""],["Ndaha'éi","No es",""],["Ikatu","Puede, se puede",""],
  ["Tapicha","Persona, gente",""],["Óga","Casa",""],["Mitã","Niño, niña",""],["Ára","Día, tiempo",""]
];

/* consignas y preguntas en guaraní, palabra por palabra */
const CONSIGNAS = [
  ["Amoñe'ẽ ha ahendu ko káso.","Leo y escucho este caso.","amoñe'ẽ = leo · ha = y · ahendu = escucho · ko = este"],
  ["Amyesakã ñe'ẽ he'iséva jehaipyrépe.","Aclaro el significado de las palabras en el texto (significado contextual).","amyesakã = aclaro · ñe'ẽ = palabra · he'iséva = lo que quiere decir · jehaipyrépe = en el texto"],
  ["Aheka mba'épa he'ise ko jehaipyrépe.","Busco qué significa en este texto.","aheka = busco · mba'épa = qué · he'ise = quiere decir · ko = este · jehaipyrépe = en el texto"],
  ["Ambohovái ko'ã porandu.","Contesto estas preguntas.","ambohovái = contesto · ko'ã = estas · porandu = preguntas"],
  ["Ahai che remimo'ã.","Escribo mi opinión.","ahai = escribo · che = mi · remimo'ã = opinión"],
  ["Amombe'u ha ahai ambue káso.","Cuento y escribo otro caso.","amombe'u = cuento · ahai = escribo · ambue = otro"],
  ["Mávapa oñe'ẽ ko mombe'úpe?","¿Quién habla en este relato?","mávapa = quién · oñe'ẽ = habla · ko = este · mombe'úpe = en el relato"],
  ["Mba'épa ojehu chupekuéra?","¿Qué les pasó a ellos?","mba'épa = qué · ojehu = pasó · chupekuéra = a ellos"],
  ["Mba'épa hikuái ojapo?","¿Qué hicieron ellos?","mba'épa = qué · hikuái = ellos · ojapo = hacen, hicieron"],
  ["Moõpa oiko hikuái?","¿Dónde vivían ellos?","moõpa = dónde · oiko = vive(n) · hikuái = ellos"],
  ["Amoñe'ẽ peteĩ káso oñemombe'uva'ekue.","Leo un caso que se contó (un caso relatado).","peteĩ = un · oñemombe'uva'ekue = que fue contado"],
  ["Amba'apo ajapo hag̃ua marandu'anga.","Trabajo para hacer afiches.","amba'apo = trabajo · ajapo = hago · hag̃ua = para · marandu'anga = afiche"]
];

/* frases cortas para traducir (casos de la clase y diálogos del cuaderno) */
const FRASES = [
  ["Upépe omba'apo hikuái ikokuépe.","Allí trabajaban en su chacra.","upépe = allí · omba'apo = trabajan · hikuái = ellos · ikokuépe = en su chacra"],
  ["Heta tapicha ohayhu añete Hilario ha hogayguakuérape.","Mucha gente quería de verdad a Hilario y a su familia.","heta = mucho · tapicha = gente · ohayhu = quiere · añete = de verdad · hogayguakuéra = los de su casa (su familia) · -pe = a"],
  ["Ojuhu hikuái juky iñasãiva hóga jerere.","Encontraron sal esparcida alrededor de su casa.","ojuhu = encuentran · juky = sal · iñasãiva = esparcida · hóga = su casa · jerere = alrededor"],
  ["Ogueraha hikuái peteĩ jo'oha ha oñepyrũ ojo'o.","Llevaron una pala y empezaron a cavar.","ogueraha = llevan · peteĩ = una · jo'oha = pala · oñepyrũ = empiezan · ojo'o = cava"],
  ["Pehóramo katu, ikatu peñakãrapu'ãjey.","Pero si se van, pueden volver a salir adelante.","pehóramo = si ustedes se van · katu = pero · ikatu = pueden · peñakãrapu'ã = salen adelante · -jey = de nuevo"],
  ["Mba'e vai rire, mba'e porã manteva'erã.","Después de lo malo, siempre tiene que venir lo bueno.","mba'e vai = cosa mala · rire = después de · mba'e porã = cosa buena · mante = siempre · va'erã = tiene que"],
  ["Chéve guarã umi káso iporã.","Para mí, esos casos son lindos.","chéve guarã = para mí · umi = esos · iporã = es lindo"],
  ["Che réra Sofi ha aiko Villarrica-pe.","Me llamo Sofi y vivo en Villarrica.","che réra = mi nombre · ha = y · aiko = vivo · -pe = en"],
  ["Mba'éichapa nde réra?","¿Cómo te llamás?","mba'éichapa = cómo · nde = tu · réra = nombre"],
  ["Moõpa reiko?","¿Dónde vivís?","moõpa = dónde · reiko = vivís"],
  ["Mba'épa rejapo?","¿Qué hacés?","mba'épa = qué · rejapo = hacés"],
  ["Ahai ndéve ko kuatiañe'ẽ.","Te escribo esta carta.","ahai = escribo · ndéve = a vos · ko = esta · kuatiañe'ẽ = carta"]
];

/* lectura: fragmentos cortos con preguntas */
const LECTURAS = [
  {t:"Mboriahu ryguatã káso", txt:"«Ha'ekuéra niko oikova'ekue, ñepyrũrãme, Itakyrýpe. Upépe omba'apo hikuái ikokuépe.»",
   q:"Moõpa oikova'ekue Hilario ha ña Carmen? Moõpa omba'apo hikuái?", es:"¿Dónde vivían Hilario y ña Carmen? ¿Dónde trabajaban?",
   p:[["Palabras","oikova'ekue = vivían · ñepyrũrãme = al principio · omba'apo = trabajan · ikokuépe = en su chacra"],["Buscá en el texto","«Moõpa» pregunta por un lugar: buscá las palabras que terminan en -pe (= en)."]],
   r:"Oikova'ekue Itakyrýpe (vivían en Itakyry).\nOmba'apo hikuái ikokuépe (trabajaban en su chacra)."},
  {t:"Mboriahu ryguatã káso", txt:"«Hilario ha hembireko ña Carmen omongakuaa irundy mitã: mokõi kuimba'e ha mokõi kuña.»",
   q:"Mbovýpa mitã oguereko hikuái? Mávapa ha'ekuéra?", es:"¿Cuántos hijos tienen? ¿Quiénes son?",
   p:[["Palabras","hembireko = su esposa · omongakuaa = crían · irundy = cuatro · mokõi = dos · kuimba'e = varón · kuña = mujer"]],
   r:"Irundy mitã (cuatro hijos): mokõi kuimba'e ha mokõi kuña (dos varones y dos mujeres)."},
  {t:"Mboriahu ryguatã káso", txt:"«Peteĩ pohãnohára chae he'i chupekuéra: Pehóramo katu, ikatu peñakãrapu'ãjey.»",
   q:"Mávapa oñe'ẽ? Mba'épa he'i?", es:"¿Quién habla? ¿Qué dice?",
   p:[["Palabras","pohãnohára = curandero · he'i = dice · chupekuéra = a ellos · pehóramo = si se van · ikatu = pueden · peñakãrapu'ãjey = salir adelante de nuevo"]],
   r:"Oñe'ẽ peteĩ pohãnohára (habla un curandero).\nHe'i ikatuha oñakãrapu'ãjey ohóramo (dice que si se van pueden volver a salir adelante)."},
  {t:"Káso póra rehegua", txt:"«Tapicha oikóva Parque Caballero jerére omombe'u osẽha peteĩ kavaju ári ha ñe'ẽ pohýipe ojokuái tetã rembiguáipe.»",
   q:"Mávapa omombe'u ko káso? Mba'épa ojehu?", es:"¿Quiénes cuentan este caso? ¿Qué pasa?",
   p:[["Palabras","tapicha oikóva = la gente que vive · jerére = alrededor · omombe'u = cuentan · osẽ = sale · kavaju ári = a caballo · ñe'ẽ pohýipe = con voz fuerte · ojokuái = manda · tetã rembiguái = soldados"]],
   r:"Omombe'u tapicha oikóva Parque Caballero jerére (lo cuenta la gente que vive alrededor del Parque Caballero).\nOsẽ peteĩ kavaju ári ha ojokuái tetã rembiguáipe (sale alguien a caballo y da órdenes a los soldados con voz fuerte)."},
  {t:"Ñe'ẽjovake (entrevista)", txt:"— Mba'éichapa nde réra?\n— Che réra Tamara.\n— Moõpa reiko?\n— Aiko Villarrica-pe.",
   q:"Mba'épa oporandu? Mba'épa ombohovái?", es:"¿Qué pregunta? ¿Qué contesta?",
   p:[["Palabras","oporandu = pregunta · ombohovái = contesta · nde réra = tu nombre · reiko = vivís · aiko = vivo"]],
   r:"Oporandu mba'éichapa héra ha moõpa oiko (pregunta cómo se llama y dónde vive).\nOmbohovái: héra Tamara ha oiko Villarrica-pe (contesta que se llama Tamara y vive en Villarrica)."}
];

/* escribir: consigna, estructura y un modelo */
const ESCRIBIR = [
  {t:"Kuatiañe'ẽ (carta)", q:"Ahai peteĩ kuatiañe'ẽ che mbo'ehárape.\n(Escribí una carta corta a tu profesora para agradecerle.)",
   p:[["1. Lugar y fecha","Villarrica, 5 jasypateĩ 2026-pe."],["2. Para quién","Mbo'ehára …"],["3. Saludo","Kuñakarai marangatu: (Estimada señora:)"],
      ["4. Cuerpo","Lo que querés decir: Ahai ndéve ko kuatiañe'ẽ… (Te escribo esta carta…)"],["5. Despedida y firma","Maitei, (tu nombre)"]],
   r:"Villarrica, 5 jasypateĩ 2026-pe.\nMbo'ehára …\nKuñakarai marangatu:\nAhai ndéve ko kuatiañe'ẽ amog̃uahẽvo tory ha py'aguapy nde rekovépe. Aguyje opa mba'ére.\nMaitei,\nSofi\n\n(Te escribo esta carta llevándote alegría y paz. Gracias por todo. Saludos, Sofi.)"},
  {t:"Marandu'anga (afiche)", q:"Ejapo peteĩ marandu'anga peteĩ tembi'u renda rehegua.\n(Hacé un afiche para un lugar de comidas.)",
   p:[["1. Título grande y llamativo","Karu Porã"],["2. Imagen","Dibujos de las comidas"],["3. Mensaje corto","Tembi'u he (comida rica)"],["4. Datos","Quién, dónde, cuándo"]],
   r:"KARU PORÃ\nÑa Chela róga\nTembi'u he! Eju ha ekaru!\n(dibujos de empanadas, hamburguesa y sándwich)\n\n(Comer Bien · En lo de ña Chela · ¡Comida rica! ¡Vení a comer!)"},
  {t:"Ñe'ẽjovake (entrevista)", q:"Ejapo peteĩ ñe'ẽjovake mbykymi.\n(Escribí una entrevista corta: saludo, preguntas y despedida.)",
   p:[["1. Saludo","Mba'éichapa? (¿Cómo estás?) · Iporã, ha nde? (Bien, ¿y vos?)"],["2. Preguntas","Mba'éichapa nde réra? · Moõpa reiko? · Mba'épa rejapo?"],["3. Despedida","Aguyje! (¡Gracias!) · Jajotopata peve! (¡Hasta la próxima!)"]],
   r:"— Mba'éichapa?\n— Iporã, ha nde?\n— Iporã avei. Mba'éichapa nde réra?\n— Che réra Tamara.\n— Moõpa reiko?\n— Aiko Villarrica-pe.\n— Mba'épa rejapo?\n— Ambopu mbaraka.\n— Aguyje! Jajotopata peve!\n\n(¿Cómo estás? Bien, ¿y vos? También bien. ¿Cómo te llamás? Tamara. ¿Dónde vivís? En Villarrica. ¿Qué hacés? Toco la guitarra. ¡Gracias! ¡Hasta la próxima!)"},
  {t:"Tekove arandupy (currículum)", q:"Ejapo nde tekove arandupy.\n(Armá un currículum con las cuatro partes.)",
   p:[["A. Mávapa che (datos personales)","Terakuéra (nombres) · Terajoapy (apellido) · Che retã (nacionalidad) · Óga renda (domicilio) · Pumbyry (teléfono)"],
      ["Ã. Arandupy (estudios)","Tekombo'e ñepyrũ (primaria) · Tekombo'e mokõiha (secundaria)"],["Ch. Che rembiapokue (experiencia laboral)","Dónde trabajaste y qué hiciste"],
      ["E. Tapicha techakuaáva (referencias)","Personas que te conocen, con su teléfono"]],
   r:"A. Mávapa che\nTerakuéra: Ana María · Terajoapy: Benítez · Che retã: paraguaya · Óga renda: Villarrica · Pumbyry: 0981 000 000\nÃ. Arandupy\nTekombo'e ñepyrũ ha mokõiha: Villarrica-pe\nCh. Che rembiapokue\n(lo que hayas hecho, o «ndaipóri» = no hay)\nE. Tapicha techakuaáva\nNombre y teléfono de alguien que te conoce\n\n(Usá datos inventados para practicar.)"},
  {t:"Che remimo'ã (mi opinión)", q:"Ahai che remimo'ã umi káso ñemombe'úre.\n(Escribí tu opinión sobre los casos.)",
   p:[["1. Empezá con una marca de opinión","Chéve guarã… (Para mí…) · Che aimo'ã… (Yo creo…)"],["2. Decí por qué","…-gui (porque…) · umíva rupi (por eso)"],["3. Cerrá","Una frase corta"]],
   r:"Chéve guarã umi káso ñemombe'u iporã ñanerekombo'égui. Umíva rupi jaikuaa ñande rapo ha ñande arandu ka'aty.\n\n(Para mí los casos son lindos porque nos enseñan. Por ellos conocemos nuestras raíces y nuestra sabiduría popular.)"},
  {t:"Káso ñemombe'u (contar un caso)", q:"Amombe'u ha ahai peteĩ káso.\n(Contá un caso: quiénes, dónde, qué pasó y cómo terminó.)",
   p:[["1. Mávapa (quiénes)","Los personajes"],["2. Moõpa (dónde)","El lugar"],["3. Mba'épa ojehu (qué pasó)","Lo raro o misterioso"],["4. Mba'éichapa opa (cómo termina)","El final"]],
   r:"Tapicha oikóva Parque Caballero jerére omombe'u osẽha peteĩ kavaju ári ha ñe'ẽ pohýipe ojokuái tetã rembiguáipe. Heta jey pe kavaju naiñakãi ha oguata Bernardino Caballero rogakue renonde rupi.\n\n(La gente que vive alrededor del Parque Caballero cuenta que sale alguien a caballo que da órdenes a los soldados con voz fuerte. Muchas veces el caballo no tiene cabeza y camina frente a la antigua casa de Bernardino Caballero.)"}
];

/* =====================  MATERIA  ===================== */
window.MATERIA = {
  nombre:"Guaraní", corto:"Guaraní", titulo:"Dina Guaraní", clave:"dinaGuarani.v1",
  lema:"¡Psst! Respondé bien y Dina no se come la torta",
  pie:"Preguntas del cuaderno de Guaraní Ñe'ẽ (2.ª etapa)",
  resumenSub:"todo traducido, con las palabras del examen",
  muestraCorta:"Mba'éichapa?", muestra:"Mba'éichapa? Iporã, ha nde?\nAmoñe'ẽ ha ahendu ko káso.",
  segundos:50,
  temas:{
    g1:{nom:"Consignas y preguntas", sub:"Amoñe'ẽ, Ambohovái, Mávapa…", c:"var(--b1)", s:"var(--b1s)"},
    g2:{nom:"Káso ñemombe'u", sub:"los casos de la clase", c:"var(--b2)", s:"var(--b2s)"},
    g3:{nom:"Palabras de los casos", sub:"significado contextual", c:"var(--b3)", s:"var(--b3s)"},
    g4:{nom:"Hecho, opinión y modos", sub:"oje'éva, oñeimo'ãva, gua'u, mo'ã", c:"var(--b4)", s:"var(--b4s)"},
    g5:{nom:"Afiche, carta, CV y entrevista", sub:"marandu'anga, kuatiañe'ẽ…", c:"#3a9bd9", s:"#24739f"},
    g6:{nom:"Ñe'ẽpoty: Kangue rekyi", sub:"el poema de Félix Fernández (1.ª etapa)", c:"#e0a21b", s:"#a87806"}
  },
  banco:[
/* ---------- Consignas y preguntas ---------- */
{id:"k1",b:"g1",q:"En una consigna, ¿qué significa **Amoñe'ẽ**?",o:["Leo","Escucho","Escribo","Contesto"],e:"Amoñe'ẽ = leo. «Amoñe'ẽ ha ahendu ko káso» = Leo y escucho este caso.",s:"Cuaderno: Káso"},
{id:"k2",b:"g1",q:"¿Qué significa **Ahendu**?",o:["Escucho","Leo","Busco","Dibujo"],e:"Ahendu = escucho (hendu = oír).",s:"Cuaderno: Káso"},
{id:"k3",b:"g1",q:"¿Qué significa **Ambohovái**?",o:["Contesto","Pregunto","Cuento","Copio"],e:"Ambohovái = contesto. Siempre viene antes de las preguntas sobre el texto.",s:"Cuaderno: Káso"},
{id:"k4",b:"g1",q:"¿Qué significa **Amyesakã ñe'ẽ he'iséva jehaipyrépe**?",o:["Aclaro el significado de las palabras en el texto","Escribo mi opinión sobre el texto","Leo el texto en voz alta","Cuento otro caso"],e:"Amyesakã = aclaro · ñe'ẽ = palabra · he'iséva = lo que quiere decir · jehaipyrépe = en el texto. Es el «significado contextual».",s:"Cuaderno: Káso"},
{id:"k5",b:"g1",q:"¿Qué significa **Aheka**?",o:["Busco","Escribo","Leo","Pinto"],e:"Aheka = busco. «Aheka mba'épa he'ise» = Busco qué significa.",s:"Cuaderno: Hecho y opinión"},
{id:"k6",b:"g1",q:"¿Qué significa **Ahai che remimo'ã**?",o:["Escribo mi opinión","Escribo un cuento","Leo mi opinión","Copio el texto"],e:"Ahai = escribo · che remimo'ã = mi opinión.",s:"Cuaderno: Káso"},
{id:"k7",b:"g1",q:"¿Qué significa **Amombe'u ha ahai ambue káso**?",o:["Cuento y escribo otro caso","Leo y escucho este caso","Busco el significado de otro caso","Contesto las preguntas del caso"],e:"Amombe'u = cuento · ahai = escribo · ambue = otro.",s:"Cuaderno: Káso"},
{id:"k8",b:"g1",q:"¿Qué pregunta **Mávapa**?",o:["¿Quién?","¿Qué?","¿Dónde?","¿Cuándo?"],e:"Mávapa = ¿quién? «Mávapa oñe'ẽ?» = ¿Quién habla?",s:"Palabras para preguntar"},
{id:"k9",b:"g1",q:"¿Qué pregunta **Mba'épa**?",o:["¿Qué?","¿Quién?","¿Cuántos?","¿Por qué?"],e:"Mba'épa = ¿qué? «Mba'épa ojehu?» = ¿Qué pasó?",s:"Palabras para preguntar"},
{id:"k10",b:"g1",q:"¿Qué pregunta **Moõpa**?",o:["¿Dónde?","¿Cómo?","¿Quién?","¿Cuándo?"],e:"Moõpa = ¿dónde? La respuesta casi siempre termina en -pe (= en): Itakyrýpe, Villarrica-pe.",s:"Palabras para preguntar"},
{id:"k11",b:"g1",q:"¿Qué pregunta **Araka'épa**?",o:["¿Cuándo?","¿Dónde?","¿Cuántos?","¿Cómo?"],e:"Araka'épa = ¿cuándo? (ára = día, tiempo).",s:"Palabras para preguntar"},
{id:"k12",b:"g1",q:"¿Qué pregunta **Mba'érepa**?",o:["¿Por qué?","¿Para qué?","¿Qué?","¿Quién?"],e:"Mba'érepa = ¿por qué?",s:"Palabras para preguntar"},
{id:"k13",b:"g1",q:"¿Qué pregunta **Mbovýpa**?",o:["¿Cuántos?","¿Cuándo?","¿Cómo?","¿Dónde?"],e:"Mbovýpa = ¿cuántos? «Mbovýpa mitã?» = ¿Cuántos niños?",s:"Palabras para preguntar"},
{id:"k14",b:"g1",q:"Mba'épa he'ise **Mbo'epy**?",es:"¿Qué significa «Mbo'epy»?",o:["Tema, lección","Tarea","Profesor","Escuela"],e:"Está arriba de cada clase: «Mbo'epy: Káso» = Tema: el caso. Tarea es tembiaporã.",s:"Cuaderno"},
{id:"k15",b:"g1",q:"Mba'épa he'ise **Tembiaporã**?",es:"¿Qué significa «Tembiaporã»?",o:["Tarea, actividad","Tema","Texto","Pregunta"],e:"Tembiaporã = tarea, lo que hay que hacer.",s:"Cuaderno"},
{id:"k16",b:"g1",q:"Mba'épa he'ise **Jehaipyre**?",es:"¿Qué significa «Jehaipyre»?",o:["Texto (lo escrito)","Lectura en voz alta","Cuaderno","Firma"],e:"Jehaipyre = lo escrito, el texto (de hai = escribir). «jehaipyrépe» = en el texto.",s:"Cuaderno: Káso"},
{id:"k17",b:"g1",q:"Mávapa oñe'ẽ ko mombe'úpe?",es:"¿Quién habla en este relato?",o:["¿Quién habla en este relato?","¿Qué pasó en este relato?","¿Dónde vive este personaje?","¿Por qué se fueron?"],e:"Mávapa = quién · oñe'ẽ = habla · mombe'úpe = en el relato.",s:"Cuaderno: Káso"},
{id:"k18",b:"g1",q:"Mba'épa ojehu chupekuéra?",es:"¿Qué les pasó a ellos?",o:["¿Qué les pasó a ellos?","¿Quiénes son ellos?","¿Dónde viven ellos?","¿Qué dijeron ellos?"],e:"Mba'épa = qué · ojehu = pasó · chupekuéra = a ellos.",s:"Cuaderno: Hecho y opinión"},
/* ---------- Káso ñemombe'u ---------- */
{id:"s1",b:"g2",q:"¿Qué es un **káso ñemombe'u**?",o:["Un relato de algo que la gente cuenta que pasó de verdad, muchas veces misterioso","Un poema con rima","Una carta formal","Un afiche con imágenes"],e:"Káso = caso · ñemombe'u = relato. Se cuenta de boca en boca y mezcla hechos con creencias (fantasmas, tesoros…).",s:"Cuaderno: Káso"},
{id:"s2",b:"g2",q:"Mávapa ohai «Mboriahu ryguatã káso»?",es:"¿Quién escribió «Mboriahu ryguatã káso»?",o:["David Galeano Olivera","Félix Fernández","Clementina Acosta","Augusto Roa Bastos"],e:"«Ohai» en la fotocopia dice el autor: David Galeano Olivera.",s:"Fotocopia del caso"},
{id:"s3",b:"g2",q:"¿Qué quiere decir el título **Mboriahu ryguatã**?",o:["Pobre pero satisfecho (con la panza llena)","Rico y avaro","Pobre y triste","El tesoro escondido"],e:"Mboriahu = pobre · ryguatã = satisfecho, lleno. Hilario y su familia eran pobres pero vivían bien y felices.",s:"Mboriahu ryguatã káso"},
{id:"s4",b:"g2",q:"Moõpa oikova'ekue Hilario ha ña Carmen ñepyrũrãme?",es:"¿Dónde vivían Hilario y ña Carmen al principio?",o:["Itakyrýpe (en Itakyry)","Karaguatáipe (en Caraguatay)","Brasil-pe","Villarrica-pe"],e:"Al principio vivían en Itakyry. Después se mudaron a Karaguatay.",s:"Mboriahu ryguatã káso"},
{id:"s5",b:"g2",q:"¿Qué cultivaban para vender (ohepyme'ẽ hag̃ua)?",o:["Algodón (mandyju) y maní (manduvi)","Mandioca y maíz","Caña de azúcar","Soja y trigo"],e:"Mandyju = algodón, manduvi = maní. La mandioca y el maíz eran para comer.",s:"Mboriahu ryguatã káso"},
{id:"s6",b:"g2",q:"¿Qué encontraron un día alrededor de su casa?",o:["Sal esparcida (juky)","Una carreta","Plata enterrada","Un caballo sin cabeza"],e:"«Ojuhu hikuái juky iñasãiva hóga jerere» = encontraron sal esparcida alrededor de su casa.",s:"Mboriahu ryguatã káso"},
{id:"s7",b:"g2",q:"¿Qué les pasó después de encontrar la sal?",o:["Todo les salió mal: ña Carmen se enfermó y sus vacas aparecieron rasguñadas y murieron","Ganaron mucha plata","Se fueron a vivir a Brasil","Nada, siguieron igual"],e:"Desde ese día nada les salió bien. Vacas oñekarãi (rasguñadas) que después murieron.",s:"Mboriahu ryguatã káso"},
{id:"s8",b:"g2",q:"¿Qué les dijo el **pohãnohára** (curandero)?",o:["Que les estaban haciendo daño y que se fueran rápido de ahí","Que se quedaran y rezaran","Que vendieran las vacas","Que cavaran al pie del cocotero"],e:"«Mba'e vai niko ojejapo penderehe» = les están haciendo daño. «Pehóramo katu, ikatu peñakãrapu'ãjey» = si se van, pueden salir adelante otra vez.",s:"Mboriahu ryguatã káso"},
{id:"s9",b:"g2",q:"¿A dónde se mudaron?",o:["A Karaguatay (Caraguatay)","A Itakyry","A Asunción","A Brasil"],e:"Dejaron Itakyry y se fueron lejos, a Karaguatay. Allá empezaron de cero.",s:"Mboriahu ryguatã káso"},
{id:"s10",b:"g2",q:"¿Qué vieron de noche, varias veces, en Karaguatay?",o:["Una carreta vacía que desaparecía frente a un cocotero viejo (mbokaja tuja)","Un soldado fantasma","Una luz en el cielo","Un perro negro"],e:"Karréta nandi = carreta vacía. Pasaba y desaparecía frente al mbokaja tuja. Pasó tres noches.",s:"Mboriahu ryguatã káso"},
{id:"s11",b:"g2",q:"¿Qué es la **plata yvyguy**?",o:["Un tesoro enterrado (dinero o joyas), que según la creencia se escondió en la Guerra Grande","El sueldo del mes","Una mina de plata","Una moneda falsa"],e:"Yvy = tierra · guy = debajo. En el caso dicen que Karaguatay fue lugar de paso de la Ñorairõ Guasu (Guerra Grande).",s:"Mboriahu ryguatã káso"},
{id:"s12",b:"g2",q:"¿Cómo termina el caso?",o:["Encontraron el tesoro, Hilario lo vendió en Brasil y compró una casa grande en Paraguay","Perdieron todo y volvieron a Itakyry","La carreta se llevó el tesoro","El curandero se quedó con el tesoro"],e:"Se cumplió lo que dijo el curandero: si se iban, podían salir adelante otra vez (oñakãrapu'ãjey).",s:"Mboriahu ryguatã káso"},
{id:"s13",b:"g2",q:"La última frase dice **«Mba'e vai rire, mba'e porã manteva'erã»**. ¿Qué significa?",o:["Después de lo malo, siempre viene lo bueno","Lo malo nunca termina","Hay que trabajar mucho","El dinero trae problemas"],e:"mba'e vai = lo malo · rire = después de · mba'e porã = lo bueno · mante = siempre · va'erã = tiene que.",s:"Mboriahu ryguatã káso"},
{id:"s14",b:"g2",q:"¿Qué creencias paraguayas aparecen en «Mboriahu ryguatã káso»?",o:["El daño hecho con sal (mba'e vai) y la plata yvyguy","El Pombero y el Kurupi","El Luisón","Ninguna"],e:"La sal esparcida era un daño (mba'e vai) y el tesoro enterrado es la plata yvyguy.",s:"Mboriahu ryguatã káso"},
{id:"s15",b:"g2",q:"¿Qué significa **«Póra rehegua»**?",o:["Sobre fantasmas (aparecidos)","Sobre gente linda","Sobre la guerra","Sobre la abuela"],e:"Póra = fantasma · rehegua = sobre, acerca de. Ojo: porã = lindo.",s:"Cuaderno: Káso (8/7)"},
{id:"s16",b:"g2",q:"En el caso de fantasmas de la clase, ¿dónde dicen que pasan las apariciones?",o:["Alrededor del Parque Caballero y en el Jardín Botánico (Asunción)","En Itakyry y Karaguatay","En Villarrica","En Encarnación"],e:"La gente que vive alrededor del Parque Caballero lo cuenta. También se dice que pasa en el Jardín Botánico, en la antigua casa del Mariscal López.",s:"Cuaderno: Káso (8/7)"},
{id:"s17",b:"g2",q:"En ese caso, ¿qué aparece?",o:["Alguien a caballo que da órdenes a los soldados con voz fuerte, y un caballo sin cabeza","Una carreta vacía","Sal alrededor de una casa","Un tesoro enterrado"],e:"«Ñe'ẽ pohýipe ojokuái tetã rembiguáipe» = con voz fuerte manda a los soldados. «Naiñakãi» = sin cabeza.",s:"Cuaderno: Káso (8/7)"},
{id:"s18",b:"g2",q:"¿Por qué son importantes los káso, según el cuaderno?",o:["Porque nos enseñan y por ellos conocemos nuestras raíces y la sabiduría popular","Porque son todos verdaderos","Porque son cuentos para dormir","Porque son de otro país"],e:"«Umíva rupi jaikuaa ñande rapo ha ñande arandu ka'aty» = por ellos conocemos nuestras raíces y nuestra sabiduría popular.",s:"Cuaderno: Káso"},
/* ---------- Palabras de los casos ---------- */
{id:"w1",b:"g3",q:"Mba'épa he'ise **jaryi**?",es:"¿Qué significa «jaryi»?",o:["Abuela","Abuelo","Hermana","Tía"],e:"Jaryi = abuela. «Nde taita térã nde jaryi» = tu papá o tu abuela.",s:"Cuaderno: Káso (8/7)"},
{id:"w2",b:"g3",q:"Mba'épa he'ise **tetã rembiguái**?",es:"¿Qué significa «tetã rembiguái»?",o:["Soldado","Presidente","Fantasma","Vecino"],e:"Literal: servidor de la patria (tetã = patria, país).",s:"Cuaderno: Káso (8/7)"},
{id:"w3",b:"g3",q:"Mba'épa he'ise **ñe'ẽ pohýi**?",es:"¿Qué significa «ñe'ẽ pohýi»?",o:["Palabra pesada, voz fuerte","Palabra linda","Palabra en voz baja","Mentira"],e:"Ñe'ẽ = palabra, voz · pohýi = pesado.",s:"Cuaderno: Káso (8/7)"},
{id:"w4",b:"g3",q:"Mba'épa he'ise **ñanihápe**?",es:"¿Qué significa «ñanihápe»?",o:["Corriendo, al trote","Durmiendo","Despacio","Llorando"],e:"Ñani = correr. «ohasa ñanihápe» = pasa corriendo.",s:"Cuaderno: Káso (8/7)"},
{id:"w5",b:"g3",q:"Mba'épa he'ise **naiñakãi**?",es:"¿Qué significa «naiñakãi»?",o:["Sin cabeza (desorientado)","Sin piernas","Muy grande","Muy rápido"],e:"Akã = cabeza. Na-…-i es negación: no tiene cabeza.",s:"Cuaderno: Káso (8/7)"},
{id:"w6",b:"g3",q:"Mba'épa he'ise **ohepyme'ẽ**?",es:"¿Qué significa «ohepyme'ẽ»?",o:["Vende, comercializa","Compra","Regala","Siembra"],e:"Cultivaban algodón y maní para vender (ohepyme'ẽ hag̃ua).",s:"Cuaderno: Hecho y opinión"},
{id:"w7",b:"g3",q:"Mba'épa he'ise **oñekarãi**?",es:"¿Qué significa «oñekarãi»?",o:["Se rasguñó, rasguñado","Se enfermó","Se murió","Se escapó"],e:"Las vacas aparecieron oñekarãi (rasguñadas) y sangrando.",s:"Cuaderno: Hecho y opinión"},
{id:"w8",b:"g3",q:"Mba'épa he'ise **mba'e vai**?",es:"¿Qué significa «mba'e vai»?",o:["Desgracia, cosa mala, daño","Cosa buena","Cosa grande","Comida rica"],e:"Mba'e = cosa · vai = feo, malo. Lo contrario: mba'e porã.",s:"Cuaderno: Hecho y opinión"},
{id:"w9",b:"g3",q:"Mba'épa he'ise **ñemoñare**?",es:"¿Qué significa «ñemoñare»?",o:["Descendencia, generación (hijos y nietos)","Vecinos","Antepasados muertos","Animales"],e:"El curandero dice: si aman su vida y su ñemoñare (sus hijos), váyanse.",s:"Cuaderno: Hecho y opinión"},
{id:"w10",b:"g3",q:"Mba'épa he'ise **jo'oha**?",es:"¿Qué significa «jo'oha»?",o:["Pala","Olla","Carreta","Hacha"],e:"Jo'o = cavar · -ha = lo que sirve para. Con la jo'oha cavaron al pie del mbokaja.",s:"Cuaderno: Hecho y opinión"},
{id:"w11",b:"g3",q:"Mba'épa he'ise **ñakãrapu'ã**?",es:"¿Qué significa «ñakãrapu'ã»?",o:["Triunfo, salir adelante","Fracaso","Enfermedad","Viaje"],e:"«Ikatu peñakãrapu'ãjey» = pueden volver a salir adelante.",s:"Cuaderno: Hecho y opinión"},
{id:"w12",b:"g3",q:"¿Qué significa **póra** (con tilde en la o)?",o:["Fantasma","Lindo","Pobre","Abuela"],e:"Ojo, parecidas: póra = fantasma · porã = lindo. Está anotado arriba en el cuaderno.",s:"Cuaderno (8/7)"},
{id:"w13",b:"g3",q:"Mba'épa he'ise **hembireko**?",es:"¿Qué significa «hembireko»?",o:["Su esposa","Su hija","Su mamá","Su hermana"],e:"«Hilario ha hembireko ña Carmen» = Hilario y su esposa ña Carmen.",s:"Mboriahu ryguatã káso"},
{id:"w14",b:"g3",q:"Mba'épa he'ise **pohãnohára**?",es:"¿Qué significa «pohãnohára»?",o:["Curandero (el que cura)","Vendedor","Maestro","Soldado"],e:"Pohã = remedio · -hára = el que hace. El que cura.",s:"Mboriahu ryguatã káso"},
{id:"w15",b:"g3",q:"Mba'épa he'ise **juky**?",es:"¿Qué significa «juky»?",o:["Sal","Azúcar","Agua","Tierra"],e:"Encontraron juky (sal) esparcida alrededor de la casa.",s:"Mboriahu ryguatã káso"},
{id:"w16",b:"g3",q:"Mba'épa he'ise **mbokaja tuja**?",es:"¿Qué significa «mbokaja tuja»?",o:["Cocotero viejo","Árbol nuevo","Casa vieja","Carreta vieja"],e:"Mbokaja = cocotero (palmera) · tuja = viejo.",s:"Mboriahu ryguatã káso"},
{id:"w17",b:"g3",q:"Mba'épa he'ise **Ñorairõ Guasu**?",es:"¿Qué significa «Ñorairõ Guasu»?",o:["La Guerra Grande (contra la Triple Alianza)","La Guerra del Chaco","Una fiesta grande","Un pueblo grande"],e:"Ñorairõ = guerra, pelea · guasu = grande.",s:"Mboriahu ryguatã káso"},
{id:"w18",b:"g3",q:"Mba'épa he'ise **kokue**?",es:"¿Qué significa «kokue»?",o:["Chacra","Casa","Escuela","Monte"],e:"«Omba'apo hikuái ikokuépe» = trabajaban en su chacra.",s:"Mboriahu ryguatã káso"},
{id:"w19",b:"g3",q:"Mba'épa he'ise **ka'arupytũ**?",es:"¿Qué significa «ka'arupytũ»?",o:["Anochecer, noche","Mediodía","Mañana","Lluvia"],e:"Ka'aru = tarde · pytũ = oscuro.",s:"Mboriahu ryguatã káso"},
{id:"w20",b:"g3",q:"Mba'épa he'ise **ñande rapo**?",es:"¿Qué significa «ñande rapo»?",o:["Nuestras raíces","Nuestra casa","Nuestro idioma","Nuestros hijos"],e:"Ñande = nuestro · rapo = raíz.",s:"Cuaderno: Káso"},
/* ---------- Hecho, opinión y modos ---------- */
{id:"h1",b:"g4",q:"¿Qué es **oje'éva**?",o:["Un hecho: algo que se dice que pasó y se puede comprobar","Una opinión personal","Algo inventado","Una pregunta"],e:"Oje'éva = lo que se dice (hecho). Oñeimo'ãva = lo que se cree (opinión).",s:"Cuaderno: Hecho y opinión"},
{id:"h2",b:"g4",q:"¿Qué es **oñeimo'ãva**?",o:["Una opinión: lo que alguien piensa o cree","Un hecho comprobado","Una fantasía","Un lugar"],e:"Viene de imo'ã = creer, pensar. «Che remimo'ã» = mi opinión.",s:"Cuaderno: Hecho y opinión"},
{id:"h3",b:"g4",q:"¿Qué es **añetegua**?",o:["Lo real, lo verdadero","Lo inventado","La opinión","El final del cuento"],e:"Añete = verdad. Añetegua = de la realidad.",s:"Cuaderno: Hecho y opinión"},
{id:"h4",b:"g4",q:"¿Qué es **añetegua'ỹ**?",o:["Fantasía: lo que no es real","La realidad","Un hecho","Una carta"],e:"El final -'ỹ significa «sin, no». Añetegua'ỹ = lo que no es real.",s:"Cuaderno: Hecho y opinión"},
{id:"h5",b:"g4",q:"«Chéve guarã umi káso iporã». ¿Qué es?",es:"«Para mí, esos casos son lindos.»",o:["Una opinión (oñeimo'ãva)","Un hecho (oje'éva)","Una fantasía","Una pregunta"],e:"«Chéve guarã» = para mí: marca de opinión.",s:"Cuaderno: Hecho y opinión"},
{id:"h6",b:"g4",q:"«Hilario ha ña Carmen oikova'ekue Itakyrýpe». ¿Qué es?",es:"«Hilario y ña Carmen vivían en Itakyry.»",o:["Un hecho (oje'éva)","Una opinión (oñeimo'ãva)","Una pregunta","Un consejo"],e:"Es un dato que cuenta el relato, no lo que alguien piensa.",s:"Cuaderno: Hecho y opinión"},
{id:"h7",b:"g4",q:"¿Cuál de estas expresiones marca una **opinión**?",o:["Che aimo'ã… (Yo creo…)","Ko'ẽrõ… (Mañana…)","Itakyrýpe… (En Itakyry…)","Peteĩ ára… (Un día…)"],e:"Che aimo'ã = yo creo. También: chéve guarã = para mí.",s:"Hecho y opinión"},
{id:"h8",b:"g4",q:"¿Cuál de estas partes del caso es **fantasía (añetegua'ỹ)**?",o:["Una carreta vacía que desaparece frente al cocotero","Se mudaron a Karaguatay","Trabajaban en un algodonal","Hilario fue a Brasil"],e:"Una carreta que desaparece no puede pasar en la realidad. Lo demás sí puede pasar.",s:"Cuaderno: Hecho y opinión"},
{id:"h9",b:"g4",q:"¿Cuál de estas es **realidad (añetegua)**?",o:["Hilario y su hijo trabajaban en un algodonal","Un caballo sin cabeza camina de noche","Una carreta desaparece","Un jinete fantasma da órdenes"],e:"Trabajar en un algodonal pasa de verdad. Lo otro es fantasía.",s:"Hecho y opinión"},
{id:"h10",b:"g4",q:"Modo aparencial: la acción es fingida o de mentira. ¿Qué partícula se usa?",o:["gua'u","mo'ã","kuéra","pe"],e:"Gua'u = de mentira, fingido. «Oke gua'u» = se hace el dormido.",s:"Cuaderno: Me informo (10/9)"},
{id:"h11",b:"g4",q:"Modo intencional: muestra la intención (algo que se iba a hacer). ¿Qué partícula se usa?",o:["mo'ã","gua'u","nga'u","kuri"],e:"«Ahupytymo'ã» = iba a alcanzar (quise, pero no pasó).",s:"Cuaderno: Me informo (10/9)"},
{id:"h12",b:"g4",q:"Según el cuaderno, ¿qué partícula usa el modo **apelativo**?",o:["nga'u","gua'u","mo'ã","rire"],e:"Así está anotado: modo apelativo, partícula nga'u.",s:"Cuaderno: Me informo (10/9)"},
{id:"h13",b:"g4",q:"¿Qué significa **«Oke gua'u»**?",o:["Se hace el dormido (duerme de mentira)","Duerme mucho","Va a dormir","No duerme"],e:"Oke = duerme · gua'u = de mentira.",s:"Modo aparencial"},
{id:"h14",b:"g4",q:"Según el cuaderno, ¿a qué hacen referencia las palabras **térava** (nominales)?",o:["Al nombre, al sustantivo (Hilario, ña Carmen, mitã)","A la acción","Al tiempo","A la cantidad"],e:"Téra = nombre. Ejemplos del cuaderno: Hilario, ña Carmen, mitã (niño).",s:"Cuaderno: Me informo (10/9)"},
{id:"h15",b:"g4",q:"En el caso aparece mucho **-kuri** (ojuhúkuri, oikékuri). ¿Qué indica?",o:["Que la acción ya pasó (pasado)","Que va a pasar (futuro)","Que son muchos (plural)","Que no pasó (negación)"],e:"-kuri marca pasado: ojuhúkuri = encontró.",s:"Mboriahu ryguatã káso"},
{id:"h16",b:"g4",q:"En el caso aparece **-kuéra** (ichupekuéra, hogayguakuéra). ¿Qué indica?",o:["Plural (muchos)","Pasado","Lugar","Negación"],e:"-kuéra hace plural: hogayguakuéra = los de su casa.",s:"Mboriahu ryguatã káso"},
{id:"h17",b:"g4",q:"¿Qué significa **«Ndaha'éi vyrorei»**?",o:["No es en vano (no es por nada)","Es muy lindo","No tengo miedo","Vamos rápido"],e:"Nd-…-i es negación: ndaha'éi = no es. Lo dice el curandero.",s:"Mboriahu ryguatã káso"},
/* ---------- Afiche, carta, CV y entrevista ---------- */
{id:"f1",b:"g5",q:"Mba'épa he'ise **marandu'anga**?",es:"¿Qué significa «marandu'anga»?",o:["Afiche, cartel","Carta","Entrevista","Currículum"],e:"Marandu = información, noticia. Se hace en papel grande, con imágenes.",s:"Cuaderno: Marandu'anga"},
{id:"f2",b:"g5",q:"¿Para qué sirve un **marandu'anga**?",o:["Para informar o hacer publicidad con imágenes y pocas palabras","Para contar la vida de una persona","Para pedir trabajo","Para escribirle a un amigo"],e:"Se usan imágenes para transmitir información útil o publicitaria, según la intención.",s:"Cuaderno: Marandu'anga"},
{id:"f3",b:"g5",q:"Mba'épa he'ise **kuatiañe'ẽ**?",es:"¿Qué significa «kuatiañe'ẽ»?",o:["Carta","Afiche","Diario","Cuaderno"],e:"Kuatia = papel · ñe'ẽ = palabra.",s:"Cuaderno: Kuatiañe'ẽ"},
{id:"f4",b:"g5",q:"En el sobre de la carta, ¿qué es la **tenda**?",o:["La dirección (el lugar)","El país","El nombre de quien la recibe","La fecha"],e:"En el sobre: Mávapa guarã (para quién), tenda (dirección), tetã ha táva (país y ciudad).",s:"Cuaderno: Kuatiañe'ẽ"},
{id:"f5",b:"g5",q:"En el sobre, **«Mávapa guarã»** es…",o:["Para quién es la carta","Quién la escribe","Dónde vive","Cuándo llega"],e:"Mávapa = quién · guarã = para.",s:"Cuaderno: Kuatiañe'ẽ"},
{id:"f6",b:"g5",q:"¿Con qué empieza la carta del cuaderno («Paraguarí, 22 jasypa 2014-pe»)?",o:["Con el lugar y la fecha","Con la firma","Con el saludo final","Con el nombre del sobre"],e:"Primero lugar y fecha, después para quién, el saludo, el cuerpo, la despedida y la firma.",s:"Cuaderno: Kuatiañe'ẽ"},
{id:"f7",b:"g5",q:"¿Qué mes es **jasypa**?",o:["Octubre","Diciembre","Enero","Mayo"],e:"Jasy = mes · pa = diez → mes 10.",s:"Cuaderno: Kuatiañe'ẽ"},
{id:"f8",b:"g5",q:"¿Qué mes es **jasypateĩ**?",o:["Noviembre","Octubre","Septiembre","Febrero"],e:"Jasy = mes · pa = diez · teĩ = uno → mes 11. Para fechar la carta del examen: «… jasypateĩ 2026-pe».",s:"Meses"},
{id:"f9",b:"g5",q:"¿Qué significa **«Karai marangatu»** al empezar una carta?",o:["Estimado señor","Querido amigo","Hasta luego","Gracias por todo"],e:"Karai = señor · marangatu = respetable, estimado. Para una señora: kuñakarai.",s:"Cuaderno: Kuatiañe'ẽ"},
{id:"f10",b:"g5",q:"¿Qué significa **Maitei** al final de la carta?",o:["Saludos (saludo cordial)","Te quiero","Firma","Respuesta"],e:"La carta del cuaderno termina «Maitei tory'pe» antes de la firma.",s:"Cuaderno: Kuatiañe'ẽ"},
{id:"f11",b:"g5",q:"Mba'épa he'ise **tekove arandupy**?",es:"¿Qué significa «tekove arandupy»?",o:["Currículum vitae","Entrevista","Biografía de un héroe","Carta de amor"],e:"Documento que cuenta los datos, estudios y trabajos de una persona para buscar empleo.",s:"Cuaderno: Tekove arandupy"},
{id:"f12",b:"g5",q:"En el currículum, ¿qué va en **«Mávapa che»**?",o:["Datos personales","Estudios","Experiencia laboral","Referencias"],e:"A. Mávapa che = datos personales · Ã. Arandupy = estudios · Ch. Che rembiapokue = experiencia · E. Tapicha techakuaáva = referencias.",s:"Cuaderno: Tekove arandupy"},
{id:"f13",b:"g5",q:"En el currículum, ¿qué es **Arandupy**?",o:["Estudios realizados","Datos personales","Trabajos","Personas que te conocen"],e:"Arandu = saber. Ahí van los estudios y certificados.",s:"Cuaderno: Tekove arandupy"},
{id:"f14",b:"g5",q:"En el currículum, ¿qué es **Che rembiapokue**?",o:["Experiencia laboral (trabajos anteriores)","Estudios","Datos personales","Referencias"],e:"Tembiapo = trabajo · -kue = lo que ya pasó.",s:"Cuaderno: Tekove arandupy"},
{id:"f15",b:"g5",q:"En el currículum, ¿qué es **Tapicha techakuaáva**?",o:["Referencias personales: personas que te conocen","Tus estudios","Tu dirección","Tu jefe actual"],e:"Personas que pueden contar cómo sos y cómo trabajás, con su teléfono (pumbyry).",s:"Cuaderno: Tekove arandupy"},
{id:"f16",b:"g5",q:"¿Qué es **terajoapy**?",o:["Apellido","Nombre","Nacionalidad","Teléfono"],e:"Terakuéra = nombres · terajoapy = apellido · pumbyry = teléfono.",s:"Cuaderno: Tekove arandupy"},
{id:"f17",b:"g5",q:"Mba'épa he'ise **ñe'ẽjovake**?",es:"¿Qué significa «ñe'ẽjovake»?",o:["Entrevista","Carta","Debate","Cuento"],e:"La usan los periodistas en la tele, la radio y el celular para saber lo que piensa otra persona.",s:"Cuaderno: Ñe'ẽjovake"},
{id:"f18",b:"g5",q:"¿Cuál es una regla para conversar bien en una entrevista?",o:["Escuchar al que habla y hablar de a uno","Hablar todos al mismo tiempo","Mover mucho los brazos","No dar nunca la opinión"],e:"Del cuaderno: ñahendu va'erã oñe'ẽvape (escuchar al que habla), ñañe'ẽ peteĩva'erã (hablar de a uno), ja'e avei ñane remimo'ã (decir nuestra opinión), sin mover demasiado brazos y boca.",s:"Cuaderno: Ñe'ẽjovake"},
{id:"f19",b:"g5",q:"En una entrevista, **«Moõpa reiko?»** pregunta…",o:["¿Dónde vivís?","¿Cómo te llamás?","¿Qué hacés?","¿Cuántos años tenés?"],e:"Moõpa = dónde · reiko = vivís. Respuesta: «Aiko Villarrica-pe».",s:"Cuaderno: Ñe'ẽjovake"},
{id:"h18",b:"g4",q:"¿Qué hacen las palabras **ombohetáva**?",o:["Hacen plural: indican que son muchos","Indican el tiempo","Indican el lugar","Niegan"],e:"Ombohetáva viene de heta = mucho. Plural con -kuéra (oral) o -nguéra (nasal): kavajukuéra (los caballos), mitãnguéra (los niños). Para decir «muchos»: -eta / -ita (yvotyeta = muchas flores).",s:"Clase de conectores (10/9) · ABC Color"},
{id:"h19",b:"g4",q:"¿Cuál de estas palabras está en **plural**?",o:["Mitãnguéra","Mitã","Mitãme","Mitãrã"],e:"-nguéra se usa después de un sonido nasal (mitã); -kuéra después de uno oral (kavajukuéra).",s:"Plural"},
{id:"h20",b:"g4",q:"En el caso aparece **«rogakue»** (Bernardino Caballero rogakue). ¿Qué indica **-kue**?",o:["Que ya no es, que fue (su antigua casa)","Que va a ser","Que son muchas","Que es grande"],e:"-kue = lo que fue: rogakue = su antigua casa. -rã = lo que va a ser: ogarã = futura casa. Son palabras de tiempo (ára).",s:"Káso póra rehegua"},
{id:"h21",b:"g4",q:"¿Qué indica **-rã** en «tembi'urã» (para comer)?",o:["Lo que va a ser, para el futuro","Lo que ya pasó","Plural","Negación"],e:"-rã = futuro, «para»: tembi'urã = lo que va a ser comida. -kue = pasado: rogakue = antigua casa.",s:"Mboriahu ryguatã káso"},
{id:"f20",b:"g5",q:"¿Qué significa **Aguyje**?",o:["Gracias","Perdón","Hola","Chau"],e:"Aguyje = gracias. Para despedirse: «Jajotopata peve» (hasta la próxima).",s:"Ñe'ẽjovake"},
/* ---------- Ñe'ẽpoty: Kangue rekyi (1.ª etapa, 23/6) ---------- */
{id:"p1",b:"g6",q:"Mávapa ohai ñe'ẽpoty «Kangue rekyi»?",es:"¿Quién escribió el poema «Kangue rekyi»?",o:["Félix Fernández","David Galeano Olivera","Mariscal López","Bernardino Caballero"],e:"Félix Fernández, poeta y músico de Itauguá. Ñe'ẽpoty = poesía.",s:"Cuaderno (23/6)"},
{id:"p2",b:"g6",q:"Mba'épa he'ise **ñe'ẽpoty**?",es:"¿Qué significa «ñe'ẽpoty»?",o:["Poesía, poema","Cuento","Carta","Entrevista"],e:"Ñe'ẽ = palabra · poty = flor: «palabra florida». El poeta es el ñe'ẽpapára.",s:"Cuaderno (23/6)"},
{id:"p3",b:"g6",q:"Mba'épa he'ise **ñe'ẽpapára**?",es:"¿Qué significa «ñe'ẽpapára»?",o:["Poeta","Soldado","Lector","Maestro"],e:"El que escribe poesía. Haihára = escritor, autor.",s:"Cuaderno (23/6)"},
{id:"p4",b:"g6",q:"¿A quién está dedicado el poema «Kangue rekyi»?",o:["Al Mariscal Francisco Solano López","A Bernardino Caballero","A una abuela","A un curandero"],e:"El poema homenajea al Mariscal López y recuerda la Guerra Grande, los veteranos y Cerro Corá.",s:"Portal Guaraní"},
{id:"p5",b:"g6",q:"Mba'épa ohechaukase haihára ko ñe'ẽpoty rupive?",es:"¿Qué quiere mostrar el autor con este poema?",o:["Quiere homenajear al Mariscal López","Quiere contar un caso de fantasmas","Quiere vender algo","Quiere explicar cómo escribir una carta"],e:"Respuesta del cuaderno: «Oipota oñemomba'e Mariscal López-pe» = quiere que se honre al Mariscal López.",s:"Cuaderno (23/6), ítem 3"},
{id:"p6",b:"g6",q:"Mávapa ojapo pe mba'e guasu oñemombe'úva ñe'ẽpotýpe?",es:"¿Quién hizo la gran cosa que se cuenta en el poema?",o:["Mariscal López, que llevó adelante la patria y peleó por amor a ella","El poeta Félix Fernández","El papá veterano del poeta","Los vecinos del pueblo"],e:"Respuesta del cuaderno: «Mariscal López omotenondéva tetã rekove ha oñorairõ tetã rayhupápe».",s:"Cuaderno (23/6), ítem 4"},
{id:"p7",b:"g6",q:"En el poema, ¿quién dice que la **sangre de López** (López ruguy) corre por su cuerpo (che retépe)?",o:["La voz del poema (el poeta), hijo de un veterano","El Mariscal López","Los enemigos","Una abuela"],e:"El que habla en primera persona («che» = yo) no es López: a López lo nombra. En la última estrofa le habla a su papá veterano («che Ru»). Ojo: en el cuaderno estaba marcado «Mariscal López».",s:"Cuaderno (23/6), ítem 2"},
{id:"p8",b:"g6",q:"Mba'épa he'ise **tatatĩna** ñe'ẽpotýpe?",es:"¿Qué significa «tatatĩna» en el poema?",o:["Ñemongyhyje (amenaza, miedo)","Yvytu (viento)","Tatarendy (llamarada)","Pytu'u (descanso)"],e:"Tatatĩ es humo. En el poema es algo que llega sobre nuestra tierra y hace daño: la amenaza de la guerra. Significado contextual: ñemongyhyje (lo que marcó Sofi).",s:"Cuaderno (23/6), ítem 1"},
{id:"p9",b:"g6",q:"Mba'épa he'ise **ruguy**?",es:"¿Qué significa «ruguy»?",o:["Sangre","Corazón","Patria","Cuerpo"],e:"Tuguy / ruguy = sangre. «López ruguy» = la sangre de López. «Che retépe» = en mi cuerpo.",s:"Kangue rekyi"},
{id:"p10",b:"g6",q:"En el poema, ¿a quién llama **«che Ru»**?",o:["A su papá, un veterano de guerra","Al Mariscal López","A Dios","Al poeta"],e:"Che ru = mi padre. Le habla a su padre veterano (que peleó en la guerra).",s:"Kangue rekyi"},
{id:"p11",b:"g6",q:"¿Qué es **Cerro Corá**, que nombra el poema?",o:["El lugar donde murió el Mariscal López al final de la Guerra Grande (1870)","Un cerro de Villarrica","La casa de Bernardino Caballero","Un pueblo de Brasil"],e:"Cerro Corá (Amambay): ahí terminó la Guerra Grande el 1 de marzo de 1870, con la muerte de López.",s:"Kangue rekyi"},
{id:"p12",b:"g6",q:"Mba'épa he'ise **tetã rayhupápe**?",es:"¿Qué significa «tetã rayhupápe»?",o:["Por amor a la patria","Lejos de la patria","Contra la patria","En la casa"],e:"Tetã = patria · mborayhu = amor. «Oñorairõ tetã rayhupápe» = peleó por amor a la patria.",s:"Cuaderno (23/6)"},
{id:"p13",b:"g6",q:"¿Qué es **oñorairõva'ekue**?",o:["El que peleó en la guerra (excombatiente)","El que escribe poemas","El que cura","El que vende"],e:"Ñorairõ = guerra, pelear · -va'ekue = el que (lo hizo en el pasado).",s:"Cuaderno (23/6)"},
{id:"p14",b:"g6",q:"¿Qué sentimiento busca despertar el poema?",o:["Amor y orgullo por la patria, y respeto por los que pelearon","Miedo a los fantasmas","Ganas de viajar","Risa"],e:"El ítem 5 pide contar cómo el poema despierta sentimientos (temiandu) y cosas lindas que sentimos por nuestro país.",s:"Cuaderno (23/6), ítem 5"}
  ],
  resumen:[
    {titulo:"Antes de empezar", notas:[
      {t:"Cómo leer una consigna", d:"Primero buscá el **verbo** (casi siempre empieza con A-: Amoñe'ẽ, Ahai, Ambohovái). Después mirá la **palabra de pregunta** (Mávapa, Mba'épa, Moõpa). Con esas dos ya sabés qué te piden."},
      {t:"Ojo: palabras parecidas", ojo:true, d:"**Porã** = lindo · **póra** = fantasma.\n**Oje'éva** = hecho · **oñeimo'ãva** = opinión.\n**Añetegua** = realidad · **añetegua'ỹ** = fantasía (-'ỹ = sin)."}]},
    {tema:"g1", notas:[
      {t:"Consignas del examen", html:`<table class="tabla">
        <tr><th>Guaraní</th><th>Castellano</th></tr>
        <tr><td>Amoñe'ẽ</td><td>Leo</td></tr><tr><td>Ahendu</td><td>Escucho</td></tr>
        <tr><td>Ambohovái</td><td>Contesto</td></tr><tr><td>Amyesakã</td><td>Aclaro, explico</td></tr>
        <tr><td>Aheka</td><td>Busco</td></tr><tr><td>Ahai</td><td>Escribo</td></tr>
        <tr><td>Amombe'u</td><td>Cuento</td></tr><tr><td>Amba'apo</td><td>Trabajo</td></tr>
        <tr><td>Mbo'epy</td><td>Tema</td></tr><tr><td>Tembiaporã</td><td>Tarea</td></tr>
        <tr><td>Reikuaa hag̃ua</td><td>Para saber</td></tr><tr><td>Jehaipyre</td><td>Texto</td></tr>
        <tr><td>Porandu</td><td>Pregunta</td></tr><tr><td>Che remimo'ã</td><td>Mi opinión</td></tr></table>`},
      {t:"Palabras para preguntar", html:`<table class="tabla">
        <tr><th>Guaraní</th><th>Pregunta</th><th>Ejemplo</th></tr>
        <tr><td>Mávapa</td><td>¿Quién?</td><td>Mávapa oñe'ẽ? (¿Quién habla?)</td></tr>
        <tr><td>Mba'épa</td><td>¿Qué?</td><td>Mba'épa ojehu? (¿Qué pasó?)</td></tr>
        <tr><td>Moõpa</td><td>¿Dónde?</td><td>Moõpa reiko? (¿Dónde vivís?)</td></tr>
        <tr><td>Araka'épa</td><td>¿Cuándo?</td><td></td></tr>
        <tr><td>Mba'érepa</td><td>¿Por qué?</td><td></td></tr>
        <tr><td>Mba'éichapa</td><td>¿Cómo?</td><td>Mba'éichapa nde réra? (¿Cómo te llamás?)</td></tr>
        <tr><td>Mbovýpa</td><td>¿Cuántos?</td><td>Mbovýpa mitã? (¿Cuántos niños?)</td></tr></table>`},
      {t:"Para contestar", d:"Copiá la pregunta sin la palabra de pregunta y agregá el dato.\nMoõpa oiko? → **Oiko Itakyrýpe.** (Vive en Itakyry.)\nMávapa oñe'ẽ? → **Oñe'ẽ Hilario.** (Habla Hilario.)"}]},
    {tema:"g2", notas:[
      {t:"Qué es un káso ñemombe'u", d:"Un relato de algo que la gente cuenta que pasó de verdad. Se transmite de boca en boca y mezcla hechos con creencias: fantasmas (póra), tesoros enterrados (plata yvyguy), daños (mba'e vai)."},
      {t:"Mboriahu ryguatã káso (David Galeano Olivera)", d:"**Título:** El caso del pobre satisfecho.\n1. Hilario y su esposa ña Carmen viven en **Itakyry** con 4 hijos. Son pobres pero felices; cultivan algodón y maní para vender.\n2. Un día encuentran **sal esparcida** alrededor de la casa. Desde ahí todo sale mal: ña Carmen se enferma y sus vacas aparecen rasguñadas y mueren.\n3. Un **curandero** (pohãnohára) les dice que les están haciendo daño y que se vayan: si se van, pueden salir adelante.\n4. Se mudan a **Karaguatay**. Empiezan de cero, durmiendo en el suelo.\n5. Varias noches ven una **carreta vacía** que desaparece frente a un cocotero viejo.\n6. Cavan al pie del cocotero y encuentran **plata yvyguy** (un tesoro). No le cuentan a nadie.\n7. Hilario lo vende en Brasil y compra una casa grande en Paraguay.\n**Moraleja:** «Mba'e vai rire, mba'e porã manteva'erã» = después de lo malo, siempre viene lo bueno."},
      {t:"Caso de fantasmas de la clase (Póra rehegua)", d:"La gente que vive alrededor del **Parque Caballero** cuenta que, en los días feos, sale alguien a caballo que con voz fuerte da órdenes a los soldados. Muchas veces el caballo **no tiene cabeza** (naiñakãi) y camina frente a la antigua casa de Bernardino Caballero. Dicen que pasa lo mismo en el **Jardín Botánico**, en la antigua casa del Mariscal López."},
      {t:"Preguntas que siempre toman", d:"Mávapa oñe'ẽ? (¿Quién habla?) · Mba'épa ojehu? (¿Qué pasó?) · Moõpa? (¿Dónde?) · Mba'épa he'i pohãnohára? (¿Qué dijo el curandero?) · «Ko mombe'úpe oñe'ẽ paraguaigua ogueroviaváre» (En este relato se habla de las creencias del paraguayo: ¿a qué se refiere?)"}]},
    {tema:"g3", notas:[
      {t:"Palabras del caso de fantasmas", html:`<table class="tabla">
        <tr><th>Guaraní</th><th>Castellano</th></tr>
        <tr><td>Jaryi</td><td>Abuela</td></tr><tr><td>Tetã rembiguái</td><td>Soldado</td></tr>
        <tr><td>Ñe'ẽ pohýi</td><td>Palabra pesada, voz fuerte</td></tr><tr><td>Ñanihápe</td><td>Corriendo, al trote</td></tr>
        <tr><td>Naiñakãi</td><td>Sin cabeza</td></tr><tr><td>Póra</td><td>Fantasma</td></tr></table>`},
      {t:"Palabras de Mboriahu ryguatã káso", html:`<table class="tabla">
        <tr><th>Guaraní</th><th>Castellano</th></tr>
        <tr><td>Ohepyme'ẽ</td><td>Vende</td></tr><tr><td>Oñekarãi</td><td>Se rasguñó</td></tr>
        <tr><td>Mba'e vai</td><td>Desgracia, daño</td></tr><tr><td>Ñemoñare</td><td>Descendencia</td></tr>
        <tr><td>Jo'oha</td><td>Pala</td></tr><tr><td>Ñakãrapu'ã</td><td>Triunfo, salir adelante</td></tr>
        <tr><td>Hembireko</td><td>Su esposa</td></tr><tr><td>Pohãnohára</td><td>Curandero</td></tr>
        <tr><td>Juky</td><td>Sal</td></tr><tr><td>Mandyju · manduvi</td><td>Algodón · maní</td></tr>
        <tr><td>Kokue</td><td>Chacra</td></tr><tr><td>Mbokaja tuja</td><td>Cocotero viejo</td></tr>
        <tr><td>Plata yvyguy</td><td>Tesoro enterrado</td></tr><tr><td>Ñorairõ Guasu</td><td>Guerra Grande</td></tr>
        <tr><td>Ka'arupytũ</td><td>Anochecer</td></tr></table>`},
      {t:"Truco: partes que se repiten", d:"**-pe** = en (Itakyrýpe = en Itakyry) · **-kuéra** = plural · **-kuri** = pasado · **-hára** = el que hace (pohãnohára = el que cura) · **-'ỹ** = sin · **nd-…-i** = no (ndaha'éi = no es)."}]},
    {tema:"g4", notas:[
      {t:"Hecho y opinión", d:"**Oje'éva** (hecho): algo que pasó y se puede comprobar. «Hilario ha ña Carmen oikova'ekue Itakyrýpe.»\n**Oñeimo'ãva** (opinión): lo que alguien piensa. Marcas: **Chéve guarã** (para mí), **Che aimo'ã** (yo creo). «Chéve guarã umi káso iporã.»"},
      {t:"Realidad y fantasía", d:"**Añetegua** (realidad): puede pasar de verdad. Hilario fue a Brasil a vender.\n**Añetegua'ỹ** (fantasía): no puede pasar. Una carreta que desaparece, un caballo sin cabeza."},
      {t:"Modos (según el cuaderno)", d:"**Aparencial:** la acción es fingida o de mentira → **gua'u**. «Oke gua'u» = se hace el dormido.\n**Intencional:** muestra la intención → **mo'ã**. «Ahupytymo'ã» = iba a alcanzar.\n**Apelativo:** → **nga'u**."},
      {t:"Térava (nominales)", d:"Palabras que nombran: el sustantivo. Ejemplos del cuaderno: Hilario, ña Carmen, mitã."},
      {t:"Ombohetáva (plural)", d:"heta = mucho. **-kuéra** después de sonido oral: kavajukuéra (los caballos), hogayguakuéra. **-nguéra** después de sonido nasal: mitãnguéra (los niños).\nPara decir «muchos»: **-eta / -ita**: yvotyeta (muchas flores), mymbaita (muchos animales)."},
      {t:"Ára (tiempo)", d:"**-kuri** = pasó hace poco: ojuhúkuri (encontró).\n**-va'ekue** = pasó: oikova'ekue (vivían).\n**-kue** = lo que fue: rogakue (su antigua casa).\n**-rã** = lo que va a ser, para: tembi'urã (para comer)."},
      {t:"Ojo", ojo:true, d:"**Tenondegua** también estaba en la consigna, pero su explicación no está en las fotos del cuaderno. Preguntale a la profe o a una compañera qué anotaron."}]},
    {tema:"g5", notas:[
      {t:"Marandu'anga (afiche)", d:"Se hace en papel grande, con **imágenes y pocas palabras**, para informar o hacer publicidad.\nPartes: título llamativo · imagen · mensaje corto · datos (quién, dónde, cuándo).\nEjemplos del cuaderno: «Sapatu porã» (zapatos lindos), «Karu Porã · Ña Chela», «Paraguái ojejapova'ekue» (hecho en Paraguay)."},
      {t:"Kuatiañe'ẽ (carta)", d:"**Sobre:** Mávapa guarã (para quién) · tenda (dirección) · tetã ha táva (país y ciudad).\n**Carta:**\n1. Lugar y fecha: «Paraguarí, 22 jasypa 2014-pe»\n2. Para quién: «Karai Kalo Báez, Mbo'ehao Carlos Antonio López sãmbyhyhára»\n3. Saludo: «Karai marangatu» (Estimado señor)\n4. Cuerpo: «Ahai ndéve ko kuatiañe'ẽ…» (Te escribo esta carta…)\n5. Despedida: «Maitei» (Saludos)\n6. Firma"},
      {t:"Meses", html:`<table class="tabla">
        <tr><td>Jasyteĩ</td><td>enero</td><td>Jasypoteĩ</td><td>junio</td></tr>
        <tr><td>Jasykõi</td><td>febrero</td><td>Jasypokõi</td><td>julio</td></tr>
        <tr><td>Jasyapy</td><td>marzo</td><td>Jasypoapy</td><td>agosto</td></tr>
        <tr><td>Jasyrundy</td><td>abril</td><td>Jasyporundy</td><td>septiembre</td></tr>
        <tr><td>Jasypo</td><td>mayo</td><td>Jasypa</td><td>octubre</td></tr>
        <tr><td></td><td></td><td>Jasypateĩ</td><td>noviembre</td></tr>
        <tr><td></td><td></td><td>Jasypakõi</td><td>diciembre</td></tr></table>`},
      {t:"Tekove arandupy (currículum)", d:"**A. Mávapa che** (datos personales): terakuéra (nombres), terajoapy (apellido), che retã (nacionalidad), óga renda (domicilio), pumbyry (teléfono).\n**Ã. Arandupy** (estudios): tekombo'e ñepyrũ (primaria), tekombo'e mokõiha (secundaria).\n**Ch. Che rembiapokue** (experiencia laboral).\n**E. Tapicha techakuaáva** (referencias personales)."},
      {t:"Ñe'ẽjovake (entrevista)", d:"La usan los periodistas en la tele, la radio y el celular para saber lo que otro piensa.\n**Para conversar bien:** escuchar al que habla (ñahendu va'erã oñe'ẽvape) · hablar de a uno (ñañe'ẽ peteĩva'erã) · decir nuestra opinión (ja'e avei ñane remimo'ã) · no mover demasiado brazos y boca.\n**Frases:** Mba'éichapa? (¿Cómo estás?) · Iporã, ha nde? (Bien, ¿y vos?) · Mba'éichapa nde réra? · Che réra… · Moõpa reiko? · Aiko…-pe · Aguyje (gracias) · Jajotopata peve (hasta la próxima)."}]},
    {tema:"g6", notas:[
      {t:"Kangue rekyi (Félix Fernández)", d:"**Ñe'ẽpoty** = poesía · **ñe'ẽpapára** = poeta · **haihára** = autor.\nEs un poema de homenaje al **Mariscal Francisco Solano López**. Recuerda la Guerra Grande, a los que pelearon (oñorairõva'ekue) y **Cerro Corá**, donde murió López en 1870."},
      {t:"Lo que dice, estrofa por estrofa", d:"1. Algo llega sobre nuestra tierra (ñande ári) y trae daño al país: la guerra.\n2. Nombra a un jefe (mburuvicha) y pide que se recuerde al Mariscal; el dolor se siente en Paraguay.\n3. La voz del poema (yo, «che») dice que no le alcanzan las palabras para su dolor, y que la sangre de López (López ruguy) corre por su cuerpo (che retépe).\n4. Le habla a su papá veterano («che Ru, Veterano») y termina nombrando Cerro Corá."},
      {t:"Respuestas del cuaderno (23/6)", d:"1. Tatatĩna (contexto) → **ñemongyhyje**, la amenaza (tatatĩ = humo).\n2. ¿Quién dice que la sangre de López corre por su cuerpo? → la **voz del poema**, el hijo de un veterano (no es López: a López lo nombra).\n3. ¿Qué quiere mostrar? → **homenajear al Mariscal López**.\n4. ¿Quién hizo la gran cosa? → **Mariscal López**, que llevó adelante la patria y peleó por amor a ella (tetã rayhupápe).\n5. Tu respuesta: «Félix Fernández omombe'u Mariscal López rekove ha hembiapokue: oñorairõ hague tetã rayhupápe ha omotenonde hague Paraguái.»"},
      {t:"Ojo", ojo:true, d:"En el ítem 2 del cuaderno estaba marcado «Mariscal López», pero en el poema el que habla es el hijo de un veterano. Si en el examen preguntan quién habla, mirá quién dice «che» (yo)."}]}
  ],
  textosSub:"los casos de la clase y tu entrevista",
  textos:[
    {id:"mboriahu", titulo:"Mboriahu ryguatã káso", autor:"David Galeano Olivera",
     intro:"El texto completo está publicado en la página del autor. Abrilo con el botón, y leelo con la guía de abajo al lado. También podés guardar las fotos de tu fotocopia.",
     enlace:"https://dgaleanolivera.wordpress.com/kaso-nemombeu-mboriahu-ryguata-kaso/", enlaceNom:"Leer el texto completo (página del autor)",
     partes:[
      {t:"1. Al principio, en Itakyry", d:"Hilario y su esposa ña Carmen viven en Itakyry y trabajan en su chacra. Cultivan algodón y maní para vender, y mandioca, maíz y otras cosas para comer. Tienen cuatro hijos: dos varones y dos mujeres, que van a la escuela. Son pobres pero viven bien (por eso el título: «pobre satisfecho») y la gente los quiere."},
      {t:"2. La envidia", d:"En la vida hay cosas buenas y malas. Mucha gente quería a la familia, pero otros les tenían envidia."},
      {t:"3. La sal", d:"Un día encuentran **sal esparcida** alrededor de la casa. La barren, pero vuelve a aparecer. Se asustan, rezan y le echan agua bendita. Ña Carmen la junta en una bolsa y de noche la entierra lejos, hacia el oeste."},
      {t:"4. Todo sale mal", d:"Desde ese día nada les sale bien. Ña Carmen se enferma mucho. Hilario encuentra cuatro vacas rasguñadas y sangrando, que después mueren. Los gusanos se comen su algodonal."},
      {t:"5. El curandero", d:"Un **pohãnohára** (curandero) les dice: «Les están haciendo daño (mba'e vai), no es por nada. Yo no los puedo curar. Si quieren su vida y la de sus hijos, váyanse rápido. Si se quedan pueden morir; si se van, pueden volver a salir adelante»."},
      {t:"6. A Karaguatay", d:"Juntan sus cositas y se van de Itakyry a **Karaguatay**. Hacen una casita y sufren mucho: duermen y comen en el suelo. Hilario y su hijo mayor trabajan en un algodonal. Poco a poco consiguen cama, silla y mesa."},
      {t:"7. La carreta", d:"Una noche, tomando mate y charlando, ven pasar una **carreta vacía** que se acerca a un **cocotero viejo** (mbokaja tuja) cerca de la casa y desaparece. Se acuerdan de lo que contaban los viejos: Karaguatay fue lugar de paso de la **Guerra Grande** y a veces se encuentra plata yvyguy."},
      {t:"8. El tesoro", d:"La carreta aparece tres noches. Hilario sospecha que es plata yvyguy. Al cuarto día no va a trabajar: con su esposa y su hijo mayor llevan una **pala** y cavan al pie del cocotero. Encuentran un baúl con algo que brilla: era la **plata yvyguy**. Se alegran mucho, pero no le cuentan a nadie."},
      {t:"9. El final", d:"Tres días después Hilario lo vende en **Brasil**, le pagan mucho y compra una casa grande en Paraguay, donde vive hasta hoy y sigue trabajando. Se cumplió lo que dijo el curandero: si se iban, podían salir adelante.\n**«Mba'e vai rire, mba'e porã manteva'erã»** = después de lo malo, siempre viene lo bueno."}],
     glosario:[["Itakyry","pueblo donde vivían al principio"],["ñepyrũrãme","al principio"],["omba'apo","trabajan"],["ikokuépe","en su chacra"],["mandyju · manduvi","algodón · maní"],
       ["ohepyme'ẽ hag̃ua","para vender"],["tembi'urã","para comer"],["mandi'o · avati","mandioca · maíz"],["mboriahu ryguatã","pobre satisfecho"],["hembireko","su esposa"],
       ["irundy mitã","cuatro hijos"],["mokõi kuimba'e · mokõi kuña","dos varones · dos mujeres"],["mbo'ehao","escuela"],["tekove marangatu · tekove ñaña","vida buena · vida mala"],
       ["ohayhu · ohayhu'ỹ","quieren · no quieren (envidian)"],["peteĩ ko'ẽ","una mañana, un día"],["juky","sal"],["hóga jerere","alrededor de su casa"],["ykaraipyre","agua bendita"],
       ["ka'arupytũ","noche"],["kuarahy reike","oeste (donde se pone el sol)"],["hasykatu","muy enferma"],["vaka oñekarãi","vacas rasguñadas"],["mba'eve","nada"],
       ["pohãnohára","curandero"],["mba'e vai","daño, desgracia"],["ndaha'éi vyrorei","no es por nada"],["ñemoñare","descendencia"],["pya'e","rápido"],["Karaguatay","Caraguatay, el pueblo nuevo"],
       ["yvýpe","en el suelo"],["mbeguekatúpe","poco a poco"],["tupa · apyka · mesa","cama · silla · mesa"],["karréta nandi","carreta vacía"],["mbokaja tuja","cocotero viejo"],
       ["Ñorairõ Guasu","la Guerra Grande"],["plata yvyguy","tesoro enterrado"],["mbohapy ára","tres días"],["jo'oha · ojo'o","pala · cava"],["karameguã","baúl"],
       ["omimbipáva","que brillaba"],["ohepyme'ẽkuri","lo vendió"],["ñakãrapu'ã","salir adelante, triunfo"]]},
    {id:"pora", titulo:"Káso póra rehegua (Parque Caballero)", autor:"Fotocopia de la clase del 8/7",
     intro:"Es un recuadro de la fotocopia «Ahendu ko káso». Guardá abajo la foto de tu fotocopia para leerla cuando quieras.",
     partes:[
      {t:"Qué cuenta", d:"Alguien dice que va a contar un caso de fantasmas que le contaron su papá o su abuela.\nLa gente que vive alrededor del **Parque Caballero** (Asunción) cuenta que en los días feos sale alguien **a caballo** que, con **voz fuerte**, da órdenes a los soldados. Pasa corriendo por ahí.\nMuchas veces el caballo **no tiene cabeza** y camina frente a la antigua casa de **Bernardino Caballero**.\nDicen que casos así pasan también en el **Jardín Botánico**, en la antigua casa del **Mariscal Francisco Solano López**."},
      {t:"Tu opinión (del cuaderno)", d:"«Chéve guarã umi káso ñemombe'u iporã ñanerekombo'égui. Umíva rupi jaikuaa ñande rapo ha ñande arandu ka'aty.»\nPara mí los casos son lindos porque nos enseñan. Por ellos conocemos nuestras raíces y nuestra sabiduría popular."}],
     glosario:[["ehendumína","escuchá, por favor"],["póra rehegua","sobre fantasmas"],["nde taita térã nde jaryi","tu papá o tu abuela"],["tapicha oikóva","la gente que vive"],["jerére","alrededor"],
       ["omombe'u","cuentan"],["ára ivaietéva","días muy feos"],["kavaju ári","a caballo"],["ñe'ẽ pohýi","voz fuerte, palabra pesada"],["ojokuái","manda, da órdenes"],
       ["tetã rembiguái","soldados"],["ñanihápe","corriendo, al trote"],["naiñakãi","sin cabeza"],["rogakue","su antigua casa"],["oje'e","se dice"]]},
    {id:"kangue", titulo:"Kangue rekyi (poema)", autor:"Félix Fernández · 1.ª etapa (23/6)",
     intro:"El poema completo está publicado en Portal Guaraní, junto con otros del autor. Buscá «Kangue rekyi» en esa página.",
     enlace:"https://portalguarani.com/772_felix_fernandez/13822_poesias_en_guarani_de_felix_fernandez.html", enlaceNom:"Leer el poema (Portal Guaraní)",
     partes:[
      {t:"De qué se trata", d:"Un homenaje al **Mariscal Francisco Solano López** y a los que pelearon en la Guerra Grande."},
      {t:"Estrofa 1", d:"Algo llega sobre nuestra tierra (ñande ári) y trae daño al país. Ahí aparece **tatatĩna** (humo): la amenaza de la guerra."},
      {t:"Estrofa 2", d:"Nombra a un jefe (mburuvicha) y pide que se recuerde al Mariscal. El dolor se siente en todo Paraguay."},
      {t:"Estrofa 3", d:"La voz del poema habla en primera persona (che): no le alcanzan las palabras para su dolor, y la **sangre de López** (López ruguy) corre por su cuerpo (che retépe)."},
      {t:"Estrofa 4", d:"Le habla a su **papá veterano** (che Ru) y termina nombrando **Cerro Corá**, donde murió López."}],
     glosario:[["kangue","hueso, huesos"],["ñe'ẽpoty","poesía"],["ñe'ẽpapára","poeta"],["haihára","autor"],["ñande ári","sobre nosotros, sobre nuestra tierra"],["tatatĩna","humo (en el poema: amenaza)"],
       ["tetã","patria, país"],["mburuvicha","jefe, líder"],["py'a","corazón, pecho"],["ruguy","sangre"],["che retépe","en mi cuerpo"],["oñani","corre"],
       ["che ru","mi papá"],["oñorairõva'ekue","el que peleó en la guerra"],["tetã rayhupápe","por amor a la patria"],["omotenonde","llevó adelante"],["Cerro Corá","lugar donde murió López (1870)"]]},
    {id:"entrevista", titulo:"Mi entrevista (1/10)", autor:"Sofi y Tamara, del cuaderno",
     intro:"Es tu entrevista, un poco ordenada, con la traducción de cada línea. Sirve de modelo para el examen.",
     lineas:[["— Mba'éichapa?","— ¿Cómo estás?"],["— Iporãnte, ha nde?","— Bien nomás, ¿y vos?"],["— Che aime porã avei.","— Yo también estoy bien."],
       ["— Aikuaase mba'éichapa nde réra.","— Quiero saber cómo te llamás."],["— Che réra Tamara, che terajoapy Melgarejo. Ha nde?","— Me llamo Tamara, mi apellido es Melgarejo. ¿Y vos?"],
       ["— Iporã, Tamara. Che réra Sofía.","— Qué bien, Tamara. Yo me llamo Sofía."],["— Moõpa reiko?","— ¿Dónde vivís?"],["— Aiko Villarrica-pe, ha nde?","— Vivo en Villarrica, ¿y vos?"],
       ["— Mba'épa rejapo?","— ¿Qué hacés?"],["— Apurahéi ha ambopu árpa.","— Canto y toco el arpa."],["— Ndevaletepiko!","— ¡Qué capa sos!"],
       ["— Mba'épe remba'apo?","— ¿En qué trabajás?"],["— Amba'apo oficina-pe, ha nde?","— Trabajo en una oficina, ¿y vos?"],
       ["— Che ambopumimi mbaraka.","— Yo toco un poquito la guitarra."],["— Nde vale!","— ¡Sos una capa!"],["— Ne'ĩ, jajotopata peve.","— Bueno, hasta la próxima."],["— Ne'ĩ, upéichaite.","— Bueno, así es."]]}
  ],
  ejercicios:{titulo:"Tarjetas y escritura", sub:"palabras, traducir, leer y escribir",
    ayuda:"Pensá la respuesta (o escribila en el cuaderno) antes de mirar. Después tocá para ver la ayuda y la respuesta, y marcá si la sabías.",
    papel:"Pensá o escribí la respuesta antes de mirar.",
    aMedias:"entendiste la idea, pero te faltaron palabras o partes.",
    tipos:[
      {id:"palabra", nom:"Tarjetas de palabras", sub:"guaraní → castellano", gen:()=>{ const [g,es,ej]=al(PALABRAS);
        return {t:"Tarjeta", q:`¿Qué significa **${g}**?`, p: ej?[["Pista", ej]]:[], r:`**${g}** = ${es}`}; }},
      {id:"consigna", nom:"Entender la consigna", sub:"lo que te piden en el examen", gen:()=>{ const [g,es,pal]=al(CONSIGNAS);
        return {t:"Consigna", q:`¿Qué te pide?\n**${g}**`, p:[["Palabra por palabra", pal]], r:es}; }},
      {id:"traducir", nom:"Traducir frases", sub:"de los casos y de la entrevista", gen:()=>{ const [g,es,pal]=al(FRASES);
        return {t:"Traducí al castellano", q:`**${g}**`, p:[["Palabra por palabra", pal]], r:es}; }},
      {id:"leer", nom:"Leer y contestar", sub:"Mávapa, Mba'épa, Moõpa", gen:()=>{ const x=al(LECTURAS);
        return {t:x.t, q:`${x.txt}\n\n**${x.q}**\n(${x.es})`, p:x.p, r:x.r}; }},
      {id:"escribir", nom:"Escribir", sub:"carta, afiche, entrevista, CV, opinión y caso", gen:()=>{ const x=al(ESCRIBIR);
        return {t:x.t, q:x.q, p:x.p, r:x.r}; }}
    ]},
  simulacro:{porTema:2, problemas:[["leer"],["consigna","traducir"],["escribir"]]}
};
})();

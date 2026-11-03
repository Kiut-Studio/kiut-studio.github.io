/**
 * Progreso de Dina Estudia (Física 1, Biología, Historia, Orientación…) en una hoja de Google Sheets.
 * Todas las materias usan esta misma hoja; la última columna de cada pestaña dice la materia.
 * Se pega en Extensiones → Apps Script de una hoja nueva
 * y se implementa como "Aplicación web" (ver README).
 *
 * Pestañas que crea solo:
 *  - Partidas:   una fila por partida terminada (tema, aciertos, porcentaje).
 *  - Respuestas: una fila por pregunta respondida (bien o mal, qué eligió, segundos).
 *  - Ejercicios: una fila cada vez que marca un ejercicio en papel (Sí / Más o menos / No),
 *                con el enunciado y la respuesta (sirve para los de números nuevos).
 *  - Simulacros: una fila por simulacro terminado (nota, teoría, cada problema, tiempo).
 *  - Exámenes:   una fila cada vez que Sofi marca un examen como rendido o le cambia la fecha (calendario del hub).
 *  - Respaldo:   la copia en la nube del progreso de cada materia (una fila por materia). La app la baja al abrirse
 *                y la une con lo del teléfono, así no se pierde nada si se borran los datos o se cambia de teléfono.
 *                No hace falta tocarla: el texto está partido en varias celdas porque es largo.
 *  - Respaldo anterior: una copia por día de cada materia, por si alguna vez hay que volver atrás.
 *
 * Al cambiar este código: Implementar → Administrar implementaciones → ✏️ → Versión: Nueva versión
 * → Implementar. Así la URL /exec sigue siendo la misma.
 */
const PESTANAS = {
  Partidas: ['fecha', 'nombre', 'modo', 'repaso de falladas', 'aciertos', 'total', '%', 'materia'],
  Respuestas: ['fecha', 'nombre', 'modo', 'tema', 'id', 'pregunta', 'resultado', 'eligió', 'correcta', 'segundos', 'materia'],
  Ejercicios: ['fecha', 'nombre', 'nivel', 'id', 'ejercicio', '¿le salió?', 'enunciado', 'respuesta', 'materia'],
  Simulacros: ['fecha', 'nombre', 'nota (de 100)', 'teoría', 'puntos teoría (de 40)', 'problema 1', 'puntos 1', 'problema 2', 'puntos 2',
               'problema 3', 'puntos 3', 'minutos elegidos', 'minutos usados', '¿se acabó el tiempo?', 'materia'],
  Exámenes: ['fecha', 'nombre', 'materia', 'fecha del examen', 'estado'],
};

function hoja_(nombre) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let h = ss.getSheetByName(nombre);
  if (!h) {
    h = ss.insertSheet(nombre);
    h.appendRow(PESTANAS[nombre]);
    h.setFrozenRows(1);
    h.getRange(1, 1, 1, PESTANAS[nombre].length).setFontWeight('bold');
  } else if (h.getLastColumn() < PESTANAS[nombre].length) {
    // pestaña creada con una versión anterior: se agregan los títulos de las columnas nuevas
    h.getRange(1, 1, 1, PESTANAS[nombre].length).setValues([PESTANAS[nombre]]).setFontWeight('bold');
  }
  return h;
}

/** Texto seguro: sin fórmulas ni textos larguísimos. */
function txt_(s, max) {
  return String(s == null ? '' : s)
    .replace(/^[=+\-@\s]+/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max || 200);
}
function num_(v, max) {
  const n = Math.floor(Number(v) || 0);
  return Math.max(0, Math.min(max, n));
}
function fecha_(iso) {
  const d = new Date(iso);
  return isNaN(d) ? new Date() : d;
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let d = {};
  try { d = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) {}
  const nombre = txt_(d.nombre, 16) || 'Sofi';
  const cuando = fecha_(d.cuando);
  const materia = txt_(d.materia, 40) || 'Física 1'; // Física 1 no manda materia
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    if (d.tipo === 'partida') {
      const total = num_(d.total, 50), ok = num_(d.aciertos, 50);
      const modo = txt_(d.modo, 40);
      hoja_('Partidas').appendRow([cuando, nombre, modo, d.repaso ? 'sí' : '', ok, total, total ? ok / total : 0, materia]);
      const filas = (Array.isArray(d.respuestas) ? d.respuestas : []).slice(0, 50).map(r => [
        cuando, nombre, modo, txt_(r.tema, 40), txt_(r.id, 10), txt_(r.pregunta),
        r.bien ? '✓ bien' : '✗ mal', txt_(r.elegida), txt_(r.correcta), num_(r.seg, 3600), materia,
      ]);
      if (filas.length) {
        const h = hoja_('Respuestas');
        h.getRange(h.getLastRow() + 1, 1, filas.length, filas[0].length).setValues(filas);
      }
      return json_({ ok: true });
    }
    if (d.tipo === 'ejercicio') {
      hoja_('Ejercicios').appendRow([cuando, nombre, txt_(d.nivel, 40), txt_(d.id, 10), txt_(d.ejercicio, 80), txt_(d.resultado, 20),
        txt_(d.enunciado, 400), txt_(d.respuesta, 300), materia]);
      return json_({ ok: true });
    }
    if (d.tipo === 'simulacro') {
      const pr = (Array.isArray(d.problemas) ? d.problemas : []).slice(0, 3);
      const celdas = [];
      for (let i = 0; i < 3; i++) celdas.push(pr[i] ? txt_(pr[i].ejercicio, 80) : '', pr[i] ? num_(pr[i].puntos, 20) : '');
      hoja_('Simulacros').appendRow([cuando, nombre, num_(d.nota, 100), txt_(d.teoria, 20), num_(d.puntosTeoria, 40)]
        .concat(celdas, [num_(d.minutos, 180), num_(d.usados, 600), d.seAcabo ? 'sí' : '', materia]));
      return json_({ ok: true });
    }
    if (d.tipo === 'respaldo') {
      return json_(guardarRespaldo_(d));
    }
    if (d.tipo === 'examen') {
      // desde el calendario del hub: rendido, pendiente o fecha nueva
      hoja_('Exámenes').appendRow([cuando, nombre, materia, txt_(d.fechaExamen, 12), txt_(d.estado, 20)]);
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'tipo desconocido' });
  } finally {
    lock.releaseLock();
  }
}

/* =====================  RESPALDO (copia en la nube)  ===================== */
const RESPALDO = ['perfil', 'clave', 'materia', 'actualizado', 'caracteres'];
const PARTE = 45000;            // una celda admite hasta 50 000 caracteres
const perfilOk_ = p => /^[a-z0-9-]{2,30}$/.test(String(p || ''));
const claveOk_ = c => /^dina[A-Za-z]+\.v\d+$/.test(String(c || ''));

function hojaRespaldo_(nombre) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let h = ss.getSheetByName(nombre);
  if (!h) {
    h = ss.insertSheet(nombre);
    h.appendRow(RESPALDO.concat(['datos (parte 1)']));
    h.setFrozenRows(1);
    h.getRange(1, 1, 1, RESPALDO.length + 1).setFontWeight('bold');
  }
  return h;
}

function guardarRespaldo_(d) {
  const perfil = String(d.perfil || ''), clave = String(d.clave || ''), texto = String(d.datos || '');
  if (!perfilOk_(perfil) || !claveOk_(clave) || texto.length < 2 || texto.length > 900000) return { ok: false, error: 'respaldo inválido' };
  let obj;
  try { obj = JSON.parse(texto); } catch (err) { return { ok: false, error: 'respaldo inválido' }; }
  // cada parte empieza con "~" para que la hoja nunca la tome como número o fórmula
  const partes = [];
  for (let i = 0; i < texto.length; i += PARTE) partes.push('~' + texto.slice(i, i + PARTE));
  const fila = [perfil, clave, txt_(obj.materia, 40), new Date(), texto.length].concat(partes);
  const h = hojaRespaldo_('Respaldo');
  const filas = h.getLastRow() > 1 ? h.getRange(2, 1, h.getLastRow() - 1, 2).getValues() : [];
  const i = filas.findIndex(f => f[0] === perfil && f[1] === clave);
  if (i < 0) {
    h.getRange(h.getLastRow() + 1, 1, 1, fila.length).setValues([fila]);
  } else {
    const n = i + 2, ancho = h.getLastColumn();
    const vieja = h.getRange(n, 1, 1, ancho).getValues()[0];
    // una copia por día en "Respaldo anterior"
    const antes = vieja[3] instanceof Date ? vieja[3] : null;
    if (antes && Utilities.formatDate(antes, 'America/Asuncion', 'yyyy-MM-dd') !== Utilities.formatDate(new Date(), 'America/Asuncion', 'yyyy-MM-dd')) {
      const ant = hojaRespaldo_('Respaldo anterior');
      const usada = vieja.filter((v, k) => k < 5 || v !== '');
      ant.getRange(ant.getLastRow() + 1, 1, 1, usada.length).setValues([usada]);
    }
    if (ancho > fila.length) h.getRange(n, fila.length + 1, 1, ancho - fila.length).clearContent();
    h.getRange(n, 1, 1, fila.length).setValues([fila]);
  }
  return { ok: true };
}

function leerRespaldo_(perfil) {
  const h = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Respaldo');
  const datos = {};
  if (!h || h.getLastRow() < 2) return datos;
  h.getRange(2, 1, h.getLastRow() - 1, h.getLastColumn()).getValues().forEach(f => {
    if (f[0] !== perfil || !claveOk_(f[1])) return;
    const texto = f.slice(5).filter(v => v !== '').map(v => String(v).replace(/^~/, '')).join('');
    try { datos[f[1]] = JSON.parse(texto); } catch (err) {}
  });
  return datos;
}

/** La app baja la copia con ?accion=respaldo&perfil=sofi. Sin parámetros, sirve para probar que la aplicación web responde. */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.accion === 'respaldo') {
    if (!perfilOk_(p.perfil)) return json_({ ok: false, error: 'perfil inválido' });
    return json_({ ok: true, datos: leerRespaldo_(p.perfil) });
  }
  return json_({ ok: true, juego: 'Dina Estudia', respaldo: true });
}

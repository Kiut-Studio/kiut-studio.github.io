/**
 * Progreso de Dina Física en una hoja de Google Sheets.
 * Se pega en Extensiones → Apps Script de una hoja nueva
 * y se implementa como "Aplicación web" (ver README).
 *
 * Pestañas que crea solo:
 *  - Partidas:   una fila por partida terminada (tema, aciertos, porcentaje).
 *  - Respuestas: una fila por pregunta respondida (bien o mal, qué eligió, segundos).
 *  - Ejercicios: una fila cada vez que marca un ejercicio en papel (Sí / Más o menos / No),
 *                con el enunciado y la respuesta (sirve para los de números nuevos).
 *  - Simulacros: una fila por simulacro terminado (nota, teoría, cada problema, tiempo).
 *
 * Al cambiar este código: Implementar → Administrar implementaciones → ✏️ → Versión: Nueva versión
 * → Implementar. Así la URL /exec sigue siendo la misma.
 */
const PESTANAS = {
  Partidas: ['fecha', 'nombre', 'modo', 'repaso de falladas', 'aciertos', 'total', '%'],
  Respuestas: ['fecha', 'nombre', 'modo', 'tema', 'id', 'pregunta', 'resultado', 'eligió', 'correcta', 'segundos'],
  Ejercicios: ['fecha', 'nombre', 'nivel', 'id', 'ejercicio', '¿le salió?', 'enunciado', 'respuesta'],
  Simulacros: ['fecha', 'nombre', 'nota (de 100)', 'teoría', 'puntos teoría (de 40)', 'problema 1', 'puntos 1', 'problema 2', 'puntos 2',
               'problema 3', 'puntos 3', 'minutos elegidos', 'minutos usados', '¿se acabó el tiempo?'],
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
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    if (d.tipo === 'partida') {
      const total = num_(d.total, 50), ok = num_(d.aciertos, 50);
      const modo = txt_(d.modo, 40);
      hoja_('Partidas').appendRow([cuando, nombre, modo, d.repaso ? 'sí' : '', ok, total, total ? ok / total : 0]);
      const filas = (Array.isArray(d.respuestas) ? d.respuestas : []).slice(0, 50).map(r => [
        cuando, nombre, modo, txt_(r.tema, 40), txt_(r.id, 10), txt_(r.pregunta),
        r.bien ? '✓ bien' : '✗ mal', txt_(r.elegida), txt_(r.correcta), num_(r.seg, 3600),
      ]);
      if (filas.length) {
        const h = hoja_('Respuestas');
        h.getRange(h.getLastRow() + 1, 1, filas.length, filas[0].length).setValues(filas);
      }
      return json_({ ok: true });
    }
    if (d.tipo === 'ejercicio') {
      hoja_('Ejercicios').appendRow([cuando, nombre, txt_(d.nivel, 40), txt_(d.id, 10), txt_(d.ejercicio, 80), txt_(d.resultado, 20),
        txt_(d.enunciado, 400), txt_(d.respuesta, 300)]);
      return json_({ ok: true });
    }
    if (d.tipo === 'simulacro') {
      const pr = (Array.isArray(d.problemas) ? d.problemas : []).slice(0, 3);
      const celdas = [];
      for (let i = 0; i < 3; i++) celdas.push(pr[i] ? txt_(pr[i].ejercicio, 80) : '', pr[i] ? num_(pr[i].puntos, 20) : '');
      hoja_('Simulacros').appendRow([cuando, nombre, num_(d.nota, 100), txt_(d.teoria, 20), num_(d.puntosTeoria, 40)]
        .concat(celdas, [num_(d.minutos, 180), num_(d.usados, 600), d.seAcabo ? 'sí' : '']));
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'tipo desconocido' });
  } finally {
    lock.releaseLock();
  }
}

/** Para probar que la aplicación web responde: abrir la URL /exec en el navegador. */
function doGet() {
  return json_({ ok: true, juego: 'Dina Física' });
}

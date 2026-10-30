# Dina Física

Juego para estudiar Física 1 (electrostática: Ley de Coulomb y campo eléctrico) con los dibujos de Sofía. Las preguntas y los ejercicios salen del material del Prof. Fernando Arturo Riveros.

No está enlazado desde la portada y tiene `noindex` para que no aparezca en buscadores. Se comparte solo por enlace.

## Qué tiene
- **Preguntas** de opción múltiple en 4 temas (carga, Coulomb, campo, superposición) y una prueba mezclada de 12. Dina baja hacia la torta mientras pensás; si acertás la espantás. Las que fallás vuelven a salir más seguido.
- **Ejercicios en papel**: los 18 del material (básico, intermedio y avanzado), con el dibujo del enunciado, la solución paso a paso, el dibujo de los vectores de la respuesta y un "¿Te salió?".
- **Fórmulas**: todas las del material por tema, con qué es cada letra, y los pasos para resolver un problema.
- Las cuentas se muestran con fracciones, potencias y subíndices de verdad (letra Atkinson Hyperlegible) para que sea fácil copiarlas al cuaderno.
- Guarda el progreso en el teléfono (`localStorage`, clave `dinaFisica.v1`) y, si se configura, en una hoja de Google.

## Hoja de Google (opcional)
1. Crear una hoja nueva en Google Sheets.
2. **Extensiones → Apps Script**, borrar lo que hay y pegar `hoja/Codigo.gs`. Guardar.
3. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: *Yo*. Quién tiene acceso: *Cualquier usuario*. Autorizar.
4. Copiar la URL que termina en `/exec` y pegarla en `config.js` (`window.HOJA_URL`).

Se crean solas tres pestañas: **Partidas**, **Respuestas** (cada pregunta, bien o mal, qué eligió y cuántos segundos tardó) y **Ejercicios**. Si no hay internet, lo pendiente se manda la próxima vez que se abre el juego.

## Créditos
- Dibujos: **Sofía** ©. Todos los derechos reservados.
- Programación: Leandro, con asistencia de IA.

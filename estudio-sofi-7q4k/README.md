# Dina Estudia

Hub de estudio de Sofía, con los dibujos de los juegos de Dina. Cada materia vive en su carpeta y todo se instala como **una sola app** (`manifest.json` con `id` y `scope` `/estudio-sofi-7q4k/`).

No está enlazado desde la portada y tiene `noindex`. Se comparte solo por enlace.

| Materia | Carpeta | Estado |
| --- | --- | --- |
| Biología (herencia y genética) | `biologia/` | Lista |
| Física 1 (electrostática) | `fisica-1/` | Lista |
| Historia y Geografía | `historia/` | Lista |
| Orientación | `orientacion/` | Lista |
| Física 2 | — | Próximamente |

## Motor común
Biología, Historia y Orientación usan `comun/motor.js` y `comun/estilo.css`. Cada carpeta tiene solo un `index.html` corto y un `datos.js` con `window.MATERIA`: temas, banco de preguntas (la primera opción es la correcta), resumen, ejercicios generados (opcional) y simulacro. Los dibujos se toman de `fisica-1/assets/` y la planilla de `fisica-1/config.js`. Física 1 sigue con su propio archivo.

Cada envío a la planilla lleva `materia`; `fisica-1/hoja/Codigo.gs` la anota en la última columna de cada pestaña (hay que pegar el código nuevo y publicar una **nueva versión** de la implementación).

## Agregar una materia
1. Lo más simple: copiar `orientacion/` y cambiar `datos.js` (otra `clave` de guardado). Para algo con cuentas y dibujos propios, copiar `fisica-1/`.
2. En `index.html` del hub, sumar la materia al arreglo `MATERIAS` (carpeta, nombre, ícono, colores y la clave de guardado para mostrar el progreso).
3. Sumar sus archivos a `BASE` en `sw.js` y subir el número de la caché (`dina-estudia-vN`).

## Copia sin conexión
`sw.js` guarda el hub y todas las materias. Solo toca sus propias cachés (`dina-estudia-*`) y borra las viejas de `dina-fisica-*`.

La dirección vieja `/f1-sofi-7q4k/` redirige a `fisica-1/` y desinstala su copia vieja sin conexión. El progreso no se pierde porque está en el mismo sitio (`localStorage`, clave `dinaFisica.v1`).

## Créditos
- Dibujos: **Sofía** ©. Todos los derechos reservados.
- Programación: Leandro, con asistencia de IA.

# Dina Estudia

Hub de estudio de Sofía, con los dibujos de los juegos de Dina. Cada materia vive en su carpeta y todo se instala como **una sola app** (`manifest.json` con `id` y `scope` `/estudio-sofi-7q4k/`).

No está enlazado desde la portada y tiene `noindex`. Se comparte solo por enlace.

| Materia | Carpeta | Estado |
| --- | --- | --- |
| Física 1 (electrostática) | `fisica-1/` | Lista |
| Física 2 | — | Próximamente |

## Agregar una materia
1. Crear su carpeta (por ejemplo `fisica-2/`), copiando `fisica-1/` como base.
2. En `index.html` del hub, sumar la materia al arreglo `MATERIAS` (carpeta, nombre, ícono, colores y la clave de guardado para mostrar el progreso).
3. Sumar sus archivos a `BASE` en `sw.js` y subir el número de la caché (`dina-estudia-vN`).

## Copia sin conexión
`sw.js` guarda el hub y todas las materias. Solo toca sus propias cachés (`dina-estudia-*`) y borra las viejas de `dina-fisica-*`.

La dirección vieja `/f1-sofi-7q4k/` redirige a `fisica-1/` y desinstala su copia vieja sin conexión. El progreso no se pierde porque está en el mismo sitio (`localStorage`, clave `dinaFisica.v1`).

## Créditos
- Dibujos: **Sofía** ©. Todos los derechos reservados.
- Programación: Leandro, con asistencia de IA.

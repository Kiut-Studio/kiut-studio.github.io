# Kiut Studio · Los juegos de Dina 🐱🍓

Portada de los juegos con los dibujos de Sofía: **https://kiut-studio.github.io/**

| Juego | Qué es |
| --- | --- |
| [Dina Run](https://kiut-studio.github.io/dina-run/) | Runner de un toque: saltá tortas, juntá frutillas y que no te alcance Dina. |
| [Dina Beat](https://kiut-studio.github.io/dina-beat/) | Juego de ritmo: espantá a Dina a tiempo con la música. |
| [Torta Runner](https://leandroacasco.github.io/torta-runner/) | Edición especial: el juego de cumpleaños de la familia. |

## Cómo está hecho
- Una sola página (`index.html`) y la carpeta `img/` con íconos y capturas de cada juego.
- Lee el progreso guardado de los juegos (están en el mismo sitio) para mostrar la bolsa de frutillas, el récord de Dina Run y las estrellas de Dina Beat. No guarda nada.
- **No tiene copia sin conexión (service worker) ni `manifest.json` a propósito:** está en la raíz del sitio y se metería con las apps de cada juego.
- Al cambiar el ícono o las capturas de un juego, copiarlos a `img/`.
- **Capturas:** Dina Run y Dina Beat siempre con **Sofi**; Torta Runner con **Cinthia**. Sin tema de temporada (Halloween), así sirven todo el año. Tamaños: `dina-run.webp` 1200×667, `torta-runner.webp` 1320×610, `dina-beat-menu.webp` y `dina-beat-juego.webp` 390×844 (celular parado).
- La cuenta de Google y la nube están en cada juego (Firebase `kiut-studio`); la portada solo lo cuenta.

## Créditos
- Dibujos, personajes, animación y capturas: **Sofía** ©. Todos los derechos reservados.
- Programación: Leandro, con asistencia de IA.

# Pendiente

Las decisiones que están abiertas y las que ya están cerradas, para que no haya
que reconstruirlas de memoria en la sesión siguiente. Lo que te falta por
**rellenar** (plazos, precios, textos, portfolio) no está aquí: está en
`PERSONALIZAR.md`, y ahí sigue.

Última revisión: 27/08/2026, después del barrido de toda la web.

---

## 1. Abierto: decisiones que son tuyas

### Los comentarios del CSS y el punto que falta en móvil

Ahora mismo: **98 en móvil, 100 en todo lo demás**. Lo único que bloquea la
primera pintura es `estilos.css`, y Lighthouse le pone 270 ms.

Medido el 19/08/2026: la hoja son 53.980 bytes en crudo, 13.657 de ellos
comentarios. Vercel la sirve en **15.377** bytes y sin comentarios serían
**9.111** — o sea que los comentarios son **6,2 KB en el cable, el 41 %** de la
única petición que retrasa la pintura. La prosa comprime mucho peor que el CSS
repetido, por eso pesa más de lo que hace pensar su cuarta parte del archivo.

La palanca sería sacar los párrafos largos del CSS a un documento aparte que no
se publique, dejando dentro solo las cabeceras numeradas de sección. Ganaría
casi la mitad de la hoja y probablemente el punto o los dos que faltan.

El coste: la explicación deja de estar al lado de la regla que explica. Las
trampas del toldo, la máscara `left bottom`, la especificidad de los numerales
—todo eso está escrito donde se tropieza con ello, y ahí es donde sirve—.

**Recomendación: quedarse en 98.** No está decidido; si prefieres el punto, se
hace en una sesión.

### El `www` y la foto

Dos cosas que solo puedes hacer tú y que están explicadas en `PERSONALIZAR.md`:
dar de alta `www.elescaparateweb.com` en Vercel —ahora mismo no resuelve, así
que quien lo escriba por costumbre no llega— y mandar una foto tuya para el
bloque de biografía de `sobre-mi.html`, que está montado y comentado esperando.

### El portfolio y sus dominios

Siete de las nueve fichas apuntan a `*.vercel.app` bajo el titular «Trabajos
entregados», y un cliente lee eso como pruebas, no como encargos. Preguntado el
27/08/2026 y **decidido dejarlo así**: el plan es sustituir las fichas conforme
entren encargos con dominio propio, no cambiar el titular. Si en unos meses el
reparto sigue igual, vuelve a mirarse.

### El repositorio de GitHub es público

`github.com/DarioAlRio/ElEscaparate` está abierto. No hay claves ni datos
personales dentro, así que no es urgente, pero cualquiera puede leer el sitio
entero antes de que esté terminado. Ponerlo privado son dos clics en GitHub y
no afecta a Vercel.

### El BOM en el título de un commit

El commit `7eca897` lleva tres bytes invisibles al principio del título, de una
codificación mal puesta. Se ve raro en el historial de GitHub. Arreglarlo obliga
a reescribir el historial y a un `push --force`, que es la única operación de
todo esto que puede romper algo. Por eso no se ha hecho por iniciativa propia.

---

## 2. Cerrado: no volver a proponerlo

Todo esto se midió y se descartó con un número delante. Está desarrollado en la
sección 5 de `CLAUDE.md`.

| Idea | Por qué no |
|---|---|
| Minificar el CSS y el JS | Exige un paso de compilación (regla 1) o borrar la documentación del sistema. Para el JS, además, no bloquea nada: va con `defer` |
| Partir el CSS por anchura | Todos los `@media (min-width)` juntos son 1.739 bytes de 53.980, un 3 % |
| Insertar el CSS crítico en el HTML | Obliga a mantener a mano un bloque duplicado en las diez páginas |
| Volver a enlazar Google Fonts | Eran 780 ms de bloqueo y tres saltos encadenados |
| Quitarle el eje óptico a Bricolage | Ahorra 36 KB y descoloca el titular de portada un 9 % |
| Apretar más los fotogramas de la maqueta | Lo que pesa es el canal alfa. Se gana quitando fotogramas, no comprimiendo |
| Subir la compresión del hosting | Vercel usa brotli de calidad 3 y no se configura desde el repositorio |
| El botón «Añadir a fuentes preferidas» de Google | Ver abajo |
| Bajar el registro de `/sobre-mi` y `/como-trabajo` | Preguntado el 27/08/2026: es el tono que Dario quiere para esas dos páginas, aunque suene más de despacho que la portada |
| Una Content-Security-Policy | Habría que listar Analytics y los tres servicios de capturas, y olvidar uno deja el portfolio en blanco. Las otras tres cabeceras sí están puestas |
| Un `<label>` de casilla obligatoria en el formulario | Se decidió el aviso enlazado sin casilla: el envío por WhatsApp o correo ya es un acto voluntario, y la casilla resta envíos |

### El botón de fuentes preferidas de Google

Google lo abrió a cualquier web el 20/08/2026: un `<script>` y un `<div
google-add-preferred-source-btn>`. Probado en local el 26/08/2026 y descartado
con tres números.

**73.397 bytes en el cable** (251.420 en crudo), más tres marcos de
`news.google.com` —uno oculto de servicio y uno por botón— y un `loader.svg`.
La hoja de estilos entera son 15.377: el botón es **4,8 veces el CSS completo**,
en cada página.

**Se carga antes de cualquier consentimiento**, y esos marcos llevan `origin` y
`source` con la dirección completa de la página. `news.google.com` es subdominio
de `google.com`, así que van con las cookies de Google del visitante. Es
contenido incrustado de un tercero: pide permiso previo igual que la medición, y
sin declararlo las políticas dejarían de ser ciertas. No pone cookies propias ni
toca `localStorage`; eso sí se comprobó.

**Y lo que compra son *Noticias destacadas*** y una insignia en AI Overviews y
AI Mode. Superficies de noticias, y el botón solo rinde con lectores que
vuelven. Aquí entra una vez quien está decidiendo si te contrata.

No necesita Publisher Center ni identificador: sale del dominio
(`publicationId=publication-id-free`). Si algún día esta web publica artículos
con fecha, la cuenta cambia y se vuelve a mirar.

---

## 3. Hecho en agosto de 2026

- Las fuentes se sirven desde el propio sitio; Google fuera de la ruta crítica.
- Los tres `<script>` a la cabecera con `defer`.
- Caché: `max-age=0` en todo `assets/` menos las fuentes, que llevan la versión
  en el nombre.
- Los tres recálculos de página que forzaba `sitio.js` en móvil.
- La maqueta: 48 fotogramas de un modelo 3D, en tres tandas, movida por el
  visitante.
- Enlaces internos sin extensión, servidos por `cleanUrls`.
- El registro de los textos: se tutea, pero sobrio.

De 89 a 98 en móvil, y de ahí no se sube sin tocar la regla 1 o la 6.

## 4. El barrido del 27/08/2026

Repaso de las diez páginas, del hosting y de la documentación. Lo que salió y
se arregló el mismo día:

**Estaba roto y publicado.** La `description` de `/cookies` seguía diciendo que
la web no instala cookies ni tiene aviso, un mes después de poner Analytics. La
página de error salía sin una sola regla de estilo en cualquier dirección con
carpetas, porque enlazaba sus assets con ruta relativa. Y el formulario apuntaba
a `PENDIENTE-pon-aqui-tu-endpoint`, que sin JavaScript daba un 404.

**Faltaba y se puso.** Imagen para compartir en las nueve páginas, datos
estructurados del estudio y de las seis preguntas, Madrid en ocho sitios, cuatro
eventos de medición, botón para retirar el consentimiento, aviso del artículo 13
en el formulario, tres cabeceras de seguridad, y los `lastmod` del sitemap al
día.

**Higiene.** Los enlaces del pie pasan de 19 a 25 px de alto (WCAG 2.5.8 pide
24), `/como-trabajo` deja de saltar de `h1` a `h3`, y el lema del pie deja de
ir con estilo en línea repetido nueve veces.

**Se decidió no tocar**: el registro de `/sobre-mi` y `/como-trabajo`, y el
titular del portfolio. Están arriba, en su sitio.

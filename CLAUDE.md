# CLAUDE.md — El Escaparate

Web del estudio de Darío Domínguez García. Siete páginas estáticas, sin build.
Dominio: `elescaparateweb.com`.

Antes de tocar nada, mira si la respuesta ya está escrita:

| Pregunta | Archivo |
|---|---|
| Qué es, a quién habla, qué se ofrece y qué no | `PRODUCT.md` |
| Paleta, tipografía, motivos, movimiento, accesibilidad | `DESIGN.md` |
| Qué le queda por rellenar a Dario antes de publicar | `PERSONALIZAR.md` |
| Qué decisiones están abiertas y cuáles ya se descartaron | `PENDIENTE.md` |

Este archivo es lo demás: cómo se trabaja aquí y qué trampas ya se han pagado.

---

## 1. Reglas inviolables

1. **Sin build, sin npm, sin dependencias.** HTML + CSS + JS a pelo.
2. **Sin módulos ES.** Los `<script>` son clásicos, en IIFE con `"use strict"`.
   Nació de que `type="module"` no funciona bajo `file://`; esa condición se
   levantó el 17/08/2026 (ver la regla 3), pero la forma se queda: no hay build
   que empaquete módulos y así el orden de carga es el del HTML, sin sorpresas.
3. **Enlaces internos absolutos de raíz y sin extensión** (`/diseno-web`, y `/`
   para la portada). Igual que `canonical`, `og:url` y `sitemap.xml`, que ya iban
   así. Lo sirve **Vercel** con `cleanUrls` en `vercel.json`, y el servidor de
   desarrollo hace lo mismo.
   **Contrapartida, decidida el 17/08/2026: la web ya no se abre con doble
   clic.** Bajo `file://` nadie resuelve `/diseno-web`, así que para verla en
   local hay que arrancar `node _dev-servidor.js`. Antes los enlaces llevaban
   `.html` justo para conservar el doble clic; se cambió para ahorrar el salto
   308 que costaba cada clic del menú. Si algún día vuelve a hacer falta abrirla
   sin servidor, hay que devolver la extensión a los `href` de las diez páginas.
4. **Sin backend.** Capturas a servicios públicos. El formulario sale por
   WhatsApp o por el programa de correo del visitante; el día que haya un
   servicio de formularios dado de alta, se cambia el `action` y ya (ver §5).
5. **Español de España, tuteo, registro formal, sin jerga.** Se tutea, pero el
   tono es sobrio: nada de coloquialismos («vale cualquier web», «sale barato»,
   «no hay por dónde») ni de guiños. Decidido el 17/08/2026, cambiando el
   registro informal con el que nació la web. Lo que **sí** se conserva es la
   metáfora del escaparate, la persiana y el toldo: es el nombre del estudio y
   el logo, y sin ella los titulares se quedan sin apoyo. «La calle» sí se
   retiró como nombre del portfolio, por poco clara; ahora es «Trabajos».
   El código también va en español (`envoltura`, `franja`, `toldo`, `cierra`,
   `pinta`). No mezclar idiomas.
6. **Un solo CSS y tres JS.** No se añaden archivos sin motivo fuerte.
7. **Nada de inventar** precios, plazos, URLs de clientes ni testimonios. Si
   falta un dato, se marca en `PERSONALIZAR.md` y se deja el hueco visible.

## 2. Comandos

```bash
node _dev-servidor.js
```

Sirve la carpeta en `http://localhost:5174` y resuelve rutas sin extensión igual
que el hosting. `node` del sistema es 16.10 y basta: el servidor es CommonJS.
**Es obligatorio para ver la web**: desde el 17/08/2026 los enlaces no llevan
extensión y abrir `index.html` a pelo deja la navegación muerta.

```bash
node "C:\Users\Dario\.claude\skills\impeccable\scripts\detect.mjs" index.html
```

Detector de antipatrones de **impeccable** (instalado global en `~\.claude`,
nunca copiado dentro del proyecto). **Exit 0 = limpio.** Pásalo por cada página
que toques antes de darla por buena.

```bash
node _render-servidor.js
```

El taller que saca los 48 fotogramas de la maqueta desde `_modelo-caseta.glb`.
Sirve en `http://localhost:5199` y escribe en `_fotogramas/`. Necesita three.js
en `tres/` y `utils/`, que no se versionan: cómo bajarlos y la receta completa
están en la cabecera de `_render-modelo.html`. Nada de esto se publica.

## 3. Mapa

| Archivo | Dirección publicada | Qué es |
|---|---|---|
| `index.html` | `/` | Portada: contrato de dirección, modelo girando, oferta |
| `diseno-web.html` | `/diseno-web` | Los tres formatos, el mantenimiento y los desplegables |
| `trabajos.html` | `/trabajos` | Rejilla del portfolio + filtros (menú: «Trabajos») |
| `como-trabajo.html` | `/como-trabajo` | Los cuatro pasos del método |
| `sobre-mi.html` | `/sobre-mi` | Quién está detrás |
| `presupuesto.html` | `/presupuesto` | Formulario, WhatsApp y correo |
| `aviso-legal.html` | `/aviso-legal` | Titular, uso, propiedad intelectual |
| `privacidad.html` | `/privacidad` | Datos, finalidades, proveedores, derechos |
| `cookies.html` | `/cookies` | Las dos de Analytics, el `localStorage` y el botón de revocación |
| `404.html` | — | Lo sirve Vercel solo |

```
assets/css/estilos.css    Sistema entero, 18 secciones numeradas en comentarios
assets/js/proyectos.js    Datos del portfolio — lo único que se toca a menudo
assets/js/escaparates.js  Motor de capturas, fichas y visor
assets/js/sitio.js        Menú, año, .entra, formulario, varilla, cierre, giro,
                          el aviso de cookies con su botón de revocación y los
                          cuatro eventos de medición de las salidas de contacto
assets/fuentes/*.woff2   Archivo y Bricolage, subconjunto latin. Ver §5
assets/img/modelo-NN.webp Los 48 fotogramas de la maqueta, 00 a 47. Ver §5
assets/img/modelo-00.png  Solo el primero, de respaldo para quien no lea WebP
_modelo-caseta.glb        El modelo 3D del que salen. No se publica
_render-modelo.html       El taller que saca los fotogramas. Instrucciones dentro
_render-servidor.js       Lo sirve y recoge lo que manda el navegador
vercel.json               cleanUrls + los 301 de las direcciones antiguas
.htaccess                 Lo mismo para Apache, por si se muda
robots.txt · sitemap.xml
icono-buscador-192.png    El ÚNICO que enlazan las diez páginas. Ver §5
og-escaparate.png         La tarjeta de og:image, 1200x630. La dibuja un canvas
                          con el logo y las tipografías: no hay original fuera
favicon.ico               16/32/48 en DIB. En la raíz, sin enlazar: solo
                          para quien lo busque por costumbre
favicon-conborde.svg      Logo con filete. Ya no se enlaza; es el original
favicon.svg               El mismo sin filete. Ninguna página lo enlaza, pero
                          el CSS lo usa de marca de agua del fondo: no borrar
tres/ · utils/            three.js para el taller. Ni se versiona ni se publica
_fotogramas/              Salida en crudo del taller. Ni se versiona ni se publica
_dev-servidor.js          No se sube al hosting
```

Los nombres de archivo **son** las direcciones, aunque ya no se escriban con
extensión en los enlaces. Renombrar una página obliga a tocar los enlaces de las
diez, su `canonical` y su `og:url`, `sitemap.xml`, y a dejar el 301 de la vieja
en `vercel.json` y en `.htaccess`.

Para localizar CSS, busca la cabecera numerada (`/* --- 9. Oferta`). Añade
reglas **dentro de su sección**, no al final del archivo.

## 4. Convenciones

- **Estado en atributos `data-`**, no en clases: `data-estado="cerrado"`,
  `data-abierta="no"`, `data-vista="movil"`. El CSS lee `[data-estado="…"]`.
  Las clases describen qué es la cosa, nunca en qué estado está.
- **Nada de `!important`** y nada de estilos en línea salvo variables por
  instancia (`style="--tono:#ff5c3a"`).
- **JS: `var`, funciones nombradas, sin frameworks.** `escaparates.js` expone
  `window.Escaparates = { captura, normaliza, pinta, abreVisor }`; es la única
  variable global del código propio. Las otras tres las crea el fragmento de
  medición que va en la cabecera de las diez páginas desde el 26/08/2026:
  `dataLayer` y `gtag`, tal cual los publica Google —sin traducir ni envolver
  en IIFE, porque tienen que quedar globales—, y `cargaMedicion`, que es
  nuestra y solo se llama cuando hay consentimiento.
- **Los eventos de medición se llaman en español y en `snake_case`**, como el
  resto del código: `envio_whatsapp`, `envio_correo`, `clic_whatsapp`,
  `clic_telefono`. Los dos primeros los dispara el módulo del formulario y no el
  listener general, y eso es a propósito: solo el formulario sabe si el envío
  llegó a salir o se quedó en un campo vacío, y contar el clic desde fuera
  inflaría la cifra con intentos fallidos.
- **Se puede llamar a `gtag` sin comprobar si hay consentimiento.** La cabecera
  lo define siempre; mientras no haya un sí, solo apila el aviso en `dataLayer`
  y no sale nada del navegador.
- **Los comentarios explican el porqué, no el qué.** Si una regla parece
  arbitraria, es que costó descubrirla: déjala documentada en el sitio.
- **Accesibilidad no opcional:** `aria-current` en el menú, `aria-expanded` en
  el desplegable, `aria-pressed` en los conmutadores, foco visible siempre,
  visor con foco atrapado y `Esc`, y todo bajo `prefers-reduced-motion`.

## 5. Trampas ya pagadas

No las vuelvas a pisar; todas están comprobadas midiendo, no a ojo.

- **`overflow-x: hidden` va en `html`, jamás en `body`.** En el `body` convierte
  su desbordamiento vertical en `auto` y anula cualquier `position: sticky` de
  dentro.
- **Las máscaras del toldo llevan `left bottom`, no `bottom`.** Por defecto la
  máscara se centra al 50 % y los festones se desincronizan de las franjas.
- **El toldo cuelga fuera de la cabecera** (`position:absolute; bottom:-24px`).
  Si se mete dentro, la cabecera reserva esos 24 px y se ve el fondo del body
  entre festón y festón.
- **Especificidad en los numerales:** `.fase p` gana a `.fase__marca`; hay que
  escribir `.fase .fase__marca`.
- **`.lista-marcada li` es una rejilla de dos columnas**: el rombo y el texto.
  Si dentro del `<li>` hay un `<a>` o un `<strong>`, eso ya son dos elementos y
  el segundo se cae a otra fila, con el texto desalineado y el enlace debajo.
  El contenido de cada punto va **siempre envuelto en un `<span>`**.
- **mShots contesta con un gris de 400×300** mientras genera. Se rechaza por
  tamaño exacto; si no, se cuela como si fuera la web del cliente.
- **thum.io ignora la espera** (devuelve la misma imagen byte a byte). Solo
  Microlink respeta `waitForTimeout`, así que las fichas con `espera` van a
  Microlink y el resto a thum.io, que es más rápido. Tiempo de espera: 22 s.
- **Microlink son 25 peticiones al día por IP del visitante**, y cada vista del
  visor gasta una. Por eso no se le pide la imagen (`embed=`) sino su JSON: de
  ahí sale la dirección definitiva en su CDN, que no cuenta para el cupo y se
  guarda 30 días en `localStorage`. Y por eso se le piden `type=jpeg&quality=72`
  con `viewport.deviceScaleFactor=1`: por defecto devuelve 2560×1600 y 2,7 MB;
  así son 1280×800 y 104 KB. Medido, no estimado.
- **Con `espera` obligatoria no vale el relevo.** Si Microlink fallaba, la
  cadena caía en thum.io y la captura salía con el logo del intro — se veía al
  abrir el visor, que pide una captura por vista. Por eso `captura()` tiene un
  cuarto argumento, `estricto`: reintenta Microlink y, si no, no hay captura.
- **Bermellón doble:** `--accion` no llega a 4,5:1 sobre la baldosa. Texto y
  grafismo sobre claro usan `--accion-tinta`; el vivo solo relleno o sobre azul.
- **El favicon de Google va por libre, y su caché es por dirección.** Google
  guarda el icono aparte del índice y lo refresca a su ritmo. Peor: cachea la
  **URL**, así que cambiarle el contenido a un archivo que ya conoce no le hace
  efecto ninguno. Aquí se cambió `favicon.svg` por dentro y siguió sirviendo el
  logo viejo semanas después; a `sz=256` lo devolvía nítido, prueba de que
  tenía cacheado el SVG antiguo entero y de que pedirle tamaños sin cachear
  —el truco que se lee por ahí— no arregla nada en ese caso.
  Por eso las diez páginas enlazan **un solo** `rel="icon"`, y es
  `icono-buscador-192.png`: dirección nueva que Google no había visto, PNG
  (su documentación no menciona el SVG entre los formatos) y 192 px, porque
  pide **mayor de 48×48**. Una sola declaración a propósito: Google se apoya en
  la etiqueta `<link>` de la portada y no documenta qué hace con varias.
  Si algún día hay que repetirlo: archivo con nombre nuevo, no editar el que
  está. Y luego, reindexación en Search Console, que es lo único que dispara
  la actualización de verdad.
- **Nada de caché larga en `assets/`.** Los archivos no llevan versión en el
  nombre, así que guardarlos horas significa servir lo viejo después de
  publicar. Y como Vercel sirve el HTML con `max-age=0` por defecto, una caché
  larga solo en el CSS produce lo peor: HTML nuevo con estilos viejos, que no
  se ve como «lo de antes» sino como un diseño roto. Pasó dos veces —el manchón
  negro de la etiqueta SALE y las columnas descolocadas de «El estudio»—. Desde
  el 17/08/2026 `vercel.json` y `.htaccess` ponen `max-age=0, must-revalidate`
  en todo: el navegador conserva la copia y el servidor contesta 304, que son
  200 bytes. Si algún día se quiere caché larga de verdad, primero hay que
  poner versión en las direcciones (`estilos.css?v=8`), no antes.
  **Las fuentes son la única excepción**, y precisamente porque sí llevan la
  versión dentro del nombre (`archivo-v25-latin.woff2`): actualizar una es subir
  un archivo nuevo, así que van con `max-age=31536000, immutable`. Por eso
  `vercel.json` nombra las carpetas una a una (`css`, `js`, `img`, `fuentes`) en
  vez de un `/assets/(.*)` con excepción: así ninguna regla se pisa con otra y
  no hay que fiarse del orden. **Si algún día se añade una carpeta a `assets/`,
  hay que darle su regla**; mientras no la tenga, Vercel le pone su valor por
  defecto, que es justo el `max-age=0` que queremos.
- **Las fuentes se sirven desde aquí, no desde Google.** La etiqueta de
  `fonts.googleapis.com` bloqueaba la pintura **780 ms** en móvil y encadenaba
  tres saltos antes de tener una letra: HTML → su CSS → su CDN, con dos
  conexiones a dominios ajenos por medio. Ahora las diez páginas precargan los
  dos `.woff2` (`rel="preload"`, `crossorigin` obligatorio aunque sean del mismo
  origen) y el `@font-face` vive en la sección 0 del CSS. Los archivos son los
  mismos bytes que servía Google, subconjunto latin, que cubre el español
  entero. Comprobado que el dibujo no cambia: mismo ancho al píxel a 18, 34 y
  73,6 px, y en la negrita del texto. **No volver a enlazar Google**: no ahorra
  nada y devuelve los tres saltos.
- **A Bricolage no se le quita el eje óptico.** Pedirla sin `opsz` deja el
  archivo en 41 KB en vez de 77, pero el navegador aplica ese eje solo
  (`font-optical-sizing: auto`) y es lo que aprieta los titulares: sin él el
  titular de portada mide 1967 px en vez de 1803, un 9 % más ancho, y se
  descompone la portada. Los 36 KB no compensan.
- **Lo que cuestan los comentarios del CSS en el cable: 6,2 KB, el 41 %.**
  Medido el 19/08/2026, y corrige lo que decía antes esta misma línea («el coste
  no está en los bytes»): sí lo está. La hoja son 53.980 bytes en crudo, 13.657
  de ellos comentarios; Vercel la sirve en **15.377** y sin comentarios serían
  **9.111**. La prosa comprime mucho peor que el CSS repetido, por eso pesa más
  de lo que hace pensar su cuarta parte del archivo. Aun así **no se minifica**:
  la única forma es un paso de compilación (regla 1) o borrar la documentación
  del sistema, y esa decisión es de Dario, no del que edita. Para el JS la
  objeción de siempre sí vale: van con `defer`, no bloquean la pintura.
- **Vercel comprime con brotli de calidad 3, y eso no se toca desde aquí.**
  Reproducido byte a byte: `brotliCompress(q=3, lgwin=16)` da 15.367 y el
  servidor manda 15.377. La misma hoja a calidad 11 son 12.457, así que hay
  2,9 KB que se pierden en el hosting y no hay ajuste que los recupere; ni
  siquiera gana al gzip -9, que son 14.155. Antes de acusar al CSS de pesado,
  ten en cuenta de dónde sale un quinto de su peso.
- **Tampoco se parte el CSS por anchura.** El truco de sacar lo de escritorio a
  otra hoja con `media="(min-width: …)"`, que el navegador baja sin bloquear la
  pintura, aquí no da nada: contado, **todos los `@media (min-width)` juntos son
  1.739 bytes** de 53.738, un 3 %. Y costaría una hoja más (regla 6) y mover
  reglas de sección, que cambia el orden de la cascada. La hoja seguirá siendo
  la única petición que bloquea la pintura; ese es el techo aceptado.
- **Los tres `<script>` van en la cabecera con `defer`**, no al final del body.
  Así el navegador los descubre con los primeros bytes en vez de al terminar de
  leer la página, y `defer` los ejecuta igual que estando al final, con el DOM
  hecho. `escaparates.js` ya contempla los dos casos (`readyState`), y
  `sitio.js` mide el DOM al vuelo, que con `defer` está completo. Si se mueven
  al final otra vez, se pierde el adelanto y no se gana nada.
- **La maqueta que gira son 48 fotogramas de un modelo 3D**, uno cada 7,5
  grados, sacados con `_render-modelo.html` desde `_modelo-caseta.glb`. El HTML
  solo trae el primero; los otros 47 los crea `sitio.js` al terminar la carga.
  El giro está **dentro** de las imágenes: en el CSS de `.giro__cara` no puede
  haber ninguna transición. Antes eran cuatro fotos a 90 grados con un
  `rotateY` que fingía el volumen; con fotogramas de verdad ese truco suma dos
  giros y emborrona el movimiento en vez de suavizarlo.
- **No gira sola desde el 18/08/2026**, por decisión de Dario: la mueve el
  visitante y nadie más. Eso cambia de dónde sale el peso —la mayoría de las
  visitas no la tocan— y por eso los fotogramas bajan en **tres tandas**: uno de
  cada cuatro (12, 177 KB), luego uno de cada dos (24, 331 KB) y luego todos
  (48, 683 KB). La tercera **solo en pantallas de 768 px para arriba**: en un
  móvil la maqueta se ve a 354 px, con 24 ya no se distinguen los saltos, y los
  otros 24 serían medio mega y unos 20 MB de mapas de bits descodificados.
  Mientras falten, `pinta()` enseña el fotograma cargado más próximo; la cuenta
  del giro va aparte y no se entera, así que al llegar una tanda nueva el gesto
  sigue donde estaba.
- **`img.decode()` no se espera nunca, solo se dispara.** Adelanta el trabajo de
  descodificar, que si no llega sin hacer al primer paso por ese fotograma y el
  giro da un tirón. Pero con la pestaña de fondo hay navegadores que dejan esa
  promesa **sin resolver ni rechazar indefinidamente**: con ella colgada, la
  tanda no terminaba nunca y la maqueta se quedaba muerta con las imágenes ya
  descargadas. Comprobado: 29 s con los 12 fotogramas en el DOM y `data-vivo`
  sin poner. Lo que decide es `onload`, que sí llega siempre.
- **La flecha no avanza un fotograma: da un cuarto de vuelta.** 12 fotogramas a
  34 ms, pasando por todos los de en medio. Uno solo a 7,5 grados no se ve como
  un giro, se ve como un parpadeo. Bajo `prefers-reduced-motion` salta directa
  al destino sin recorrerlo.
- **El recorte de los 48 es uno solo, no uno por fotograma.** `barre(48)`
  pinta la vuelta entera, mide el alfa de cada una y se queda con la unión —da
  `[111, 170, 1578, 857]`, el mismo que salía muestreando 24, así que el
  encuadre es estable. Si cada fotograma se ajusta a su propia silueta, la
  caseta baila dentro del cuadro en vez de girar. Efecto lateral inevitable: la
  peana es cuadrada, así que de esquina llena el ancho y de frente ocupa dos
  tercios. Eso es lo que hace un plato giratorio, no un fallo del encuadre.
- **Al pasar de un fotograma al siguiente la esquina de delante se va hacia la
  derecha.** Por eso arrastrar hacia la derecha **sube** el índice: así la
  caseta va con el dedo. Con el signo al revés gira en contra, que es la
  sensación de que el mando está estropeado. Van 9 px de dedo por fotograma:
  432 px la vuelta entera.
- **El taller de render no arranca sin `utils/BufferGeometryUtils.js`.**
  `GLTFLoader` lo importa como `../utils/`, fuera de la carpeta donde se pone
  three.js, y la consola solo dice «404» sin decir de qué. Media hora perdida.
- **Peso: 14 KB por fotograma a 640 px.** Bajar el ancho a 600 solo ahorra un
  8 % y bajar la calidad del WebP de 0,78 a 0,62 solo un 10 %, porque lo que
  pesa es el canal alfa, que va sin pérdida. Medido, no estimado: no se gana
  nada apretando, se gana quitando fotogramas.
- **Leer geometría después de escribir en el DOM para la página entera.** Es el
  «forced reflow» que señalaba Lighthouse en móvil, y salían tres focos en
  `sitio.js`, todos por lo mismo: preguntar por una medida cuando el navegador
  aún tenía el dibujo sucio, y obligarle a recalcularlo ahí mismo. Cómo se
  arreglaron, que sirve de receta:
  - `crea()` pedía `modelo.width` —el ancho **pintado**— para copiarlo en cada
    cara: hasta 48 recálculos seguidos para un número que no cambia. Ahora se
    lee una vez, y del atributo (`getAttribute("width")`), que no mide nada.
  - Las caras entraban al documento de una en una. Ahora la tanda se monta en un
    `DocumentFragment` y se inserta de golpe.
  - `alinea()` medía la cabecera justo después de insertar la varilla: 26 ms, el
    más caro de los tres. Ahora se llama **antes** de insertarla. Y ya no mide
    la varilla para restarle la mitad, la ancla con `translateX(-50%)`.
- **El detector de antipatrones lee dentro de los comentarios HTML.** Escribir
  `<` seguido de `img>` en un comentario le hace contar una imagen rota. Si
  `detect.mjs` señala una línea que es prosa, es esto: cambia la redacción.
- **Sin bloqueo de scroll al bajar el cierre:** el `overflow:hidden` en el body
  dejaba una franja clara a la derecha. El cierre es `fixed` y ya tapa todo.
- **La medición no se carga hasta que hay un sí, y eso es a propósito.** El
  fragmento de la cabecera solo deja preparada `cargaMedicion`; quien rechaza o
  no contesta no descarga nada de Google, ni siquiera el archivo. La
  alternativa que recomienda Google —cargarlo siempre con el consentimiento en
  `denied`— pone las cookies a cero pero sigue pidiendo 150 KB a un tercero
  antes de tener permiso. Así se cumple el 22.2 de la LSSI sin discusión y de
  paso no se paga ese peso en la mayoría de las visitas.
  La decisión se guarda en `localStorage` con la llave `galletas`, no en una
  cookie: una cookie para recordar que no quieres cookies hay que explicarla en
  la política. Al rechazar se caducan `_ga` y `_ga_97JZNBDJE6` por si venían de
  antes del aviso.
- **La cookie de sesión de GA4 se llama `_ga_97JZNBDJE6`, sin la «G-».** Google
  se la come al nombrarla, aunque el identificador de la propiedad sí la lleve.
  Comprobado leyendo `document.cookie`; casi todas las políticas que se copian
  por ahí la escriben mal.
- **`404.html` enlaza sus assets con barra inicial, y ahí no es cosmético.** El
  hosting sirve ese archivo desde la dirección que pidió el visitante, no desde
  la raíz. Con rutas relativas, un 404 en `/blog/algo/x` pedía
  `/blog/algo/assets/css/estilos.css` y la página de error salía sin una sola
  regla de estilo, en Times New Roman. Comprobado los dos lados el 27/08/2026.
  Las otras nueve páginas siguen con ruta relativa y funcionan porque están
  todas en la raíz; en la 404 **no le quites la barra**.
- **Los `lastmod` del `sitemap.xml` hay que tocarlos al publicar.** Es lo único
  del archivo que se queda viejo solo, y es la señal con la que Google decide si
  vuelve a leer una página. Estuvieron los nueve en `2026-08-17` mientras las
  páginas se reescribían el 26 y el 27. La fecha es la del último cambio de *su*
  archivo, no la de hoy: ponerlas todas iguales le dice al buscador que
  cambiaron a la vez, y a la tercera deja de hacer caso al campo.
  `git log -1 --format=%ad --date=short -- pagina.html`
- **El `action` del formulario es el camino sin JavaScript, no un adorno.**
  Estuvo en `PENDIENTE-pon-aqui-tu-endpoint`, que no es la dirección de nada:
  sin JavaScript el navegador enviaba ahí y daba un 404 en el propio dominio.
  Ahora es un `mailto` de verdad, y `porCorreo()` distingue el endpoint por que
  empiece por `http`, no por una palabra clave dentro del atributo. Si algún día
  entra un servicio de formularios, se cambia el `action` y se quita el
  `enctype="text/plain"`; el código no necesita nada más.
- **El relleno vertical de un enlace en línea no agranda el área pulsable.** Los
  del pie median 19 px y la WCAG 2.5.8 pide 24. Hace falta `inline-block` para
  que el `padding-block` empuje la caja. Dos excepciones que ya son caja de
  bloque y a las que **no** hay que ponérselo: `.pie__con-icono`, que es
  `inline-flex`, y los de `.pie__legal-enlaces`, que van blockificados por ser
  hijos de un flex. Ponérselo rompería el primero, porque `.pie ul a` tiene más
  especificidad que `.pie__con-icono` y le ganaría el `display`.
- **El recuadro del aviso va en `--azul-hondo` y con filete, no en `--azul`.**
  Aparece sobre la portada, que ya es una franja azul: del mismo color se funde
  con el fondo y lo único que lo despega es la sombra, que sobre azul no se ve.
- **La marca de agua del fondo depende de que el `body` no cree contexto de
  apilamiento.** Es un `body::before` con `z-index: -1`: se pinta encima del
  color del lienzo —que es el fondo del body, propagado a la raíz porque el
  `html` no tiene ninguno— y debajo de todo lo demás. En cuanto el `body` reciba
  un `position`, `opacity`, `transform`, `filter` o `isolation`, pasa a ser el
  contexto de apilamiento y la marca se va por debajo de su propio fondo: no se
  ve nada y no hay error que lo diga. Si algún día hace falta, la salida es
  mover el color de fondo del `body` al `html`.
- **La opacidad de la marca de agua es un techo medido, no un gusto.** 0,065.
  Quien manda es `--accion-tinta`, el bermellón de texto, que sobre la baldosa
  limpia ya va justo en 5,09:1; con el logo detrás baja a 4,52 y a 0,07 cae a
  4,47, que ya suspende. Y no hay truco que lo suba: el color más claro del
  logo es la misma cal del fondo, así que la marca solo puede oscurecer. Más
  desenfoque permite algo más de opacidad —a 60 px, 0,093— porque reparte la
  misma caída de luz en más superficie, pero entonces es una mancha y no un
  logo. Si se quiere más presencia, hay que oscurecer `--accion-tinta` primero.

## 6. Cómo verificar

El panel del navegador bloquea `localhost` y las capturas fallan a menudo. El
método que funciona es **medir el DOM en vivo** con `javascript_tool`:
`getBoundingClientRect` para huecos y desbordes, `getComputedStyle` + la fórmula
WCAG para contraste, `scrollWidth > clientWidth` para desbordes horizontales,
`getPointAtLength` / `getScreenCTM` para geometría SVG. Nunca des por bueno un
ajuste visual «a ojo» si se puede medir.

Si no hay navegador disponible, dilo claramente en la respuesta en vez de
afirmar que se ha comprobado.

## 7. Al cerrar un cambio

1. `detect.mjs` en exit 0 en cada página tocada.
2. Contraste medido si has tocado color, a 390 px y a 1440 px.
3. Sin desbordes horizontales a 390 px.
4. Navegación comprobada con `node _dev-servidor.js`, no abriendo el archivo.
5. Si has cambiado precios, plazos, contacto o condiciones, actualiza también
   `PERSONALIZAR.md`; si has cambiado el sistema visual, `DESIGN.md`.
6. Si has cambiado el contenido de una página, ponle su `lastmod` de hoy en
   `sitemap.xml`. Es lo único del sitio que no se actualiza solo.
7. Si has tocado las seis preguntas de `/diseno-web`, cambia también su
   `FAQPage`: Google descarta el bloque entero cuando el texto no coincide
   palabra por palabra con lo que ve el visitante.

## 8. Cómo responder a Dario

Va al grano y detecta el relleno. Cuando pide un ajuste visual, quiere **ese**
ajuste: no aproveches para rediseñar de paso. Si algo se ha intentado ya y
falló, dilo en una línea y propón la alternativa en vez de repetir el intento.
Si dos lecturas de la petición dan resultados muy distintos, pregunta antes de
gastar el trabajo.

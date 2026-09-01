# DESIGN.md — El Escaparate

Escrito desde lo construido, no desde la intención. Si el código y este archivo
se contradicen, manda el código y hay que corregir esto.

## El mundo

**Letrerismo de comercio de barrio.** Toldo a rayas con el borde festoneado,
persiana de lamas, escaparate con su reflejo y cartel de CERRADO / ABIERTO.
Nace de que el cliente objetivo tiene un local con fachada: la web es la otra
fachada, y esa traducción sostiene toda la página sin necesidad de explicarla.

Lo que se rechaza a conciencia, porque es lo que publica el sector: fondo casi
negro con degradado de neón, cristal esmerilado de adorno y una rejilla de
tarjetas iguales de icono + título + tres líneas.

## Color

Estrategia: **paleta completa, cuatro papeles**. El azul ocupa regiones
enteras; no es un acento sobre fondo neutro.

La primera versión salió verde botella con ocre, que es exactamente la paleta
de otra web del mismo autor (Pastor de Adrada). Se rehízo sobre el otro gran
par de la letrerismo española: **azulejo y bermellón**, el de la fachada de
mercado y la barra de bar.

| Ficha | Valor | Papel |
|---|---|---|
| `--azul` | `#0b2350` | Suelo dominante: portada, franjas oscuras, cabecera |
| `--azul-hondo` | `#06152f` | Pie y fondos hundidos (marcos, visor) |
| `--azul-alto` | `#17417f` | Persiana bajada, huecos sin captura |
| `--azul-linea` | `#234f8f` | Bordes sobre oscuro |
| `--accion` | `#ff5c3a` | **Única señal de acción.** Botones, toldo, foco sobre azul |
| `--accion-hondo` | `#ff7452` | Hover: el letrero se enciende, no se apaga |
| `--accion-tinta` | `#b83410` | El mismo bermellón para texto y grafismo sobre claro |
| `--azulejo` | `#3bb3c9` | Turquesa del segundo formato |
| `--senal` | `#ffd23f` | Amarillo de señal del tercer formato |
| `--cal` | `#eaeef2` | Superficie clara y texto sobre azul |
| `--tinta` | `#0d1726` | Texto sobre claro |
| `--tinta-suave` | `#4a5a70` | Texto secundario sobre claro |
| `--azul-suave` | `#a9bdd9` | Texto secundario sobre azul |
| `--alarma` | `#a3122b` | Errores de formulario |

El blanco es **frío, de baldosa**, no crema: la calibración por defecto para un
sujeto artesano es fondo crema con serif alto, y aquí no se quiso eso.

**Dos bermellones, un solo color.** El vivo (`--accion`) no llega a 4,5:1 sobre
la baldosa, así que todo lo que sea texto o grafismo sobre claro usa
`--accion-tinta`, y el vivo se reserva para rellenos y para lo que va sobre
azul. Por eso hay pares de reglas con `.franja--azul` / `.franja--hondo` en el
foco, los numerales de fase, los rombos de lista y el `+` de los desplegables.

Regla que se cumple en todo el sitio: el texto secundario se tiñe del tono del
fondo (`--azul-suave` sobre azul, `--tinta-suave` sobre claro). Nunca gris.

**Escena elegida:** el dueño de un negocio mirando el móvil de noche, con el
local ya cerrado. De ahí que la primera pantalla sea oscura y el cuerpo de
lectura, claro.

## Tipografía

- Titulares: **Bricolage Grotesque** 700–800, `letter-spacing: -0.035em`.
- Texto: **Archivo** 400/500/600.

Las dos van **servidas desde el propio sitio** (`assets/fuentes/`, subconjunto
latin, `.woff2`), no desde Google. El dibujo es el mismo archivo que servía
Google —comprobado midiendo: mismo ancho al píxel a 18, 34 y 73,6 px, y también
en la negrita del texto—, pero sin la hoja de estilos ajena que bloqueaba la
pintura. Bricolage conserva su eje óptico (`opsz`), que es lo que mantiene los
titulares anchos y apretados; sin él pesaría 36 KB menos y saldrían un 9 % más
anchos.

Escala fija en `rem`, de `--t-xs` (0.8125) a `--t-4xl`
(`clamp(2.9rem, 7.2vw, 5.4rem)`). El display nunca pasa de 5.4rem. Medida de
lectura acotada a 34–44rem según el bloque.

## Composición

- `.envoltura` de 76rem con relleno lateral fluido.
- Franjas alternas azul / baldosa, con el ritmo `--e1`…`--e7`. Más aire encima de
  un titular que debajo.
- **La oferta son filas, no tarjetas.** Cada uno de los tres formatos es una
  fila de rejilla con su tono (bermellón, turquesa, amarillo de señal) en una
  barra superior que se despliega al pasar por encima. La rejilla de tarjetas
  iguales estaba descartada desde el principio.
- El portfolio sí es rejilla, porque ahí las fichas son escaparates de una calle
  y esa repetición es el contenido. La primera ocupa el ancho completo.
- **Hero a pantalla completa con foto** (`.cabecera-foto`): lo llevan la
  portada y la cabecera de Servicios. La foto va a sangre, de alto la pantalla
  entera menos la cabecera, con un velo de `--azul-hondo` encima y el texto por
  delante. El velo es una variable por instancia y no un número fijo, porque
  las dos fotos no piden lo mismo: la de Servicios es código en pantalla, casi
  negra (0,9 donde hay texto, 0,6 donde no), y la de la portada una ilustración
  de barrio a plena luz (0,86 y 0,22). Se mantiene plano hasta pasado el texto
  —48 % en ancho, 72 % en alto— y solo abre después, para que la última línea
  no se quede sin suelo. En ancho abre hacia la derecha, que es donde está la
  maqueta y donde el barrio tiene que verse; en estrecho, hacia abajo.
  Son las dos únicas fotos del sitio; todo lo demás son motivos de CSS,
  la maqueta o capturas de webs de verdad.

## Los motivos

Cuatro. Los tres primeros son CSS puro, sin imágenes; el cuarto es el logo:

1. **Toldo** (`.toldo`): franjas verticales con el borde inferior festoneado
   mediante dos capas de `mask` (círculos repetidos abajo, rectángulo arriba).
   El radio del festón **es la mitad de la raya**, no un valor suelto: así cada
   luna es media circunferencia entera del ancho de su raya y toca con la de al
   lado, sin muescas planas entre medias. El corte se difumina 0,75 px en
   medida absoluta, para que el borde no dentee también en el toldo fino.
   Va bajo la cabecera de todas las páginas, sobre cada escaparate en vivo y —
   desde el 18/08/2026— dentro del bloque de llamada de la portada. Ahí es el
   único que va **dentro** y no colgando: entre festón y festón se ve el propio
   azul del bloque, que es lo que se busca. Colgando, se vería la baldosa de la
   sección y parecería roto.
2. **Persiana** (`.persiana`): lamas en `repeating-linear-gradient`. Cubre el
   marco hasta que hay algo que enseñar.
3. **Reflejo** (`.escaparate__lienzo::after`): una diagonal clara que barre el
   cristal al pasar el ratón.
4. **Marca de agua** (`body::before`): el logo del estudio repetido en trama,
   nítido y quieto, detrás de todo el contenido de las diez páginas. Es el
   único motivo que no es CSS puro: la baldosa es `assets/img/fondo-logo.svg`,
   200×200 con dos logos de 64 en medio salto, que teje una retícula diagonal
   en vez de una cuadrícula de sellos alineados. El hueco entre logos va dentro
   del SVG porque la celda de un `background` repetido mide lo que mida
   `background-size` y el dibujo la llena entera.
   La capa va `fixed`, cubriendo el viewport, con `z-index: -1`: se pinta sobre
   el color del lienzo y **por debajo de cualquier franja con color**, así que
   solo asoma en los tramos de baldosa y las franjas azules le pasan por
   delante al desplazar, como el marco de un escaparate. No se mueve nunca ni
   tiene transición. En impresión no sale.
   La opacidad, 0,06, es un techo medido y no una preferencia: el bermellón de
   texto (`--accion-tinta`) sobre la baldosa limpia ya va justo, en 5,09:1, y
   con la trama detrás se queda en 4,50:1. Lo que da presencia con ese techo no
   es la opacidad, es la repetición: el ojo lee la trama aunque cada píxel
   apenas se despegue del fondo. La primera versión era un solo logo grande y
   desenfocado y a la misma opacidad no se veía; por eso se cambió.

## La llamada de la portada

Desde el 18/08/2026 la web **no publica precios**. Las tres filas de la oferta
tenían el precio de entrada en la tercera columna; ahora esa columna es la
flecha, que es lo único que quedaba por decir —la fila entera es un enlace y
necesita enseñar que se puede pulsar—, y se desplaza 5 px al pasar por encima,
igual que el filete de color del borde superior.

Debajo va `.llamada`, que ocupa el hueco que dejaron los tres precios y **tiene
que pesar más que las filas de arriba**: sin cifra en la fachada, el visitante
necesita una razón grande para dar el paso siguiente. De ahí el suelo azul
dentro de una sección clara, el toldo encima, el gancho a cuerpo de titular y
un solo botón, sin segunda acción que le reste. Debajo del botón, la única
letra pequeña que hay: gratis, sin compromiso y sin llamada comercial detrás.

A 390 px el botón se aprieta (cuerpo y relleno menores) porque «Solicitar
presupuesto» a cuerpo grande se parte en dos líneas, y un botón principal de
dos líneas parece un párrafo con borde.

## La maqueta de la portada

La portada enseña la caseta del estudio girando (`.giro`). Son **48 fotogramas
de un modelo 3D, uno cada 7,5°**, con el fondo transparente y apilados uno
encima de otro.

**No gira sola** (18/08/2026, decisión de Dario). El movimiento es únicamente
del visitante: arrastrando o con las flechas. Antes daba vueltas por su cuenta
cada 300 ms y había un botón de parar, que ya no existe.

**No hay transición ninguna entre fotogramas.** El giro está dentro de las
imágenes: se enseña el que toca y se esconde el anterior. Cualquier fundido o
transformación de por medio mezcla dos posiciones distintas del volumen y
emborrona el movimiento en vez de suavizarlo.

**El recorte de los 48 es el mismo**, calculado sobre la unión de las siluetas
de la vuelta entera (640 × 348). Si cada fotograma se ajustase al suyo, la
caseta bailaría dentro del cuadro. Como la peana es cuadrada, de esquina llena
el ancho y de frente ocupa dos tercios: eso es lo que hace un plato giratorio.

- **Arrastre:** 9 px de dedo = un fotograma = 7,5°; 432 px la vuelta entera.
  Hacia la derecha sube el índice, porque al avanzar un fotograma la esquina de
  delante se va hacia la derecha; así la caseta va con el dedo.
- **Flechas:** cada una da **un cuarto de vuelta** —12 fotogramas a 34 ms, unos
  0,4 s— pasando por todos los de en medio. Un solo fotograma a 7,5° no se ve
  como un giro, se ve como un parpadeo. Bajo `prefers-reduced-motion` salta
  directa al destino sin recorrerlo.
- Las dos flechas van en el mismo `.conmutador` que el resto del sitio. El pie
  solo aparece cuando la maqueta está cargada: si no hay giro, no hay nada que
  arrastrar ni ninguna flecha que pulsar.
- Detrás lleva un halo turquesa muy tenue: la caseta es azul marino sobre el
  azul de azulejo del fondo y sin él se pierde el canto de las fachadas.
- **699 KB los 48 en WebP**, y por eso bajan escalonados. Con la página solo
  llega el primero (19 KB, con su PNG de respaldo en un `<picture>`); después,
  `sitio.js` pide **uno de cada cuatro** (12 fotogramas, 177 KB — con eso ya se
  da la vuelta entera a saltos de 30°), luego **uno de cada dos** (24, 331 KB) y
  por último **todos**. La última tanda **solo de 768 px de ancho para arriba**:
  en un móvil la maqueta se ve a 354 px y con 24 fotogramas ya no se distinguen
  los saltos. Tampoco se piden más si el navegador dice `saveData` o red de 2G.
  Mientras falten, se enseña el fotograma cargado más próximo al pedido; la
  cuenta del giro va aparte, así que al llegar una tanda nueva el gesto sigue
  donde estaba. Si la primera tanda falla, la maqueta se queda quieta en el
  primer fotograma en vez de girar con agujeros.

## Movimiento

**Un solo momento autorizado: la persiana sube.** `translateY(-101%)` con
`cubic-bezier(0.16, 1, 0.3, 1)` en 0.85 s, más el desvanecido encadenado.
Es la respuesta a la única acción que importa en el espejo.

Lo demás son transiciones de estado cortas (0.16–0.25 s) en botones, filas y
fichas. El giro de la portada no lleva transición: la lleva dentro. No hay animación de entrada por
sección: solo la rejilla del portfolio usa `.entra`, una vez.

`prefers-reduced-motion: reduce` anula transiciones, animaciones y el
desplazamiento suave. La maqueta ya no arranca sola bajo ninguna preferencia; lo
único que cambia esa opción es la flecha, que salta directa al cuarto de vuelta
en lugar de recorrerlo.

## Estados

Cubiertos y verificados en navegador:

- **Botones:** reposo, hover con elevación, activo, deshabilitado.
- **Formulario:** vacío, error por campo con mensaje propio (no genérico),
  corregido en caliente al escribir, aviso general con `aria-live`.
- **Capturas:** cerrado, cargando (barra de barrido), abierto, error con motivo,
  «CARGANDO» mientras llega la miniatura y «EN OBRA» para el proyecto sin
  dirección. El gris de 400×300 con el que mShots contesta mientras genera se
  rechaza y pasa el turno al siguiente servicio, en vez de colarse como si
  fuera la web.
- **Filtros:** con resultados y vacío con frase propia.
- **Visor:** siempre en vivo —la miniatura ya era la captura, repetirla dentro
  del visor no añadía nada—, con escritorio / móvil, «Abrir web» y aviso a los
  3,5 s cuando una web no permite mostrarse dentro de otra.

## Accesibilidad

- Contraste medido en las siete páginas a 390 px y 1440 px: sin fallos.
- Salto al contenido, foco visible en bermellón a 3 px (con el tono cambiado
  según el suelo), `aria-current` en el menú.
- Visor con `role="dialog"`, `aria-modal`, foco atrapado, `Esc` para cerrar y
  devolución del foco al origen.
- Menú de móvil con `aria-expanded` y `aria-controls`.

## Lo que no se hace

Sin gradiente en el texto, sin cristal esmerilado decorativo, sin bordes de
color de más de 1 px en el lateral de las fichas, sin números de sección salvo
en el método —donde la secuencia es la información—, sin monoespaciada de
disfraz y sin tarjetas dentro de tarjetas.

## Estructura

```
index.html · diseno-web.html · trabajos.html · como-trabajo.html
sobre-mi.html · presupuesto.html · 404.html
assets/css/estilos.css     Sistema completo, un solo archivo
assets/js/proyectos.js     Datos del portfolio (lo único que se toca a menudo)
assets/js/escaparates.js   Motor de capturas, fichas y visor
assets/js/sitio.js         Menú, año, entrada y validación del formulario
```

Sin build, sin dependencias, sin módulos ES: los `<script>` son clásicos a
propósito, para que la web funcione abriendo el archivo con doble clic.

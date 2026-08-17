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

## Los motivos

Tres, y los tres son CSS, sin imágenes:

1. **Toldo** (`.toldo`): franjas verticales con el borde inferior festoneado
   mediante dos capas de `mask` (círculos repetidos abajo, rectángulo arriba).
   El radio del festón **es la mitad de la raya**, no un valor suelto: así cada
   luna es media circunferencia entera del ancho de su raya y toca con la de al
   lado, sin muescas planas entre medias. El corte se difumina 0,75 px en
   medida absoluta, para que el borde no dentee también en el toldo fino.
   Va bajo la cabecera de todas las páginas y sobre cada escaparate en vivo.
2. **Persiana** (`.persiana`): lamas en `repeating-linear-gradient`. Cubre el
   marco hasta que hay algo que enseñar.
3. **Reflejo** (`.escaparate__lienzo::after`): una diagonal clara que barre el
   cristal al pasar el ratón.

## La maqueta de la portada

Desde el 17/08/2026 la portada enseña la caseta del estudio dando la vuelta
(`.giro`). Son **cuatro renders del mismo modelo a 90°** con el fondo recortado
y superpuestos.

**El paso de una vista a la siguiente es un giro en 3D, no un fundido.** Con
`perspective: 1500px` en el lienzo, la vista que entra llega torcida 38° y se
endereza mientras aparece, y la que sale sigue de largo otros 38° hacia el
mismo lado mientras se va. Las dos giran a la vez y en el mismo sentido, y eso
es lo que el ojo lee como una vuelta en lugar de como un cambio de diapositiva.
Dura 0,34 s.

El signo importa: un `rotateY` positivo aleja el canto derecho, o sea que la
fachada delantera se va hacia la izquierda del que mira, que es justo el
sentido en el que gira la caseta de una foto a la siguiente. Al revés, el
volumen gira hacia un lado y las fotos cuentan que va hacia el otro.

Sigue sin ser un giro natural, y no puede serlo: **cuatro fotogramas son saltos
de 90°**. Lo natural pide uno cada 10–15°, o sea 24–36 vistas.

- Gira sola cada 2,6 s **hasta que el visitante toca algo**. En cuanto arrastra
  o pulsa, manda él y no vuelve a arrancar sola.
- Se puede arrastrar (64 px de dedo = un cuarto de vuelta) y hay tres botones,
  con el mismo `.conmutador` que el resto del sitio. Con el modelo agarrado no
  hay ni giro ni fundido: la vista va pegada al dedo.
- Detrás lleva un halo turquesa muy tenue: la caseta es azul marino sobre el
  azul de azulejo del fondo y sin él se pierde el canto de las fachadas.
- **WebP con el PNG de respaldo**, en `<picture>`: 142 KB las cuatro, frente a
  1.536 KB en PNG. Solo la primera vista se carga con la página; las otras tres
  se piden al terminar de cargar.

## Movimiento

**Un solo momento autorizado: la persiana sube.** `translateY(-101%)` con
`cubic-bezier(0.16, 1, 0.3, 1)` en 0.85 s, más el desvanecido encadenado.
Es la respuesta a la única acción que importa en el espejo.

Lo demás son transiciones de estado cortas (0.16–0.25 s) en botones, filas y
fichas, más el fundido del giro de la portada. No hay animación de entrada por
sección: solo la rejilla del portfolio usa `.entra`, una vez.

`prefers-reduced-motion: reduce` anula transiciones, animaciones y el
desplazamiento suave. La maqueta **no arranca sola** bajo esa preferencia, pero
si se pulsa «Girar» se le da: la preferencia es sobre lo que pasa sin pedirlo.

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

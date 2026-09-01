# Antes de publicar

Diez apartados. El primero es el único obligatorio; sin él la web publica plazos
que no has decidido tú. Nombre y dominio ya están cerrados: **El Escaparate**, en
`elescaparateweb.com`.

Última revisión: 27/08/2026.

---

## 1. Los plazos y el mantenimiento ⚠️ OBLIGATORIO

**Los precios de entrada se retiraron el 18/08/2026**, a petición tuya. La web
ya no publica ninguna tarifa: los tres formatos llevan a `/presupuesto` y el
argumento pasa a ser «precio cerrado por escrito antes de empezar». Si algún día
quieres volver a enseñarlos, el sitio donde estaban es la tercera columna de
`.oferta__fila` en `index.html` —hoy la flecha— y un `<div><dt>Desde</dt>` en
cada `<dl class="datos">` de `diseno-web.html`.

Lo que sigue publicado y **sigue siendo un valor por defecto que me inventé yo**
son los plazos. Revísalos uno por uno.

| Formato | Plazo puesto |
|---|---|
| Una página | 1 a 2 semanas |
| Multipágina | 2 a 4 semanas |
| Tienda | 4 a 6 semanas |

Dónde aparecen: un `<dl class="datos">` por formato en `diseno-web.html`, y
«Entrega entre 1 y 4 semanas» en el sello de la portada.

### El mantenimiento, sin cifra

**La web ya no dice cuánto cuesta** (19/08/2026, decisión tuya). Dice que existe,
qué cubre y que no tiene permanencia; el importe se da en el presupuesto, con lo
demás. Si algún día quieres publicarlo, los sitios son cuatro: el titular de
`#mantenimiento`, la fila «Cuota» de su lista de datos, el desplegable «¿Hay
cuota mensual?» y el sello de la portada.

**Lo que entra y lo que no lo escribí yo**, a partir de lo que ya decía tu
pregunta frecuente «¿Hay cuota mensual?». Léelo y confirma que te comprometes a
eso, porque está publicado como una lista cerrada:

- Cambios menores: horarios, teléfonos, fotos, un texto que ha dejado de ser cierto.
- Copia de seguridad guardada aparte.
- Revisión de que la web sigue en pie y de que el certificado no ha caducado.
- Aviso con tiempo para renovar el dominio.
- Se pausa cualquier mes, sin permanencia.

Está en `diseno-web.html`, sección `#mantenimiento`, más el sello de la portada
(«Mantenimiento opcional después de publicar»), el desplegable «¿Hay cuota
mensual?» y la etiqueta `<meta name="description">` de `diseno-web.html`.

Lo mismo con las condiciones que escribí porque son las habituales, pero que
son tuyas: **mitad y mitad**, **dos rondas de cambios**, **un mes de ajustes**,
**contesto en un día laborable**. Están en `como-trabajo.html`, `diseno-web.html`
(desplegables) y `presupuesto.html`.

## 2. El teléfono ✓ ya está puesto

**684 08 24 90**, en el pie de las seis páginas con pie completo y en la lista
«Si prefieres el camino corto» de `presupuesto.html`. Va de dos formas:

- `https://wa.me/34684082490` abre el chat de WhatsApp directamente.
- `tel:+34684082490` marca desde el móvil.

Si algún día cambias de número, búscalo como `684082490` y aparece en los siete
sitios.

## 3. El correo ✓ hecho

**contacto@elescaparateweb.com**, del propio dominio, dado de alta y probado que
recibe. Está en el pie de las seis páginas con pie completo, en la lista «Si
prefieres el camino corto» de `presupuesto.html`, en el aviso legal, en la
política de privacidad y en el atributo `data-correo` del formulario.

Si algún día la cambias, búscala como `contacto@elescaparateweb.com` y aparece
en los diez sitios.

Mientras tanto no te quedas incomunicado por ningún lado: el WhatsApp funciona
desde el primer día y el formulario tiene su propio botón para él.

## 4. El nombre y el dominio ✓ ya están puestos

Marca **El Escaparate**, dominio **elescaparateweb.com**, ya escritos en el
título, la cabecera, el pie, las etiquetas de redes, `robots.txt` y
`sitemap.xml`. No hay que tocar nada.

Dos cosas para el futuro:

- El portfolio se llama **Trabajos** en el menú. Ha tenido tres nombres: era
  «Escaparates» —confundía con el nombre del estudio—, pasó a «La calle» y el
  17/08/2026 a «Trabajos», porque «La calle» no se entendía a la primera. La
  dirección `/trabajos` no ha cambiado en ningún momento.
- Si algún día consigues `elescaparate.com` —ahora mismo lo tiene alguien que
  lo vende— no hace falta rehacer nada: se compra, se apunta al mismo sitio y
  se cambia el dominio en `<link rel="canonical">`, en las `og:url`, en
  `robots.txt` y en `sitemap.xml`. Media hora.

## 5. El logotipo

Es un SVG dibujado a mano en `favicon.svg` y repetido en la cabecera de cada
página: un toldo a rayas sobre un escaparate. No depende de ninguna tipografía
ni de ningún programa. Si algún día encargas un logotipo de verdad, lo único
que hay que sustituir es ese `<svg>`.

---

## 6. El portfolio

Todo vive en `assets/js/proyectos.js`. **Solo hace falta la URL**: la miniatura
se genera sola desde fuera.

```js
{
  url: "https://blacklilitattoos.com",  // ← lo único imprescindible
  nombre: "Black Lili Tattoos",
  oficio: "Estudio de tatuaje",
  tipo: "multipagina",                  // una-pagina · multipagina · tienda
  anio: "2026",
  destacado: true,                      // sale en la portada (deja tres)
  espera: 10,                           // ver abajo
  nota: "Galería de artista y solicitud de cita sin llamadas."
}
```

**El campo `espera`** son los segundos que el servicio aguanta con la web
abierta antes de disparar. Ponlo solo en las que tienen animación de entrada:
Black Lili enseña el logo unos segundos y, sin esperar, la miniatura salía con
el logo en vez de la página. Máximo 20.

Tiene un efecto que conviene saber: **cuando pones `espera`, la captura se pide
a Microlink**, porque es el único de los tres que la respeta de verdad. Lo
comprobé midiendo — thum.io acepta el parámetro y devuelve exactamente la misma
imagen, así que no sirve. Microlink es algo más lento y tiene un límite diario
de uso gratuito más justo; por eso no se le pasa todo, solo las fichas que lo
necesitan.

Y una consecuencia importante: **en las fichas con `espera` no se acepta
sustituto**. Si Microlink falla se le da un segundo intento, y si tampoco, la
ficha dice «SIN CAPTURA». Antes la cadena caía en thum.io, que dispara al
instante, y salía el logo del intro de la web de un cliente como si fuera su
web — se veía sobre todo al abrir el visor, porque cada vista pide una captura
nueva. Es mejor un hueco honesto que una captura falsa de un trabajo tuyo.

En el escaparate del visitante —«Mira tu web como la ve un desconocido» y
«Pruébalo con la web que quieras»— sí se permite el relevo: ahí puede entrar
cualquier dirección y enseñar algo vale más que no enseñar nada.

Los otros cuatro proyectos siguen con `url: ""` y salen con el cartel **EN
OBRA**, que es lo honesto mientras no estén publicados. En cuanto pegues una
dirección, esa ficha se ilumina sola.

Si una miniatura sale con el logo del intro, súbele la `espera`. Si sale un
rectángulo gris, es que el servicio todavía la estaba generando: recarga al
minuto y ya estará (la primera captura de una web nueva puede tardar más de
medio minuto; a partir de ahí es instantánea).

**Si pone «SIN CAPTURA» y habla del cupo**, es el límite gratuito de Microlink:
**25 peticiones al día, y se cuentan por visitante**, no en total. A un visitante
normal le sobran de largo; el único que lo agota eres tú probando y recargando.
Se repone solo en unas horas. Para que no vuelva a pasar, la dirección de cada
captura buena se guarda en el navegador durante 30 días: recargar la página ya
no gasta ninguna petición.

Revisa también el campo `tipo` de cada uno: los he puesto todos como
`multipagina` a ojo y tú sabes cuál era cada encargo.

## 7. El formulario

Tiene **dos salidas** y el visitante elige. Los dos botones validan lo mismo
antes de dejar pasar nada, y los dos mandan el mismo texto ordenado: quién es,
qué cuenta, formato, presupuesto, web actual y sus datos de contacto.

**Enviar por WhatsApp** (botón principal). Abre tu chat con el mensaje ya
escrito; al visitante solo le queda darle a enviar. No depende de ningún
servicio ni de que tengas el correo montado: hoy ya funciona. El número sale de
`data-whatsapp` en la etiqueta `<form>`.

**Enviar por correo.** Va a `contacto@elescaparateweb.com` abriendo el programa
de correo del visitante con el mensaje ya escrito. Funciona, pero pierdes
contactos por el camino: mucha gente no tiene configurado el correo en el
ordenador (para esos está el cartel salvavidas del apartado siguiente).

El formulario **no tiene `action`**, y eso es a propósito. Llevó un `mailto`
cinco días, como camino de respaldo para quien no ejecute JavaScript, y salía
caro: Chrome llama «formulario mixto» al que vive en una página `https` y envía
a un destino que no lo es —y `mailto:` no lo es—, así que **apagaba el
autocompletado** justo en los campos donde más se agradece (nombre, negocio,
correo y teléfono) y avisaba al visitante de que el formulario no era seguro.
Quien no tenga JavaScript tiene igualmente el WhatsApp y la dirección de correo
como enlaces sueltos, ahí mismo debajo del formulario, y esos no disparan nada.

Para que los mensajes caigan en tu bandeja pase lo que pase, sin depender del
programa de correo del visitante, hace falta un servicio de formularios
(Formspree, Basin, Web3Forms; todos con plan gratuito). **Eso tienes que darlo
de alta tú**, porque exige una cuenta a tu nombre. Cuando tengas el endpoint,
en la etiqueta `<form>` de `presupuesto.html`:

```
action="https://…el endpoint que te den…"   ← esta línea se añade
method="POST"                                ← ya está puesta, se queda
```

Y ya está: el código reconoce el endpoint porque empieza por `https://` y envía
directamente, sin tocar nada más. Al ser `https`, tampoco vuelve el aviso de
Chrome.

**Si el visitante no tiene correo configurado** —mucha gente no lo tiene, usa
el correo dentro del navegador— un enlace `mailto:` no abre nada y el clic
parece roto. Por eso, tanto ahí como en los enlaces del pie, si al segundo del
clic seguimos en la página se enseña un cartel con dos salidas que siempre
funcionan: escribir desde el correo web o copiar la dirección al portapapeles.
Si el programa de correo sí se abre, el cartel no llega a aparecer.

Pulsar Enter dentro de un campo equivale al botón principal, el de WhatsApp.
El campo trampa `_apellido` sigue ahí para el spam: si un robot lo rellena, el
mensaje no sale por ninguna de las dos vías.

## 8. Tu biografía ✓ la foto ya está — faltan los dos párrafos

`sobre-mi.html` habla de cómo trabajas, que es verdad y es lo que vende, pero no
cuenta nada que solo puedas contar tú: de dónde vienes, desde cuándo, dónde
vives, por qué acabaste haciendo esto. Dos párrafos tuyos valen más que toda la
página.

Desde el 01/09/2026 la cabecera de esta página lleva la ilustración del
escritorio (`assets/img/fotoyo.webp`), así que la cara del estudio ya está
puesta. Lo que sigue faltando son **los dos párrafos**.

**El bloque ya está montado y comentado** al principio del `<main>` de
`sobre-mi.html`, desde el 27/08/2026. Va comentado y no con texto de relleno a
propósito: un párrafo inventado sobre tu vida, publicado, es peor que un hueco.
No estrena ni una regla de CSS —reutiliza `.bloque-servicio` y `.marco`—, así
que mientras esté comentado no pesa nada.

Para activarlo:

1. Escribe los dos párrafos donde pone `PRIMER PÁRRAFO` y `SEGUNDO PÁRRAFO`.
2. Si algún día tienes un retrato de verdad, déjalo en `assets/img/` —mejor
   apaisado o cuadrado, que el marco recorta a 4:3 y ancla arriba— y sustituye
   la línea `AQUÍ-LA-FOTO` por esta etiqueta, con el nombre y las medidas
   reales de tu archivo. Si no lo tienes, borra ese `div` entero: el bloque
   funciona a una columna.

   ```
   <img src="/assets/img/dario.jpg" alt="Retrato de Darío Domínguez García" width="800" height="600">
   ```

   La etiqueta vive aquí y no dentro del propio comentario del HTML porque
   `detect.mjs` lee dentro de los comentarios y la contaría como imagen rota.
   Es la trampa que ya está apuntada en la sección 5 de `CLAUDE.md`.
3. Quita el comentario de alrededor.

## 9. Textos legales ✓ escritos — falta el NIF y el domicilio, por decisión tuya

Ya están escritas las tres páginas y enlazadas en la barra de abajo de todas:
`aviso-legal.html`, `privacidad.html` y `cookies.html`.

Como titular y responsable figura **Darío Domínguez García**, y nada más: el
NIF y el domicilio se dejaron fuera por decisión tuya el 07/08/2026.

Conviene que sepas lo que eso implica, sin dramatizarlo: el artículo 10 de la
LSSI pide que un profesional que ofrece servicios por internet publique también
su **NIF y su domicilio**. Con solo el nombre, el aviso legal se queda corto
frente a esa norma. Si algún día quieres completarlo, va en el primer párrafo de
`aviso-legal.html` y en el mismo sitio de `privacidad.html`; está señalado con
un comentario en los dos archivos.

Lo demás está escrito según lo que la web hace **de verdad**, comprobado
funcionalidad por funcionalidad: qué recoge el formulario, qué proveedores
intervienen (Vercel, Google, WhatsApp y los tres servicios de captura), qué se
guarda en el navegador y cuánto duran los datos. Ojo con un detalle que ya se
quedó viejo una vez: las dos políticas decían que las tipografías se cargaban
desde servidores de Google, y desde que se sirven de aquí eso era una cesión de
datos declarada que no ocurría. Corregido el 26/08/2026.

**Desde el 26/08/2026 hay Google Analytics 4** (identificador
`G-97JZNBDJE6`), por decisión tuya. La página de cookies ya lo cuenta: las dos
cookies (`_ga` y `_ga_97JZNBDJE6`, sin la «G-» del identificador, que Google se
come al nombrarla; comprobado en el navegador), lo que guardan, los dos años que duran y
las tres formas de quitarlas. La de privacidad tiene su apartado propio y a
Google en la lista de destinatarios.

**El aviso previo ya está puesto**, ese mismo día. Sale abajo a la izquierda en
la primera visita, con el toldo encima para que no parezca pegado de otra web,
y tiene dos botones del mismo tamaño: aceptar y rechazar. Hasta que alguien
acepta no se descarga nada de Google, así que se cumple el artículo 22.2 de la
LSSI sin depender de la buena fe de nadie. Si rechaza, se le caducan las
cookies que pudiera tener de antes. Vive en `sitio.js` y en la sección 17 ter
del CSS; no hay archivos nuevos.

Y dos ajustes en el panel de Analytics que no puedo hacer yo: fijar la
conservación de datos en 14 meses (viene en 2) y desactivar las señales de
Google si no vas a hacer publicidad. La política dice «no supera los catorce
meses», que es cierto con cualquiera de las dos opciones.

Si algún día añades además un mapa incrustado, un chat o un píxel de
publicidad, esas páginas vuelven a quedarse cortas. Está avisado en un
comentario dentro de cada archivo.

Los plazos de conservación que he puesto (un año las consultas, seis años la
documentación contable) son los habituales; si tu gestoría te dice otros,
cámbialos.

Y una cosa que no puedo hacer yo: esto es una base sólida y honesta, no un
dictamen jurídico. Si mueves mucho dato o algún cliente te lo exige, que un
abogado le eche un ojo.

## 10. Lo que se añadió el 27/08/2026, y qué te toca a ti de ello

Cuatro cosas que ya están publicadas y no piden nada tuyo, más dos que sí.

**Madrid, publicado.** La web no decía en ningún sitio dónde estás, y para quien
vende a negocio local eso es lo que más pesa en el buscador. Ahora sale en el
pie de las nueve páginas, en la entrada y en los sectores de `sobre-mi.html`, y
en las etiquetas `description` de portada, servicios y estudio. Si algún día te
mudas, búscalo como `Madrid` y aparece en los ocho sitios.

**La tarjeta para compartir.** `og-escaparate.png`, en la raíz. Es lo que se ve
cuando alguien pasa tu enlace por WhatsApp; antes no había imagen ninguna. Está
dibujada con el logo y las tipografías de la web, así que no hay original en
otro programa que guardar. Si algún día cambia el logo, se vuelve a generar.

**La medición ya cuenta contactos, no solo visitas.** En Analytics tienes cuatro
eventos nuevos: `envio_whatsapp` y `envio_correo` (los dos botones del
formulario) y `clic_whatsapp` y `clic_telefono` (cualquier enlace de la web, con
un campo `origen` que dice si fue en el pie o en el cuerpo). El formulario en
blanco no cuenta nada: solo cuenta cuando el envío sale de verdad.

**Se puede retirar el consentimiento de cookies.** Botón en `/cookies`, en el
apartado de revocación. Antes aceptar era un botón y rechazar después era irse a
la configuración del navegador, y el RGPD pide que cuesten lo mismo.

Y las dos que sí son tuyas:

- **El `www` no funciona.** `www.elescaparateweb.com` no existe: no hay registro
  DNS. Quien lo escriba por costumbre no llega. Se arregla en Vercel
  (*Settings → Domains → Add*), creando el `CNAME` que te indique en tu
  proveedor del dominio y eligiendo *Redirect* al dominio a secas. No hay nada
  que cambiar en el repositorio.
- **Los `lastmod` del sitemap.** Hay que tocarlos cuando publiques cambios de
  contenido. Están explicados dentro del propio `sitemap.xml`.

---

## Cómo trabajar con esto

```bash
node _dev-servidor.js
```

Y abre `http://localhost:5174`. No hay build, no hay npm, no hay nada que
compilar, pero **el servidor sí hace falta**: desde el 17/08/2026 los enlaces
internos van sin extensión (`/diseno-web`, no `diseno-web.html`) y bajo `file://`
nadie los resuelve, así que abrir `index.html` con doble clic deja la navegación
muerta. Esta página decía lo contrario hasta el 27/08/2026.

## Las direcciones de cada página

| Página | Dirección | Por qué |
|---|---|---|
| Portada | `/` | — |
| Servicios | `/diseno-web` | Es lo que la gente escribe en Google |
| Trabajos | `/trabajos` | Corto y en español; «portfolio» no lo busca nadie |
| Cómo trabajo | `/como-trabajo` | Igual que el título de la página |
| El estudio | `/sobre-mi` | La dirección que todo el mundo espera de un «quién soy» |
| Contacto | `/presupuesto` | Es lo que se busca con intención de contratar |

Las antiguas (`/servicios`, `/portfolio`, `/metodo`, `/estudio`, `/contacto`)
redirigen con un 301 permanente a la nueva, así que ningún enlace se rompe.

Los archivos siguen llamándose `.html`, pero **los enlaces del código ya no
llevan la extensión**: son absolutos de raíz (`/diseno-web`). Se cambió el
17/08/2026 para ahorrarse el salto 308 que costaba cada clic del menú, y la
contrapartida es que la web ya no se abre con doble clic. **El `.html` lo quita
el servidor**, no el código:

- **Vercel**, que es donde está la web: lo hace `vercel.json` con `cleanUrls`.
  Ese archivo tiene que subir con el resto o las direcciones limpias dan 404.
- **Hosting clásico por FTP (Apache):** sube el `.htaccess`, que hace lo mismo
  más la página de error. Es un archivo oculto: en el explorador de Windows
  activa «Elementos ocultos» o no lo verás al arrastrar.

`canonical`, `og:url` y `sitemap.xml` apuntan a las direcciones limpias, que son
las que indexa Google.

Para publicar: sube la carpeta al repositorio y Vercel despliega solo. No subas
`_dev-servidor.js`, `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md` ni este archivo.

## Un aviso sobre las capturas

Las miniaturas se piden a servicios públicos de screenshots: thum.io, mShots de
WordPress y Microlink. Si uno falla se prueba el siguiente, y el orden cambia
según el caso — con `espera` manda Microlink, sin ella manda thum.io, que es el
más rápido.

El escaparate donde el visitante pega su dirección espera **10 segundos** antes
de disparar, para que no salga el logo del intro de su web. Se nota: la captura
tarda esos diez segundos más, y por eso la persiana enseña que está trabajando.
Si algún día prefieres velocidad a fidelidad, es un solo número —
`ESPERA_VISITANTE`, arriba del todo de `assets/js/escaparates.js`.

Eso significa dos cosas más:

- **La dirección viaja a ese servicio.** Es información pública, pero conviene
  que lo sepas. Está dicho en la página de escaparates.
- **Son gratuitos con límites.** Para un portfolio de diez proyectos sobra. Si
  algún día tienes mucho tráfico y empiezan a fallar, la solución es guardar las
  capturas en `assets/img/` y poner esa ruta; el código ya prevé el fallo con un
  cartel en vez de un hueco roto.

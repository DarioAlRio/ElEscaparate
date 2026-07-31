# Antes de publicar

Ocho cosas. Las dos primeras son obligatorias; sin ellas la web dice cosas que
no has decidido tú. Nombre y dominio ya están cerrados: **El Escaparate**, en
`elescaparateweb.com`.

---

## 1. Los precios y los plazos ⚠️ OBLIGATORIO

Los números que hay puestos son **valores por defecto que me he inventado para
que la maqueta sea real**. No son tu tarifa. Revísalos uno por uno.

| Formato | Precio puesto | Plazo puesto |
|---|---|---|
| Una página | 400 € | 1 a 2 semanas |
| Multipágina | 700 € | 2 a 4 semanas |
| Tienda | 1.200 € | 4 a 6 semanas |

Dónde aparecen:

- `index.html` → bloque `<!-- PRECIOS -->`, las tres filas de la oferta.
- `diseno-web.html` → un `<dl class="datos">` por formato, y la etiqueta
  `<meta name="description">` de arriba, que también los repite.
- `index.html` → «Entrega entre 1 y 4 semanas» en el sello de la portada.

Lo mismo con las condiciones que he escrito porque son las habituales, pero que
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

## 3. El correo ✓ puesto, provisional

**elescaparatewebcontacto@gmail.com**, en el pie de las seis páginas con pie
completo, en la lista «Si prefieres el camino corto» de `presupuesto.html` y en
el atributo `data-correo` del formulario.

Es una dirección **de momento**: un Gmail tuyo, que funciona desde el primer día
y no depende de configurar nada. Vale de sobra para empezar a recibir encargos.

Cuando quieras dar el paso al correo del dominio —`hola@elescaparateweb.com` o
el nombre que elijas—, la vía más rápida es el **Email Routing** de Cloudflare:
gratis, sin contratar buzón, reenvía al Gmail que ya usas. Un negocio con correo
del propio dominio da más confianza que uno con Gmail, así que merece la pena
hacerlo antes de empezar a repartir la dirección. Cuando lo tengas, busca
`elescaparatewebcontacto@gmail.com` y aparece en los ocho sitios.

Mientras tanto no te quedas incomunicado por ningún lado: el WhatsApp funciona
desde el primer día y el formulario tiene su propio botón para él.

## 4. El nombre y el dominio ✓ ya están puestos

Marca **El Escaparate**, dominio **elescaparateweb.com**, ya escritos en el
título, la cabecera, el pie, las etiquetas de redes, `robots.txt` y
`sitemap.xml`. No hay que tocar nada.

Dos cosas para el futuro:

- El portfolio se llama **La calle** en el menú, no «Escaparates». Se cambió al
  elegir el nombre: «El Escaparate → Escaparates» confundía.
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

**Enviar por correo.** Depende del `action`, que ahora pone
`PENDIENTE-pon-aqui-tu-endpoint`:

- Mientras siga así, abre el programa de correo del visitante con el mensaje
  escrito. Funciona, pero pierdes contactos por el camino: mucha gente no tiene
  configurado el correo en el ordenador.
- Para recibirlos en tu bandeja, date de alta en un servicio de formularios
  (Formspree, Basin, Web3Forms; todos con plan gratuito) y pega el endpoint que
  te den en ese `action`. A partir de ahí el botón envía de verdad.

**Si el visitante no tiene correo configurado** —mucha gente no lo tiene, usa
el correo dentro del navegador— un enlace `mailto:` no abre nada y el clic
parece roto. Por eso, tanto ahí como en los enlaces del pie, si al segundo del
clic seguimos en la página se enseña un cartel con dos salidas que siempre
funcionan: escribir desde el correo web o copiar la dirección al portapapeles.
Si el programa de correo sí se abre, el cartel no llega a aparecer.

Pulsar Enter dentro de un campo equivale al botón principal, el de WhatsApp.
El campo trampa `_apellido` sigue ahí para el spam: si un robot lo rellena, el
mensaje no sale por ninguna de las dos vías.

## 8. Tu biografía

`sobre-mi.html` habla de cómo trabajas, que es verdad y es lo que vende, pero no
cuenta nada que solo puedas contar tú: de dónde vienes, desde cuándo, dónde
vives, por qué acabaste haciendo esto. Está marcado con
`<!-- BIOGRAFÍA: escríbela tú -->`. Dos párrafos tuyos valen más que toda la
página.

Falta también una foto tuya. Sin ella, «detrás de esto hay una persona» es una
frase; con ella, es un hecho.

## 9. Textos legales

Falta aviso legal, política de privacidad y cookies. Esta web **no pone
cookies** (no hay analítica ni tipografías autoalojadas de terceros con
seguimiento), así que no necesitas banner, pero sí el aviso legal y la política
de privacidad si recoges datos por el formulario. Cuando los tengas, enlázalos
en el `pie__legal`.

---

## Cómo trabajar con esto

```bash
node _dev-servidor.js
```

Y abre `http://localhost:5174`. También funciona abriendo `index.html` con doble
clic: no hay build, no hay npm, no hay nada que compilar.

## Las direcciones de cada página

| Página | Dirección | Por qué |
|---|---|---|
| Portada | `/` | — |
| Qué monto | `/diseno-web` | Es lo que la gente escribe en Google |
| La calle | `/trabajos` | Corto y en español; «portfolio» no lo busca nadie |
| Cómo trabajo | `/como-trabajo` | Igual que el título de la página |
| El estudio | `/sobre-mi` | La dirección que todo el mundo espera de un «quién soy» |
| Contacto | `/presupuesto` | Es lo que se busca con intención de contratar |

Las antiguas (`/servicios`, `/portfolio`, `/metodo`, `/estudio`, `/contacto`)
redirigen con un 301 permanente a la nueva, así que ningún enlace se rompe.

Los archivos siguen llamándose `.html` y los enlaces del código son relativos,
que es lo que permite abrir la web con doble clic sin servidor. **El `.html` lo
quita el servidor**, no el código:

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

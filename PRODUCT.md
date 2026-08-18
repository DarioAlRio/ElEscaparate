# PRODUCT.md — El Escaparate

Contexto duradero del producto. No es documentación de diseño (eso vive en
DESIGN.md) ni instrucciones de personalización (eso vive en PERSONALIZAR.md).

## Qué es

**El Escaparate** es el estudio de Dario Domínguez: diseña y programa webs para
negocios pequeños que ya tienen clientes en la calle y no tienen presencia
decente en internet. Es la web del propio estudio: capta encargos y enseña
trabajo hecho.

Nombre y dominio, decididos el 29/07/2026: **El Escaparate**, en
**elescaparateweb.com**, que es el que estaba libre. El `.com` a secas y el
`.es` los tiene un tercero que los vende. Descartados por el camino:
*Marquesina* y *Chaflán*.

## Mecanismo propio

Pegas la dirección de una web y sale su captura al momento, en escritorio y en
móvil, sin instalar nada. El estudio usa eso para dos cosas:

1. **El portfolio se mantiene solo.** Cada trabajo es una URL; la miniatura se
   genera desde fuera. Dario añade un cliente escribiendo una línea en
   `assets/js/proyectos.js`, no exportando imágenes.
2. **El espejo.** El visitante pega la dirección de su web actual y la ve como
   la ve un desconocido. Nadie discute su propia captura.

   **Dónde está, desde el 17/08/2026: en `/trabajos`, ya no en la portada.**
   Dario pidió que el hueco de la portada lo ocupase la maqueta del estudio
   girando, y que el espejo se quitase de ahí. Sigue entero en `/trabajos`, que
   es la otra página donde ya estaba. Desde el 18/08/2026 la maqueta es la
   vuelta completa de un modelo 3D de la caseta, no cuatro renders sueltos.

## A quién le habla

Dueños de negocio local en España —tatuaje, alimentación, reformas, belleza,
cultura— que deciden solos y en poco tiempo. No son técnicos. Llegan desde el
móvil, muchas veces de noche y con prisa. Lo que necesitan creer: que esto lo
hace una persona concreta, que se entiende el precio y que existe trabajo real
detrás.

## Qué vende

Tres tipos de encargo, sin tarifa publicada y con presupuesto cerrado por
escrito tras hablar:

- Web de una página (tarjeta de presentación con reserva o contacto)
- Web multipágina (catálogo, servicios, historia, contacto)
- Tienda online

**Los precios de entrada dejaron de publicarse el 18/08/2026**, por decisión de
Dario. Hasta entonces el argumento principal era «desde 400 / 700 / 1.200 €», y
era lo que separaba esta web de una agencia. En su lugar, la portada remata los
tres formatos con un bloque de llamada a presupuesto y el sello pasa a ser
«presupuesto cerrado por escrito». Es un cambio de posicionamiento, no de
maquetación: si la conversión cae, esto es lo primero que hay que mirar.

**Mantenimiento voluntario, 8 € al mes** (18/08/2026, decisión de Dario): copias,
revisión y cambios menores, sin permanencia. No entra en ningún formato y tiene
sección propia en /diseno-web.

**Lo que no se ofrece** (2026-07-29, decisión de Dario): aplicaciones web a
medida y rescate de webs ajenas. No los hace, así que no aparecen en ninguna
página, ni en los filtros del portfolio, ni en el formulario.

## Restricciones

- **Sin build.** HTML + CSS + JS a pelo. Se abre el archivo y funciona; se
  publica arrastrando la carpeta. El Node del equipo es el 16.10.
- **Sin backend.** Las capturas se piden a servicios públicos de screenshots y
  el formulario sale por un servicio externo de formularios.
- **Español (es-ES), tuteo, registro formal.** Sin jerga técnica y sin
  coloquialismos en la parte visible. Decisión del 17/08/2026: se mantiene el
  tuteo, que acerca, pero se sube el tono, que antes era demasiado campechano
  para un servicio que se cobra. La metáfora del escaparate se conserva —es la
  marca—; «La calle» se retiró como nombre del portfolio por poco clara y pasa
  a «Trabajos».
- **Multipágina de verdad**, no una sola página con anclas.

## Prueba real disponible

Trabajos hechos para negocios reales: Black Lili Tattoos, El Nido Biblioteca,
Pastor de Adrada, Zarea Beauty Studio y un proyecto de reformas. Sus URLs
públicas las rellena Dario en `assets/js/proyectos.js`; hasta entonces las
fichas se muestran en estado «pendiente de publicar» y nunca inventan una
dirección.

## Lo que no se inventa

Precios, plazos, número de clientes, testimonios y datos de contacto son
compromisos comerciales de Dario. Los que trae el código son valores por
defecto marcados en PERSONALIZAR.md para que los revise antes de publicar.

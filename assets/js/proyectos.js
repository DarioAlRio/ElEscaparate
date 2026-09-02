/* =========================================================================
   EL PORTFOLIO VIVE AQUÍ. Es el único archivo que tocas para añadir trabajo.

   Para añadir un proyecto, copia un bloque y rellena:

     url       Dirección pública, con https://. Es lo único imprescindible:
               la miniatura se genera sola desde fuera. Déjala en "" y la
               ficha sale como «pendiente de publicar», sin inventar nada.
     nombre    Cómo se llama el negocio.
     oficio    A qué se dedica, en dos o tres palabras.
     tipo      una-pagina · multipagina · tienda
               (tiene que coincidir con los filtros de trabajos.html)
     anio      Año de entrega.
     destacado true para que salga en la portada. Deja tres o cuatro.
     nota      Una frase de lo que resolviste. Sale en la ficha y encabeza
               su página de proyecto.
     ficha     Dirección de su página de proyecto, si la tiene:
               "/proyectos/lo-que-sea". Con ella, pulsar la miniatura lleva
               a esa página en vez de abrir el visor. Sin ella, la miniatura
               abre el visor como toda la vida. Cada página es un archivo de
               verdad en proyectos/, no se genera sola: si pones aquí una
               dirección sin crear el archivo, el enlace da 404.
     imagen    Miniatura guardada, con barra inicial. Es la captura de la
               portada del cliente, la misma que enseña su ficha. Sin este
               campo la miniatura se pide en el momento al servicio de
               capturas, que es como funcionaba todo antes del 02/09/2026:
               así un trabajo nuevo se ve enseguida, aunque todavía no se le
               haya guardado el archivo.
     imagen    Miniatura guardada, con barra inicial. Es la captura de la
               portada del cliente, la misma que enseña su ficha. Sin este
               campo la miniatura se pide en el momento al servicio de
               capturas, que es como funcionaba todo antes del 02/09/2026:
               así un trabajo nuevo se ve enseguida, aunque todavía no se le
               haya guardado el archivo.
     espera    Segundos que el servicio aguanta antes de disparar la captura.
               Ponlo solo si esa web tiene animación de entrada: sin esperar,
               la miniatura sale con el logo del intro en vez de la página.
               Máximo 20. Si no lo pones, dispara al cargar.
   ========================================================================= */

/* El orden de aquí es el orden de la calle, con una regla por encima: lo que
   está publicado va delante. No hace falta que la mantengas a mano —el motor
   sube las fichas con dirección antes de pintar—, pero el archivo se deja
   ordenado igual, para que leerlo y ver la web cuenten lo mismo. */

window.PROYECTOS = [
  {
    url: "https://blacklilitattoos.com",
    nombre: "Black Lili Tattoos",
    ficha: "/proyectos/black-lili-tattoos",
    imagen: "/assets/img/webs/black-lili-tattoos.webp",
    imagen: "/assets/img/webs/black-lili-tattoos.webp",
    oficio: "Estudio de tatuaje",
    tipo: "multipagina",
    anio: "2026",
    destacado: true,
    espera: 10,
    nota: "Galería de artista y solicitud de cita sin llamadas."
  },
  {
    url: "https://reformas-aparejo.vercel.app/",
    nombre: "Reformas",
    ficha: "/proyectos/reformas",
    imagen: "/assets/img/webs/reformas.webp",
    imagen: "/assets/img/webs/reformas.webp",
    oficio: "Obra y reforma integral",
    tipo: "multipagina",
    anio: "2026",
    destacado: false,
    nota: "Antes y después de cada obra, y presupuesto en un formulario."
  },
  {
    url: "https://nova-strike-beta.vercel.app/",
    nombre: "Nova Strike",
    ficha: "/proyectos/nova-strike",
    imagen: "/assets/img/webs/nova-strike.webp",
    imagen: "/assets/img/webs/nova-strike.webp",
    oficio: "Videojuego arcade",
    tipo: "una-pagina",
    anio: "2026",
    destacado: false,
    /* El juego se dibuja en un canvas: sin esperar, la captura sale en negro
       porque el script todavía no ha pintado nada. */
    espera: 6,
    nota: "Naves alienígenas y niveles infinitos, en el navegador y sin instalar nada."
  },
  {
    /* Es multipágina aunque sea un solo archivo: navega por rutas de hash
       (#/plantas, #/talleres, #/nosotras). El visitante ve seis páginas. */
    url: "https://clorofila-estudio-botanico.vercel.app/",
    nombre: "Clorofila",
    ficha: "/proyectos/clorofila",
    imagen: "/assets/img/webs/clorofila.webp",
    imagen: "/assets/img/webs/clorofila.webp",
    oficio: "Estudio botánico",
    tipo: "multipagina",
    anio: "2026",
    destacado: true,
    nota: "Catálogo con ficha de herbario por planta, talleres y suscripción mensual."
  },
  {
    url: "https://caboazulbuceo.vercel.app/",
    nombre: "Cabo Azul",
    ficha: "/proyectos/cabo-azul",
    imagen: "/assets/img/webs/cabo-azul.webp",
    imagen: "/assets/img/webs/cabo-azul.webp",
    oficio: "Centro de buceo",
    tipo: "una-pagina",
    anio: "2026",
    destacado: true,
    nota: "Cursos e inmersiones en la reserva marina, con la plaza guardada desde la propia página."
  },
  {
    url: "https://casilla03asesoria.vercel.app/",
    nombre: "Casilla 03",
    ficha: "/proyectos/casilla-03",
    imagen: "/assets/img/webs/casilla-03.webp",
    imagen: "/assets/img/webs/casilla-03.webp",
    oficio: "Asesoría para autónomos",
    tipo: "una-pagina",
    anio: "2026",
    destacado: false,
    nota: "Qué modelos te tocan y cuándo, con el año entero a la vista y las tarifas por delante."
  },
  {
    url: "https://regletaescalada.vercel.app/",
    nombre: "Regleta",
    ficha: "/proyectos/regleta",
    imagen: "/assets/img/webs/regleta.webp",
    imagen: "/assets/img/webs/regleta.webp",
    oficio: "Rocódromo de escalada",
    tipo: "una-pagina",
    anio: "2026",
    destacado: false,
    nota: "Las vías de la semana y las tarifas, sin matrícula ni permanencia."
  },
  {
    url: "",
    nombre: "Beauty Studio",
    oficio: "Centro de belleza",
    tipo: "multipagina",
    anio: "2026",
    destacado: false,
    nota: "Carta de tratamientos con precios y reserva directa."
  },
  {
    url: "",
    nombre: "Biblioteca",
    oficio: "Centro cultural",
    tipo: "multipagina",
    anio: "2026",
    destacado: false,
    nota: "Agenda de actividades que se actualiza sin tocar código."
  }
];

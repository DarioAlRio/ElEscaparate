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
     nota      Una frase de lo que resolviste. Sale en la ficha.
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
    oficio: "Obra y reforma integral",
    tipo: "multipagina",
    anio: "2026",
    destacado: true,
    nota: "Antes y después de cada obra, y presupuesto en un formulario."
  },
  {
    url: "https://nova-strike-beta.vercel.app/",
    nombre: "Nova Strike",
    oficio: "Videojuego arcade",
    tipo: "una-pagina",
    anio: "2026",
    destacado: true,
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
    oficio: "Estudio botánico",
    tipo: "multipagina",
    anio: "2026",
    destacado: false,
    nota: "Catálogo con ficha de herbario por planta, talleres y suscripción mensual."
  },
  {
    url: "https://caboazulbuceo.vercel.app/",
    nombre: "Cabo Azul",
    oficio: "Centro de buceo",
    tipo: "una-pagina",
    anio: "2026",
    destacado: false,
    nota: "Cursos e inmersiones en la reserva marina, con la plaza guardada desde la propia página."
  },
  {
    url: "https://casilla03asesoria.vercel.app/",
    nombre: "Casilla 03",
    oficio: "Asesoría para autónomos",
    tipo: "una-pagina",
    anio: "2026",
    destacado: false,
    nota: "Qué modelos te tocan y cuándo, con el año entero a la vista y las tarifas por delante."
  },
  {
    url: "https://regletaescalada.vercel.app/",
    nombre: "Regleta",
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

/* =========================================================================
   EL PORTFOLIO VIVE AQUÍ. Es el único archivo que tocas para añadir trabajo.

   Para añadir un proyecto, copia un bloque y rellena:

     url       Dirección pública, con https://. Es lo único imprescindible:
               la miniatura se genera sola desde fuera. Déjala en "" y la
               ficha sale como «pendiente de publicar», sin inventar nada.
     nombre    Cómo se llama el negocio.
     oficio    A qué se dedica, en dos o tres palabras.
     tipo      una-pagina · multipagina · tienda
               (tiene que coincidir con los filtros de portfolio.html)
     anio      Año de entrega.
     destacado true para que salga en la portada. Deja tres o cuatro.
     nota      Una frase de lo que resolviste. Sale en la ficha.
     espera    Segundos que el servicio aguanta antes de disparar la captura.
               Ponlo solo si esa web tiene animación de entrada: sin esperar,
               la miniatura sale con el logo del intro en vez de la página.
               Máximo 20. Si no lo pones, dispara al cargar.
   ========================================================================= */

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
    url: "",
    nombre: "Pastor de Adrada",
    oficio: "Quesería de leche cruda",
    tipo: "multipagina",
    anio: "2026",
    destacado: true,
    nota: "El oficio primero y el pedido por WhatsApp a un toque."
  },
  {
    url: "",
    nombre: "Zarea Beauty Studio",
    oficio: "Centro de belleza",
    tipo: "multipagina",
    anio: "2026",
    destacado: true,
    nota: "Carta de tratamientos con precios y reserva directa."
  },
  {
    url: "",
    nombre: "El Nido Biblioteca",
    oficio: "Biblioteca y actividades",
    tipo: "multipagina",
    anio: "2026",
    destacado: false,
    nota: "Agenda de actividades que se actualiza sin tocar código."
  },
  {
    url: "",
    nombre: "Reformas",
    oficio: "Obra y reforma integral",
    tipo: "multipagina",
    anio: "2026",
    destacado: false,
    nota: "Antes y después de cada obra, y presupuesto en un formulario."
  }
];

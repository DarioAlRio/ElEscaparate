/* =========================================================================
   Escaparates — motor de previsualización.

   Pide la captura de una URL a servicios públicos de screenshots, en cadena:
   si el primero falla se prueba el siguiente, y si fallan todos se avisa.
   No hay backend ni claves. La dirección que se pide sí viaja al servicio.

   Expone window.Escaparates con:
     captura(url, movil)   → Promise con la dirección de una imagen válida
     normaliza(texto)      → URL completa o null
     pinta(nodo, lista)    → rellena una rejilla de fichas
     abreVisor(proyecto)   → abre el visor a pantalla completa
   ========================================================================= */

(function () {
  "use strict";

  /* La primera captura de una web que el servicio no tiene cacheada puede irse
     a más de treinta segundos; las siguientes son instantáneas. Se aguanta 22
     antes de pasar al siguiente servicio. */
  var ESPERA = 22000;
  var memoria = {};

  /* --- Dirección ------------------------------------------------------- */

  function normaliza(entrada) {
    var texto = (entrada || "").trim();
    if (!texto) return null;
    if (!/^https?:\/\//i.test(texto)) texto = "https://" + texto;
    var direccion;
    try {
      direccion = new URL(texto);
    } catch (e) {
      return null;
    }
    if (direccion.protocol !== "http:" && direccion.protocol !== "https:") return null;
    if (direccion.hostname.indexOf(".") === -1) return null;
    if (/^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.)/i.test(direccion.hostname)) return null;
    return direccion.href;
  }

  /* --- Servicios de captura -------------------------------------------- */

  /* `espera` son los segundos que el servicio aguanta con la página abierta
     antes de disparar. Sirve para webs con animación de entrada: si capturas
     al instante, sale el logo del intro en vez de la página.

     Medido el 29/07/2026 contra blacklilitattoos.com:
       · thum.io   ignora la espera — devuelve la misma captura, byte a byte.
       · mShots    no tiene manera de pedírsela.
       · microlink la respeta: con waitForTimeout=10000 tarda 7 s más en
                   responder, que es exactamente lo que se le pidió esperar.
     Por eso, cuando una ficha declara espera, microlink va primero. Sin
     espera manda thum.io, que es el más rápido. */

  function segundos(espera) {
    var n = parseInt(espera, 10);
    if (!n || n < 0) return 0;
    return Math.min(n, 20);
  }

  var SERVICIOS = {
    thum: function (url, movil) {
      return {
        ancho: movil ? 480 : 1280,
        src: "https://image.thum.io/get/width/" + (movil ? 480 : 1280) +
          "/crop/" + (movil ? 1040 : 900) +
          (movil ? "/viewportWidth/390" : "") +
          "/noanimate/" + url
      };
    },
    mshots: function (url, movil) {
      return {
        ancho: movil ? 390 : 1280,
        src: "https://s0.wp.com/mshots/v1/" + encodeURIComponent(url) +
          "?w=" + (movil ? 390 : 1280) +
          "&h=" + (movil ? 780 : 900) +
          (movil ? "&vpw=390" : "")
      };
    },
    microlink: function (url, movil, espera) {
      return {
        ancho: movil ? 390 : 1280,
        src: "https://api.microlink.io/?url=" + encodeURIComponent(url) +
          "&screenshot=true&meta=false&embed=screenshot.url" +
          (espera ? "&waitForTimeout=" + (espera * 1000) : "") +
          (movil ? "&viewport.width=390&viewport.height=780" : "")
      };
    }
  };

  function turnos(espera) {
    return espera ? ["microlink", "thum", "mshots"] : ["thum", "mshots", "microlink"];
  }

  function pide(src, margen, anchoPedido) {
    return new Promise(function (bien, mal) {
      var img = new Image();
      var resuelto = false;
      var reloj = setTimeout(function () {
        if (resuelto) return;
        resuelto = true;
        img.src = "";
        mal(new Error("tiempo agotado"));
      }, ESPERA + (margen || 0));

      img.onload = function () {
        if (resuelto) return;
        resuelto = true;
        clearTimeout(reloj);
        /* mShots contesta con un gris de 400×300 mientras genera la captura de
           verdad. Cargar eso como si fuera la web es peor que no enseñar nada,
           así que se rechaza y le toca al siguiente servicio. */
        if (img.naturalWidth === 400 && img.naturalHeight === 300) {
          mal(new Error("el servicio aún estaba generando la captura"));
        } else if (img.naturalWidth < Math.min(320, anchoPedido * 0.6)) {
          mal(new Error("captura demasiado pequeña"));
        } else {
          bien(src);
        }
      };
      img.onerror = function () {
        if (resuelto) return;
        resuelto = true;
        clearTimeout(reloj);
        mal(new Error("el servicio no responde"));
      };

      img.referrerPolicy = "no-referrer";
      img.src = src;
    });
  }

  function captura(url, movil, espera) {
    var pausa = segundos(espera);
    var clave = (movil ? "m|" : "e|") + pausa + "|" + url;
    if (memoria[clave]) return memoria[clave];

    var cola = turnos(pausa);
    var indice = 0;
    function intenta() {
      if (indice >= cola.length) return Promise.reject(new Error("ningún servicio de captura respondió"));
      var receta = SERVICIOS[cola[indice++]](url, movil, pausa);
      /* La espera del servicio se suma al plazo propio: si le pedimos que
         aguante diez segundos, no podemos rendirnos antes de que dispare. */
      return pide(receta.src, pausa * 1000, receta.ancho).catch(intenta);
    }

    var promesa = intenta();
    memoria[clave] = promesa;
    promesa.catch(function () { delete memoria[clave]; });
    return promesa;
  }

  /* --- Fichas ---------------------------------------------------------- */

  var NOMBRES_TIPO = {
    "una-pagina": "Una página",
    "multipagina": "Multipágina",
    "tienda": "Tienda"
  };

  var observador = null;
  function observa(nodo) {
    if (!("IntersectionObserver" in window)) {
      nodo.dispatchEvent(new CustomEvent("cerca"));
      return;
    }
    if (!observador) {
      observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          observador.unobserve(entrada.target);
          entrada.target.dispatchEvent(new CustomEvent("cerca"));
        });
      }, { rootMargin: "300px 0px" });
    }
    observador.observe(nodo);
  }

  function ficha(proyecto) {
    var art = document.createElement("article");
    art.className = "escaparate";
    art.setAttribute("data-tipo", proyecto.tipo || "");

    var lienzo;
    if (proyecto.url) {
      lienzo = document.createElement("button");
      lienzo.type = "button";
      lienzo.setAttribute("aria-label", "Ver " + proyecto.nombre + " a pantalla completa");
      lienzo.addEventListener("click", function () { abreVisor(proyecto); });
    } else {
      lienzo = document.createElement("div");
    }
    lienzo.className = "escaparate__lienzo";

    if (proyecto.url) {
      var img = document.createElement("img");
      img.alt = "Captura de la web de " + proyecto.nombre;
      img.loading = "lazy";
      img.decoding = "async";
      lienzo.appendChild(img);

      var cortina = document.createElement("span");
      cortina.className = "escaparate__vacio";
      cortina.innerHTML = '<span class="cartel">CARGANDO</span>';
      lienzo.appendChild(cortina);

      lienzo.addEventListener("cerca", function () {
        captura(proyecto.url, false, proyecto.espera).then(function (src) {
          img.src = src;
          cortina.remove();
        }).catch(function () {
          cortina.innerHTML = '<span class="cartel">SIN CAPTURA</span>' +
            '<span>Ábrela en una pestaña para verla.</span>';
        });
      });
      observa(lienzo);
    } else {
      var pendiente = document.createElement("span");
      pendiente.className = "escaparate__vacio";
      pendiente.innerHTML = '<span class="cartel">EN OBRA</span>' +
        '<span>Pendiente de publicar. La miniatura sale sola en cuanto haya dirección.</span>';
      lienzo.appendChild(pendiente);
    }

    var pie = document.createElement("div");
    pie.className = "escaparate__pie";

    var textos = document.createElement("div");
    var nombre = document.createElement("p");
    nombre.className = "escaparate__nombre";
    nombre.textContent = proyecto.nombre;
    var oficio = document.createElement("p");
    oficio.className = "escaparate__oficio";
    oficio.textContent = proyecto.oficio + (proyecto.anio ? " · " + proyecto.anio : "");
    textos.appendChild(nombre);
    textos.appendChild(oficio);

    var etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = NOMBRES_TIPO[proyecto.tipo] || proyecto.tipo || "";

    pie.appendChild(textos);
    if (etiqueta.textContent) pie.appendChild(etiqueta);

    art.appendChild(lienzo);
    art.appendChild(pie);

    if (proyecto.nota) {
      var nota = document.createElement("p");
      nota.className = "escaparate__nota";
      nota.textContent = proyecto.nota;
      art.appendChild(nota);
    }
    return art;
  }

  function pinta(nodo, lista) {
    if (!nodo) return;
    nodo.textContent = "";
    if (!lista.length) {
      var vacio = document.createElement("p");
      vacio.className = "escaparate__nota";
      vacio.textContent = "Todavía no hay trabajos de este tipo publicados.";
      nodo.appendChild(vacio);
      return;
    }
    lista.forEach(function (proyecto) { nodo.appendChild(ficha(proyecto)); });
  }

  /* --- Visor ----------------------------------------------------------- */

  var visor = null;
  var devuelveFoco = null;
  var actual = null;

  function construyeVisor() {
    if (visor) return visor;
    visor = document.createElement("div");
    visor.className = "visor";
    visor.setAttribute("role", "dialog");
    visor.setAttribute("aria-modal", "true");
    visor.setAttribute("aria-labelledby", "visor-titulo");
    visor.setAttribute("data-abierto", "no");
    visor.innerHTML =
      '<div class="visor__barra">' +
        '<div>' +
          '<p class="visor__titulo" id="visor-titulo"></p>' +
          '<p class="visor__url"></p>' +
        '</div>' +
        '<div class="visor__mandos">' +
          '<div class="conmutador" role="group" aria-label="Ancho de pantalla">' +
            '<button type="button" data-vista="escritorio" aria-pressed="true">Escritorio</button>' +
            '<button type="button" data-vista="movil" aria-pressed="false">Móvil</button>' +
          '</div>' +
          '<div class="conmutador" role="group" aria-label="Modo de vista">' +
            '<button type="button" data-modo="captura" aria-pressed="true">Captura</button>' +
            '<button type="button" data-modo="vivo" aria-pressed="false">En vivo</button>' +
          '</div>' +
          '<a class="visor__cierra" data-abrir target="_blank" rel="noopener noreferrer">Abrir web ↗</a>' +
          '<button type="button" class="visor__cierra" data-cierra>Cerrar ✕</button>' +
        '</div>' +
      '</div>' +
      '<div class="visor__pantalla" data-vista="escritorio">' +
        '<img alt="" data-captura>' +
        '<iframe data-vivo title="Vista en vivo de la web" hidden loading="lazy" referrerpolicy="no-referrer" ' +
          'sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>' +
        '<p class="visor__nota" data-nota></p>' +
      '</div>';
    document.body.appendChild(visor);

    visor.addEventListener("click", function (ev) {
      if (ev.target === visor) cierraVisor();
    });
    visor.querySelector("[data-cierra]").addEventListener("click", cierraVisor);

    visor.querySelectorAll("[data-vista]").forEach(function (boton) {
      boton.addEventListener("click", function () { ponVista(boton.getAttribute("data-vista")); });
    });
    visor.querySelectorAll("[data-modo]").forEach(function (boton) {
      boton.addEventListener("click", function () { ponModo(boton.getAttribute("data-modo")); });
    });

    document.addEventListener("keydown", function (ev) {
      if (visor.getAttribute("data-abierto") !== "si") return;
      if (ev.key === "Escape") { cierraVisor(); return; }
      if (ev.key !== "Tab") return;
      var focales = visor.querySelectorAll("button, a[href], iframe");
      if (!focales.length) return;
      var primero = focales[0];
      var ultimo = focales[focales.length - 1];
      if (ev.shiftKey && document.activeElement === primero) { ev.preventDefault(); ultimo.focus(); }
      else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primero.focus(); }
    });

    return visor;
  }

  function ponVista(vista) {
    var movil = vista === "movil";
    visor.querySelector(".visor__pantalla").setAttribute("data-vista", vista);
    visor.querySelectorAll("[data-vista]").forEach(function (boton) {
      boton.setAttribute("aria-pressed", boton.getAttribute("data-vista") === vista ? "true" : "false");
    });
    if (!actual) return;
    var img = visor.querySelector("[data-captura]");
    var nota = visor.querySelector("[data-nota]");
    nota.textContent = "";
    img.removeAttribute("src");
    captura(actual.url, movil, actual.espera).then(function (src) {
      img.src = src;
    }).catch(function () {
      nota.textContent = "No se ha podido generar la captura. Prueba «En vivo» o abre la web en una pestaña.";
    });
  }

  function ponModo(modo) {
    var vivo = modo === "vivo";
    var marco = visor.querySelector("[data-vivo]");
    var img = visor.querySelector("[data-captura]");
    var nota = visor.querySelector("[data-nota]");
    visor.querySelectorAll("[data-modo]").forEach(function (boton) {
      boton.setAttribute("aria-pressed", boton.getAttribute("data-modo") === modo ? "true" : "false");
    });
    if (vivo && actual) {
      img.hidden = true;
      marco.hidden = false;
      marco.src = actual.url;
      nota.textContent = "";
      clearTimeout(ponModo.reloj);
      ponModo.reloj = setTimeout(function () {
        if (visor.querySelector('[data-modo="vivo"]').getAttribute("aria-pressed") !== "true") return;
        nota.textContent = "Si el recuadro sigue en blanco, esa web no permite verse dentro de otra. Ábrela en una pestaña.";
      }, 3500);
    } else {
      clearTimeout(ponModo.reloj);
      marco.hidden = true;
      marco.removeAttribute("src");
      img.hidden = false;
      nota.textContent = "";
    }
  }

  function abreVisor(proyecto) {
    if (!proyecto || !proyecto.url) return;
    construyeVisor();
    actual = proyecto;
    devuelveFoco = document.activeElement;

    visor.querySelector(".visor__titulo").textContent = proyecto.nombre;
    visor.querySelector(".visor__url").textContent = proyecto.url;
    var abrir = visor.querySelector("[data-abrir]");
    abrir.href = proyecto.url;
    abrir.setAttribute("aria-label", "Abrir " + proyecto.nombre + " en una pestaña nueva");

    ponModo("captura");
    ponVista("escritorio");

    visor.setAttribute("data-abierto", "si");
    document.body.style.overflow = "hidden";
    visor.querySelector("[data-cierra]").focus();
  }

  function cierraVisor() {
    if (!visor) return;
    visor.setAttribute("data-abierto", "no");
    var marco = visor.querySelector("[data-vivo]");
    marco.hidden = true;
    marco.removeAttribute("src");
    document.body.style.overflow = "";
    actual = null;
    if (devuelveFoco && devuelveFoco.focus) devuelveFoco.focus();
  }

  /* --- El escaparate de la portada ------------------------------------- */

  function iniciaEscaparateVivo() {
    var caja = document.querySelector("[data-escaparate-vivo]");
    if (!caja) return;

    var forma = caja.querySelector("form");
    var campo = caja.querySelector("input[type='url'], input[type='text']");
    var marco = caja.querySelector(".marco");

    /* La imagen no existe en el HTML: se crea aquí para no dejar en la página
       un <img> sin src esperando a que alguien pida una captura. */
    var img = marco.querySelector("img");
    if (!img) {
      img = document.createElement("img");
      img.alt = "";
      img.decoding = "async";
      marco.insertBefore(img, marco.firstChild);
    }
    var aviso = caja.querySelector(".marco__aviso");
    var conmutador = caja.querySelector(".conmutador");
    var url = null;

    function carga(movil) {
      if (!url) return;
      caja.setAttribute("data-estado", "cargando");
      aviso.querySelector("[data-mensaje]").textContent = "";
      img.removeAttribute("src");
      /* Cuatro segundos de cortesía: aquí puede entrar cualquier web, y muchas
         tienen animación de entrada. Sin esta espera saldría el logo del intro
         en vez de la página. */
      captura(url, movil, 4).then(function (src) {
        img.src = src;
        img.alt = "Captura de " + url;
        caja.setAttribute("data-estado", "abierto");
      }).catch(function (error) {
        aviso.querySelector("[data-mensaje]").textContent = error.message;
        caja.setAttribute("data-estado", "error");
      });
    }

    forma.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var limpia = normaliza(campo.value);
      if (!limpia) {
        campo.setAttribute("aria-invalid", "true");
        aviso.querySelector("[data-mensaje]").textContent =
          "Eso no parece una dirección web. Prueba con algo como tunegocio.es";
        caja.setAttribute("data-estado", "error");
        campo.focus();
        return;
      }
      campo.removeAttribute("aria-invalid");
      url = limpia;
      var movil = conmutador && conmutador.querySelector('[aria-pressed="true"]');
      carga(movil ? movil.getAttribute("data-vista") === "movil" : false);
    });

    campo.addEventListener("input", function () { campo.removeAttribute("aria-invalid"); });

    if (conmutador) {
      conmutador.querySelectorAll("button").forEach(function (boton) {
        boton.addEventListener("click", function () {
          conmutador.querySelectorAll("button").forEach(function (otro) {
            otro.setAttribute("aria-pressed", otro === boton ? "true" : "false");
          });
          var movil = boton.getAttribute("data-vista") === "movil";
          marco.setAttribute("data-vista", movil ? "movil" : "escritorio");
          if (url) carga(movil);
        });
      });
    }
  }

  /* --- Arranque -------------------------------------------------------- */

  function arranca() {
    iniciaEscaparateVivo();

    var rejilla = document.querySelector("[data-escaparates]");
    if (!rejilla || !window.PROYECTOS) return;

    var soloDestacados = rejilla.hasAttribute("data-destacados");
    var lista = window.PROYECTOS.filter(function (p) { return soloDestacados ? p.destacado : true; });
    if (soloDestacados) lista = lista.slice(0, 3);
    pinta(rejilla, lista);

    var filtros = document.querySelector("[data-filtros]");
    if (!filtros) return;
    filtros.addEventListener("click", function (ev) {
      var boton = ev.target.closest("button[data-filtro]");
      if (!boton) return;
      filtros.querySelectorAll("button").forEach(function (otro) {
        otro.setAttribute("aria-pressed", otro === boton ? "true" : "false");
      });
      var tipo = boton.getAttribute("data-filtro");
      pinta(rejilla, window.PROYECTOS.filter(function (p) {
        return tipo === "todos" || p.tipo === tipo;
      }));
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arranca);
  else arranca();

  window.Escaparates = {
    captura: captura,
    normaliza: normaliza,
    pinta: pinta,
    abreVisor: abreVisor
  };
})();

/* =========================================================================
   El Escaparate — comportamiento común: navegación, año, entrada de secciones
   y validación del formulario de presupuesto.
   ========================================================================= */

(function () {
  "use strict";

  /* --- Navegación en móvil --------------------------------------------- */

  var abre = document.querySelector("[data-abre-nav]");
  var nav = document.querySelector("[data-nav]");

  if (abre && nav) {
    abre.addEventListener("click", function () {
      var abierta = nav.getAttribute("data-abierta") === "si";
      nav.setAttribute("data-abierta", abierta ? "no" : "si");
      abre.setAttribute("aria-expanded", abierta ? "false" : "true");
    });
    nav.addEventListener("click", function (ev) {
      if (ev.target.tagName === "A") {
        nav.setAttribute("data-abierta", "no");
        abre.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && nav.getAttribute("data-abierta") === "si") {
        nav.setAttribute("data-abierta", "no");
        abre.setAttribute("aria-expanded", "false");
        abre.focus();
      }
    });
  }

  /* --- Año en el pie ---------------------------------------------------- */

  var anio = document.querySelector("[data-anio]");
  if (anio) anio.textContent = new Date().getFullYear();

  /* --- Entrada de secciones (un solo gesto, no uno por elemento) -------- */

  var entrantes = document.querySelectorAll(".entra");
  if (entrantes.length) {
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      entrantes.forEach(function (nodo) { nodo.setAttribute("data-visto", "si"); });
    } else {
      var mirador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          entrada.target.setAttribute("data-visto", "si");
          mirador.unobserve(entrada.target);
        });
      }, { rootMargin: "0px 0px -12% 0px" });
      entrantes.forEach(function (nodo) { mirador.observe(nodo); });
    }
  }

  /* --- Formulario de presupuesto ---------------------------------------- */

  var forma = document.querySelector("[data-forma-presupuesto]");
  if (!forma) return;

  var aviso = forma.querySelector("[data-aviso]");

  function marca(campo, mensaje) {
    var caja = campo.closest(".campo");
    if (!caja) return;
    caja.setAttribute("data-error", mensaje ? "si" : "no");
    var texto = caja.querySelector(".campo__error");
    if (texto) texto.textContent = mensaje || "";
    if (mensaje) campo.setAttribute("aria-invalid", "true");
    else campo.removeAttribute("aria-invalid");
  }

  function revisa(campo) {
    var valor = (campo.value || "").trim();
    if (campo.hasAttribute("required") && !valor) {
      marca(campo, campo.getAttribute("data-falta") || "Rellena este campo.");
      return false;
    }
    if (campo.type === "email" && valor && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
      marca(campo, "Repasa el correo: falta algo para poder contestarte.");
      return false;
    }
    if (campo.type === "url" && valor && !/^([a-z]+:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(valor)) {
      marca(campo, "Escribe la dirección completa, por ejemplo tunegocio.es");
      return false;
    }
    marca(campo, "");
    return true;
  }

  forma.querySelectorAll("input, textarea, select").forEach(function (campo) {
    campo.addEventListener("blur", function () {
      if ((campo.value || "").trim() || campo.hasAttribute("required")) revisa(campo);
    });
    campo.addEventListener("input", function () {
      if (campo.closest(".campo") && campo.closest(".campo").getAttribute("data-error") === "si") revisa(campo);
    });
  });

  forma.addEventListener("submit", function (ev) {
    var fallo = null;
    forma.querySelectorAll("input, textarea, select").forEach(function (campo) {
      if (campo.type === "hidden" || campo.type === "radio" || campo.type === "checkbox") return;
      if (!revisa(campo) && !fallo) fallo = campo;
    });

    if (fallo) {
      ev.preventDefault();
      aviso.setAttribute("data-visible", "si");
      aviso.textContent = "Falta algo por revisar. Te lo he marcado más abajo.";
      fallo.focus();
      return;
    }

    /* Sin servicio de formularios configurado no se envía a ninguna parte:
       se abre el correo con todo escrito para que no se pierda el contacto. */
    if (forma.getAttribute("action").indexOf("PENDIENTE") !== -1) {
      ev.preventDefault();
      var datos = new FormData(forma);
      var cuerpo = [];
      datos.forEach(function (valor, clave) {
        if (clave.charAt(0) === "_" || !String(valor).trim()) return;
        cuerpo.push(clave + ": " + valor);
      });
      aviso.setAttribute("data-visible", "si");
      aviso.textContent = "Abriendo tu programa de correo con el mensaje escrito…";
      window.location.href = "mailto:" + forma.getAttribute("data-correo") +
        "?subject=" + encodeURIComponent("Presupuesto desde la web") +
        "&body=" + encodeURIComponent(cuerpo.join("\n"));
    }
  });
})();

/* =========================================================================
   La varilla del toldo: tiras y se echa el cierre.

   Se construye desde aquí y no en el HTML por dos razones: sin JavaScript no
   hay nada que enseñar, y así no hay siete copias del mismo trozo esperando a
   desincronizarse.
   ========================================================================= */

(function () {
  "use strict";

  var cabecera = document.querySelector(".cabecera");
  if (!cabecera) return;

  var varilla = document.createElement("button");
  varilla.type = "button";
  varilla.className = "varilla";
  varilla.setAttribute("aria-pressed", "false");
  varilla.innerHTML =
    '<span class="varilla__cuerda" aria-hidden="true"></span>' +
    '<span class="varilla__tirador" aria-hidden="true"></span>' +
    '<span class="oculto-visual" data-etiqueta>Echar el cierre</span>';

  /* Antes del toldo, no después: los dos van posicionados sin z-index, así que
     manda el orden del documento y el toldo tiene que pintarse encima para que
     la varilla cuelgue por detrás de la lona. */
  var lona = cabecera.querySelector(".toldo");
  if (lona) cabecera.insertBefore(varilla, lona);
  else cabecera.appendChild(varilla);

  /* La varilla tiene que colgar del centro de un festón, no de un margen fijo.
     Los festones se repiten cada --franja píxeles desde el borde izquierdo, así
     que el centro de cada uno cae en franja/2 + n·franja. Se busca el que quede
     más cerca del sitio donde la queremos y se ancla ahí. Hay que recalcularlo
     al cambiar el ancho, porque el número de festones que caben cambia. */
  function alinea() {
    if (!lona) return;
    var franja = parseFloat(getComputedStyle(lona).getPropertyValue("--franja")) || 34;
    var ancho = cabecera.getBoundingClientRect().width;
    var margen = ancho < 544 ? 30 : 68;
    var indice = Math.round((ancho - margen - franja / 2) / franja);
    var centro = franja / 2 + indice * franja;

    /* Que no se salga por ningún lado. */
    if (centro > ancho - franja / 2) centro -= franja;
    if (centro < franja / 2) centro = franja / 2;

    varilla.style.right = "auto";
    varilla.style.left = (centro - varilla.getBoundingClientRect().width / 2) + "px";
  }

  alinea();
  var relojAncho = null;
  window.addEventListener("resize", function () {
    clearTimeout(relojAncho);
    relojAncho = setTimeout(alinea, 120);
  });

  var cierre = document.createElement("div");
  cierre.className = "cierre-fachada";
  cierre.setAttribute("data-estado", "abierta");
  cierre.setAttribute("aria-hidden", "true");
  cierre.innerHTML =
    '<div class="cierre-fachada__pano">' +
      '<div class="cierre-fachada__nucleo">' +
        '<span class="cartel">CERRADO</span>' +
        '<p>Has echado el cierre. Tira otra vez de la varilla, pulsa en cualquier sitio o dale a Escape para volver a abrir.</p>' +
        '<button type="button" class="boton" data-subir tabindex="-1">Subir la persiana</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(cierre);

  var subir = cierre.querySelector("[data-subir]");
  var etiqueta = varilla.querySelector("[data-etiqueta]");
  var relojFoco = null;
  var relojTiron = null;

  function pon(cerrada) {
    cierre.setAttribute("data-estado", cerrada ? "cerrada" : "abierta");
    cierre.setAttribute("aria-hidden", cerrada ? "false" : "true");
    varilla.setAttribute("aria-pressed", cerrada ? "true" : "false");
    etiqueta.textContent = cerrada ? "Subir la persiana" : "Echar el cierre";
    /* Con la persiana subida, el botón de dentro no debe pillar el tabulador. */
    subir.tabIndex = cerrada ? 0 : -1;

    /* Aquí no se bloquea el scroll a propósito. Hacerlo quita la barra, la
       página se ensancha y la cabecera deja un hueco claro a la derecha. Como
       la persiana es fija y tapa la ventana entera, lo que pase por detrás no
       se ve: no hay nada que bloquear. */

    clearTimeout(relojFoco);
    if (cerrada) relojFoco = setTimeout(function () { subir.focus(); }, 460);
    else varilla.focus();
  }

  varilla.addEventListener("click", function () {
    /* El tirón: la cuerda se estira un momento y vuelve. */
    varilla.setAttribute("data-tirando", "si");
    clearTimeout(relojTiron);
    relojTiron = setTimeout(function () { varilla.removeAttribute("data-tirando"); }, 260);
    pon(cierre.getAttribute("data-estado") !== "cerrada");
  });

  subir.addEventListener("click", function () { pon(false); });

  cierre.addEventListener("click", function (ev) {
    if (ev.target !== subir) pon(false);
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && cierre.getAttribute("data-estado") === "cerrada") pon(false);
  });
})();

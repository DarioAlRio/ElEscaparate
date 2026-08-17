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
      marca(campo, campo.getAttribute("data-falta") || "Este campo es obligatorio.");
      return false;
    }
    if (campo.type === "email" && valor && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
      marca(campo, "Revisa el correo: la dirección no parece completa.");
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

  /* Revisa el formulario entero. Devuelve true si está listo para enviarse por
     donde sea; si no, marca el primer fallo y lleva el foco hasta él. */
  function listo() {
    var fallo = null;
    forma.querySelectorAll("input, textarea, select").forEach(function (campo) {
      if (campo.type === "hidden" || campo.type === "radio" || campo.type === "checkbox") return;
      if (campo.name.charAt(0) === "_") return;
      if (!revisa(campo) && !fallo) fallo = campo;
    });

    if (fallo) {
      aviso.setAttribute("data-visible", "si");
      aviso.textContent = "Faltan datos por revisar. Los he señalado más abajo.";
      fallo.focus();
      return false;
    }
    return true;
  }

  /* La trampa de spam: si un robot la rellena, aquí se acaba el viaje. */
  function esRobot() {
    var trampa = forma.querySelector("[name='_apellido']");
    return !!(trampa && (trampa.value || "").trim());
  }

  /* El mismo mensaje para las dos salidas, en el orden en que se lee bien. */
  function mensaje() {
    function val(nombre) {
      var campo = forma.elements[nombre];
      if (!campo) return "";
      if (campo.length && !campo.value) {
        var elegido = forma.querySelector("[name='" + nombre + "']:checked");
        return elegido ? elegido.value : "";
      }
      return (campo.value || "").trim();
    }

    var lineas = [];
    lineas.push("Hola, soy " + val("nombre") + " (" + val("negocio") + ").");
    lineas.push("");
    lineas.push(val("mensaje"));
    lineas.push("");
    if (val("formato")) lineas.push("Formato: " + val("formato"));
    if (val("presupuesto")) lineas.push("Presupuesto: " + val("presupuesto"));
    if (val("web")) lineas.push("Web actual: " + val("web"));
    lineas.push("Correo: " + val("correo"));
    if (val("telefono")) lineas.push("Teléfono: " + val("telefono"));
    return lineas.join("\n");
  }

  function avisa(texto) {
    aviso.setAttribute("data-visible", "si");
    aviso.textContent = texto;
  }

  /* Salida 1: WhatsApp. No necesita servicio ninguno. */
  function porWhatsapp() {
    var numero = forma.getAttribute("data-whatsapp");
    if (!numero) return;
    var url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensaje());
    avisa("Abriendo WhatsApp con el mensaje redactado. Solo queda enviarlo.");
    var ventana = window.open(url, "_blank", "noopener");
    if (!ventana) window.location.href = url;
  }

  /* Salida 2: correo. Con un endpoint de verdad se envía a la bandeja; sin él,
     se abre el programa de correo del visitante con todo escrito. */
  function porCorreo() {
    if (forma.getAttribute("action").indexOf("PENDIENTE") === -1) {
      avisa("Enviando…");
      forma.submit();
      return;
    }
    avisa("Abriendo tu programa de correo con el mensaje redactado.");
    var carta = "mailto:" + forma.getAttribute("data-correo") +
      "?subject=" + encodeURIComponent("Presupuesto desde la web") +
      "&body=" + encodeURIComponent(mensaje());
    window.location.href = carta;
    /* Que el salvavidas vigile también esta salida: si no hay programa de
       correo, el clic no habría hecho nada visible. */
    document.dispatchEvent(new CustomEvent("carta-abierta", { detail: carta }));
  }

  /* Enviar con Enter equivale al botón principal, el de WhatsApp. */
  forma.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (esRobot() || !listo()) return;
    porWhatsapp();
  });

  var botonCorreo = forma.querySelector("[data-via='correo']");
  if (botonCorreo) {
    botonCorreo.addEventListener("click", function () {
      if (esRobot() || !listo()) return;
      porCorreo();
    });
  }
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

/* =========================================================================
   El modelo del estudio, girando.

   Cuatro renders del mismo modelo a 90 grados. No hay giro continuo: se pasa
   de una vista a la siguiente con un fundido corto, que a esta velocidad se
   lee como movimiento. El orden de los <img> en el HTML es el del giro.

   Gira solo hasta que el visitante toca algo. En cuanto arrastra o pulsa un
   botón, manda él y no se vuelve a arrancar por su cuenta: una imagen que
   sigue moviéndose después de que la hayas parado con la mano es de las cosas
   que más molestan de una web.
   ========================================================================= */

(function () {
  "use strict";

  var caja = document.querySelector("[data-giro]");
  if (!caja) return;

  var lienzo = caja.querySelector(".giro__caras");
  var caras = caja.querySelectorAll(".giro__cara");
  if (!lienzo || caras.length < 2) return;

  var PAUSA = 2600;       /* lo que se queda quieta cada vista */
  var PASO = 64;          /* píxeles de arrastre que valen un cuarto de vuelta */
  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var actual = 0;
  var reloj = null;
  var boton = caja.querySelector("[data-anda]");

  function pinta(indice) {
    var total = caras.length;
    actual = ((indice % total) + total) % total;
    for (var i = 0; i < total; i++) {
      if (i === actual) caras[i].setAttribute("data-visible", "si");
      else caras[i].removeAttribute("data-visible");
    }
    caja.setAttribute("data-cara", actual);
  }

  /* Las otras tres imágenes pesan medio mega entre las tres y la portada se
     pinta perfectamente sin ellas. Se piden cuando la página ya ha terminado
     de cargar, para no competir con la hoja de estilos ni con la primera. */
  function trae() {
    for (var i = 0; i < caras.length; i++) {
      var pendiente = caras[i].getAttribute("data-src");
      if (!pendiente) continue;
      caras[i].src = pendiente;
      caras[i].removeAttribute("data-src");
    }
  }

  if (document.readyState === "complete") trae();
  else window.addEventListener("load", trae);

  function anda() {
    return !!reloj;
  }

  function arranca() {
    if (quieto || reloj) return;
    reloj = setInterval(function () {
      /* Con la pestaña de fondo no hay nada que enseñar. */
      if (document.hidden) return;
      pinta(actual + 1);
    }, PAUSA);
    if (boton) boton.textContent = "Parar";
  }

  function para() {
    clearInterval(reloj);
    reloj = null;
    if (boton) boton.textContent = "Girar";
  }

  if (boton) {
    if (quieto) boton.textContent = "Girar";
    boton.addEventListener("click", function () {
      if (anda()) { para(); return; }
      /* Bajo «prefers-reduced-motion» no arranca solo, pero si lo pide a
         mano se le da: la preferencia es sobre lo que pasa sin pedirlo. */
      quieto = false;
      arranca();
    });
  }

  caja.querySelectorAll("[data-gira]").forEach(function (mando) {
    mando.addEventListener("click", function () {
      para();
      pinta(actual + (parseInt(mando.getAttribute("data-gira"), 10) || 1));
    });
  });

  /* Arrastre. Hacia la izquierda avanza el giro, que es el sentido en el que
     el modelo se mueve solo: así tirar del modelo lo lleva a donde iba. */
  var origen = null;
  var partida = 0;

  lienzo.addEventListener("pointerdown", function (ev) {
    if (ev.button !== undefined && ev.button !== 0) return;
    para();
    origen = ev.clientX;
    partida = actual;
    lienzo.setAttribute("data-agarrado", "si");
    if (lienzo.setPointerCapture) lienzo.setPointerCapture(ev.pointerId);
  });

  lienzo.addEventListener("pointermove", function (ev) {
    if (origen === null) return;
    pinta(partida - Math.round((ev.clientX - origen) / PASO));
  });

  function suelta(ev) {
    if (origen === null) return;
    origen = null;
    lienzo.removeAttribute("data-agarrado");
    if (lienzo.releasePointerCapture && ev.pointerId !== undefined) {
      lienzo.releasePointerCapture(ev.pointerId);
    }
  }

  lienzo.addEventListener("pointerup", suelta);
  lienzo.addEventListener("pointercancel", suelta);

  /* Arrastrar una imagen es lo que hace el navegador por su cuenta con
     cualquier <img>, y se come el gesto entero. */
  lienzo.addEventListener("dragstart", function (ev) { ev.preventDefault(); });

  arranca();
})();

/* =========================================================================
   Salvavidas del correo.

   Un enlace «mailto:» solo abre algo si el visitante tiene un programa de
   correo configurado en su equipo. Mucha gente no lo tiene —usa el correo en
   el navegador— y para esa el clic no hace absolutamente nada: ni se abre
   nada, ni hay mensaje de error, ni sabe por qué.

   Aquí se vigila el clic: si algo se abre, el navegador pierde el foco y no
   pasa nada más. Si al segundo seguimos en la página y con el foco puesto, es
   que no se abrió nada, y entonces sale un cartel con las dos salidas que
   funcionan siempre: escribir desde el correo web o copiar la dirección.

   Vale para los enlaces del pie, los de la página de presupuesto y el botón
   «Enviar por correo» del formulario, que avisa por su cuenta.
   ========================================================================= */

(function () {
  "use strict";

  var ESPERA = 1100;
  var VIDA = 14000;
  var cartel = null;
  var relojMira = null;
  var relojVida = null;

  /* De «mailto:x@y?subject=…&body=…» a sus tres piezas. */
  function partes(carta) {
    var resto = String(carta).replace(/^mailto:/i, "");
    var corte = resto.indexOf("?");
    var consulta = new URLSearchParams(corte === -1 ? "" : resto.slice(corte + 1));
    return {
      direccion: decodeURIComponent(corte === -1 ? resto : resto.slice(0, corte)),
      asunto: consulta.get("subject") || "",
      cuerpo: consulta.get("body") || ""
    };
  }

  function monta() {
    if (cartel) return cartel;
    cartel = document.createElement("div");
    cartel.className = "salvavidas";
    cartel.setAttribute("role", "status");
    cartel.innerHTML =
      '<p>¿No se ha abierto el correo? Tu equipo no tiene ningún programa configurado.</p>' +
      '<a data-gmail href="#" target="_blank" rel="noopener">Escribir desde el navegador</a>' +
      '<button type="button" data-copia>Copiar la dirección</button>' +
      '<button type="button" class="salvavidas__cierra" data-cierra>Cerrar</button>';

    cartel.querySelector("[data-cierra]").addEventListener("click", esconde);
    cartel.querySelector("[data-copia]").addEventListener("click", function () {
      var boton = this;
      var direccion = cartel.getAttribute("data-direccion") || "";
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(direccion).then(function () {
        boton.textContent = "Dirección copiada";
      });
    });

    document.body.appendChild(cartel);
    return cartel;
  }

  function esconde() {
    clearTimeout(relojVida);
    if (cartel) cartel.setAttribute("data-visible", "no");
  }

  function enseña(carta) {
    var datos = partes(carta);
    var nodo = monta();
    nodo.setAttribute("data-direccion", datos.direccion);
    nodo.querySelector("[data-gmail]").href =
      "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(datos.direccion) +
      "&su=" + encodeURIComponent(datos.asunto) +
      "&body=" + encodeURIComponent(datos.cuerpo);
    nodo.querySelector("[data-copia]").textContent = "Copiar la dirección";
    nodo.setAttribute("data-visible", "si");

    clearTimeout(relojVida);
    relojVida = setTimeout(esconde, VIDA);
  }

  /* Si el programa de correo se abre, el navegador pierde el foco: eso es lo
     que se mira. Con la pestaña oculta tampoco se enseña nada. */
  function vigila(carta) {
    clearTimeout(relojMira);
    relojMira = setTimeout(function () {
      if (document.visibilityState !== "visible") return;
      if (document.hasFocus && !document.hasFocus()) return;
      enseña(carta);
    }, ESPERA);
  }

  document.addEventListener("click", function (ev) {
    var enlace = ev.target.closest ? ev.target.closest('a[href^="mailto:"]') : null;
    if (!enlace || ev.defaultPrevented) return;
    esconde();
    vigila(enlace.getAttribute("href"));
  });

  document.addEventListener("carta-abierta", function (ev) { vigila(ev.detail); });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") esconde();
  });

  /* Si el programa de correo tardó en arrancar y aparece después, el navegador
     pierde el foco: el cartel ya no pinta nada y se retira solo. */
  window.addEventListener("blur", esconde);
})();

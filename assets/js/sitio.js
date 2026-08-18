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

   48 fotogramas del modelo 3D de la caseta, uno cada 7,5 grados. El giro está
   dentro de las imágenes: aquí no se anima nada, solo se enseña la que toca.
   Por eso el CSS de las caras no lleva ninguna transición — mezclar dos
   posiciones distintas del volumen emborrona el movimiento en vez de suavizarlo.

   NO GIRA SOLA. Desde el 18/08/2026 el movimiento es únicamente del visitante:
   arrastrando, con las flechas o con el teclado. Antes daba vueltas por su
   cuenta y Dario pidió quitarlo.

   Eso cambia por completo de dónde sale el peso. Los 48 fotogramas son 699 KB,
   y la mayoría de las visitas no van a tocar la maqueta nunca. Por eso bajan en
   dos tandas: primero uno de cada cuatro —12 fotogramas, 175 KB— con los que la
   maqueta ya se puede girar entera a saltos de 30 grados, y después el resto,
   que es lo que la vuelve fluida. Mientras falten, «pinta» enseña el fotograma
   cargado más próximo al que se ha pedido; la cuenta del giro va aparte y no se
   entera, así que al terminar la segunda tanda el gesto sigue donde estaba.
   ========================================================================= */

(function () {
  "use strict";

  var caja = document.querySelector("[data-giro]");
  if (!caja) return;

  var lienzo = caja.querySelector(".giro__caras");
  if (!lienzo) return;

  var TOTAL = parseInt(caja.getAttribute("data-fotogramas"), 10) || 0;
  var ruta = caja.getAttribute("data-ruta") || "";
  var primera = lienzo.querySelector(".giro__cara");
  if (TOTAL < 2 || !ruta || !primera) return;

  var PASO = 9;     /* píxeles de arrastre por fotograma: 432 px la vuelta */
  var SALTO = 12;   /* fotogramas que gira cada flecha: 90°, un cuarto */
  var RITMO = 34;   /* milisegundos entre uno y otro dentro de esa vuelta */
  var TANDAS = [4, 2, 1];  /* uno de cada cuatro, luego de cada dos, luego todos */

  /* Un hueco por fotograma. Solo el 0 viene escrito en el HTML; los demás se
     van rellenando conforme llegan. */
  var caras = new Array(TOTAL);
  caras[0] = primera;

  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var vuelta = null;

  /* La cuenta sin doblar (…, -1, 0, 1, 2, …) va aparte de lo que se ve. Hace
     falta para dos cosas: saber el sentido de cada paso —del 47 al 0 se va
     hacia delante, y con los índices doblados parecería un salto atrás de 47— y
     para que el arrastre no pierda resolución mientras faltan fotogramas. */
  var crudo = 0;
  var actual = 0;

  /* El fotograma cargado más próximo al que se ha pedido. Con la primera tanda
     puesta, el error máximo es de 15 grados; con la segunda, ninguno. */
  function cerca(i) {
    if (caras[i]) return i;
    for (var d = 1; d <= TOTAL; d++) {
      var izq = ((i - d) % TOTAL + TOTAL) % TOTAL;
      var der = (i + d) % TOTAL;
      if (caras[izq]) return izq;
      if (caras[der]) return der;
    }
    return 0;
  }

  function pinta(destino) {
    crudo = destino;
    var quiere = ((destino % TOTAL) + TOTAL) % TOTAL;
    var cara = cerca(quiere);
    if (cara === actual) return;

    caras[actual].removeAttribute("data-visible");
    caras[cara].setAttribute("data-visible", "si");
    actual = cara;
    caja.setAttribute("data-cara", cara);
  }

  /* --- La descarga, en dos tandas --------------------------------------- */

  /* No se le piden más a quien ha dicho que quiere ahorrar datos ni a quien
     navega por una red lenta. Ahí se queda en la primera tanda, que ya deja
     dar la vuelta entera. */
  function vale() {
    var red = navigator.connection;
    if (!red) return true;
    if (red.saveData) return false;
    return red.effectiveType !== "slow-2g" && red.effectiveType !== "2g";
  }

  /* La tercera tanda solo en pantalla grande. En un móvil la maqueta se ve a
     354 px y con 24 fotogramas ya no se distinguen los saltos; los otros 24
     serían medio mega y 20 MB de mapas de bits descodificados para afinar un
     giro que ahí no se aprecia. */
  function ancha() {
    return window.innerWidth >= 768;
  }

  var modelo = primera.querySelector("img");

  function crea(i) {
    var cara = document.createElement("img");
    cara.className = "giro__cara";
    cara.alt = "";
    cara.decoding = "async";
    cara.width = modelo.width;
    cara.height = modelo.height;
    cara.src = ruta + ("0" + i).slice(-2) + ".webp";
    lienzo.appendChild(cara);
    return cara;
  }

  function listo(imagen, cuandoTermine) {
    imagen.onload = function () {
      /* decode() adelanta el trabajo de descodificar, que si no llega sin hacer
         al primer paso por ese fotograma y el giro da un tirón. Pero NO se
         espera a que termine, y esto costó encontrarlo: con la pestaña de fondo
         hay navegadores que dejan esa promesa sin resolver indefinidamente, y
         con ella colgaba la tanda entera y la maqueta se quedaba muerta aunque
         las imágenes ya estuviesen descargadas. onload sí llega siempre. */
      if (imagen.decode) imagen.decode().catch(function () {});
      cuandoTermine(true);
    };
    imagen.onerror = function () { cuandoTermine(false); };
  }

  /* Trae los múltiplos de «paso» que aún falten. Los que ya están puestos por
     una tanda anterior no se vuelven a pedir. */
  function tanda(paso, cuandoTermine) {
    var lista = [];
    for (var i = 0; i < TOTAL; i += paso) if (!caras[i]) lista.push(i);
    if (!lista.length) { cuandoTermine(true); return; }

    var pendientes = lista.length;
    var entero = true;

    lista.forEach(function (i) {
      var cara = crea(i);
      listo(cara, function (ok) {
        /* Solo entra en el juego la que ha llegado bien: una imagen rota
           metida en el array haría un hueco negro a mitad de vuelta. */
        if (ok) caras[i] = cara;
        else { entero = false; cara.remove(); }
        if (--pendientes === 0) cuandoTermine(entero);
      });
    });
  }

  function trae() {
    tanda(TANDAS[0], function (entero) {
      /* Si la primera tanda no ha llegado entera, la maqueta se queda quieta en
         el primer fotograma: mejor una imagen fija que un giro con agujeros. */
      if (!entero) return;
      caja.setAttribute("data-vivo", "si");
      if (!vale()) return;
      tanda(TANDAS[1], function () {
        if (!ancha()) return;
        tanda(TANDAS[2], function () {});
      });
    });
  }

  if (document.readyState === "complete") trae();
  else window.addEventListener("load", trae);

  /* --- Mandos ------------------------------------------------------------ */

  function para() {
    if (!vuelta) return;
    clearInterval(vuelta);
    vuelta = null;
  }

  /* La flecha no avanza un fotograma: da un cuarto de vuelta pasando por todos
     los de en medio. Un solo fotograma a 7,5 grados no se ve como un giro, se
     ve como un parpadeo. */
  function gira(sentido) {
    para();
    var meta = crudo + sentido * SALTO;
    if (quieto) { pinta(meta); return; }
    vuelta = setInterval(function () {
      if (crudo === meta) { para(); return; }
      pinta(crudo + sentido);
    }, RITMO);
  }

  caja.querySelectorAll("[data-gira]").forEach(function (mando) {
    mando.addEventListener("click", function () {
      gira(parseInt(mando.getAttribute("data-gira"), 10) || 1);
    });
  });

  /* Arrastre. Hacia la derecha sube el índice, y no al revés: al pasar de un
     fotograma al siguiente la esquina que tenemos delante se mueve hacia la
     derecha, así que tirar hacia la derecha es empujar la caseta a donde ya
     iba. Con el signo cambiado el modelo gira en contra del dedo. */
  var origen = null;
  var partida = 0;

  lienzo.addEventListener("pointerdown", function (ev) {
    if (caja.getAttribute("data-vivo") !== "si") return;
    if (ev.button !== undefined && ev.button !== 0) return;
    para();
    origen = ev.clientX;
    partida = crudo;
    lienzo.setAttribute("data-agarrado", "si");
    if (lienzo.setPointerCapture) lienzo.setPointerCapture(ev.pointerId);
  });

  lienzo.addEventListener("pointermove", function (ev) {
    if (origen === null) return;
    pinta(partida + Math.round((ev.clientX - origen) / PASO));
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

/* Taller de render: sirve three.js, _modelo-caseta.glb y _render-modelo.html, y
   recoge los fotogramas que le manda el navegador para escribirlos en disco.

   No se publica —lo excluye .vercelignore— y no tiene nada que ver con
   _dev-servidor.js, que es el que sirve la web. Las instrucciones de uso están
   en la cabecera de _render-modelo.html. */

"use strict";

var http = require("http");
var fs = require("fs");
var path = require("path");

var RAIZ = __dirname;
var FOTOGRAMAS = path.join(RAIZ, "_fotogramas");
var PUERTO = 5199;

var TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".glb": "model/gltf-binary",
  ".png": "image/png",
  ".webp": "image/webp"
};

http.createServer(function (pet, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (pet.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  var url = decodeURIComponent(pet.url.split("?")[0]);

  if (pet.method === "POST") {
    var nombre = path.basename(url);
    if (!/^[a-z0-9._-]+\.(png|webp)$/i.test(nombre)) {
      res.writeHead(400); res.end("nombre no válido"); return;
    }
    var trozos = [];
    pet.on("data", function (t) { trozos.push(t); });
    pet.on("end", function () {
      var datos = Buffer.concat(trozos);
      fs.writeFileSync(path.join(FOTOGRAMAS, nombre), datos);
      console.log(nombre + "  " + Math.round(datos.length / 1024) + " KB");
      res.writeHead(200); res.end(String(datos.length));
    });
    return;
  }

  var relativa = url === "/" ? "/_render-modelo.html" : url;
  var destino = path.join(RAIZ, relativa.replace(/^\/+/, ""));
  if (destino.indexOf(RAIZ) !== 0 || !fs.existsSync(destino) || fs.statSync(destino).isDirectory()) {
    res.writeHead(404); res.end("no está: " + relativa); return;
  }
  res.writeHead(200, { "Content-Type": TIPOS[path.extname(destino).toLowerCase()] || "application/octet-stream" });
  res.end(fs.readFileSync(destino));
}).listen(PUERTO, function () {
  console.log("taller en http://localhost:" + PUERTO + " · fotogramas en " + FOTOGRAMAS);
});

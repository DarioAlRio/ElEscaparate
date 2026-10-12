# El Escaparate

![El Escaparate · Diseño y programación web en Madrid](og-escaparate.png)

Web de **El Escaparate**, mi estudio de diseño y programación web para negocios de barrio.
Sitio estático en **HTML, CSS y JS puro**: sin build, sin npm y sin dependencias. Desplegado en Vercel.

🌐 **[elescaparateweb.com](https://elescaparateweb.com)**

## Qué incluye

- **Páginas del estudio**: portada, diseño web, cómo trabajo, trabajos, sobre mí y presupuesto, más aviso legal, privacidad y cookies.
- **Portfolio que se mantiene solo**: cada trabajo es una URL en `assets/js/proyectos.js` y su captura se genera al momento desde la web del cliente. Cada proyecto tiene además su ficha en `/proyectos/<nombre>`.
- **El espejo** (en `/trabajos`): el visitante pega la dirección de su web actual y la ve en escritorio y en móvil tal como la ve un desconocido.
- **Maqueta 3D de la caseta** girando en la portada, a partir de 48 fotogramas renderizados de un modelo 3D.
- **SEO**: datos estructurados `ProfessionalService` (JSON-LD), canonicals, `sitemap.xml`, `robots.txt` y `llms.txt`.
- **Rendimiento**: imágenes WebP y fuentes propias (Bricolage Grotesque y Archivo) servidas desde el dominio.

## Estructura

```
├── *.html               Páginas del estudio
├── proyectos/           Ficha de cada trabajo
├── assets/
│   ├── css/             Hoja de estilos única
│   ├── js/              proyectos.js (lista del portfolio), escaparates.js, sitio.js
│   ├── img/             Imágenes y fotogramas de la maqueta
│   └── fuentes/
├── sitemap.xml  robots.txt  llms.txt  vercel.json
└── _*                   Herramientas y originales (se versionan pero no se publican)
```

La documentación interna está en `PRODUCT.md` (qué es y a quién habla), `DESIGN.md` (diseño), `PERSONALIZAR.md` (qué falta por rellenar) y `PENDIENTE.md` (decisiones abiertas). Ninguno se publica en la web (ver `.vercelignore`).

## Uso

Requiere [Node.js](https://nodejs.org/) solo para previsualizar en local:

```bash
node _dev-servidor.js   # http://localhost:5174
```

Para añadir un trabajo al portfolio, basta con una línea nueva en `assets/js/proyectos.js` y su ficha en `proyectos/`.

Cada `git push` a `main` se publica automáticamente en Vercel.

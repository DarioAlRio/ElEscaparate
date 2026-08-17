# Convierte los cuatro renders del modelo en PNG con fondo transparente,
# igualados de tamano y encajados en un lienzo comun para que al pasar de uno
# a otro la caseta no salte.
#
#   powershell -NoProfile -File _recorta-modelo.ps1
#
# Se ejecuta a mano y no se publica: lo que sale de aqui, assets/img/modelo-*.png,
# es lo unico que va al hosting. Se vuelve a pasar cuando haya un render nuevo.
#
# Entra: los cuatro imagen3d-*.png|jpg|jfif de la raiz, tal como salen del
# programa de 3D, con su fondo tostado. Sale: cuatro PNG de 654x480 con alfa.
#
# Si cambian los renders, el lienzo comun cambia de tamano: hay que copiar el
# que imprime este guion a la proporcion de .giro__caras en estilos.css y a los
# width/height de las cuatro imagenes en index.html, o la portada dara un tiron
# al cargar.

Add-Type -AssemblyName System.Drawing

$codigo = @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class Modelo
{
  static double Dist(int r1, int g1, int b1, int r2, int g2, int b2)
  {
    double dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
    return Math.Sqrt(dr * dr + dg * dg + db * db);
  }

  // Quita el fondo tostado y devuelve la imagen recortada a lo que queda.
  public static Bitmap Recorta(string ruta, double local, double techo)
  {
    Bitmap origen = new Bitmap(ruta);
    int w = origen.Width, h = origen.Height;
    Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
    using (Graphics g = Graphics.FromImage(bmp)) { g.DrawImage(origen, 0, 0, w, h); }
    origen.Dispose();

    BitmapData bd = bmp.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
    int paso = bd.Stride;
    byte[] px = new byte[paso * h];
    Marshal.Copy(bd.Scan0, px, 0, px.Length);

    // El color del fondo, por la mediana del marco de 1 px. La mediana aguanta
    // que el modelo toque un borde, cosa que pasa en dos de los cuatro.
    List<int> lr = new List<int>(), lg = new List<int>(), lb = new List<int>();
    for (int x = 0; x < w; x++) foreach (int y in new int[] { 0, h - 1 }) {
      int i = y * paso + x * 4; lr.Add(px[i + 2]); lg.Add(px[i + 1]); lb.Add(px[i]);
    }
    for (int y = 0; y < h; y++) foreach (int x in new int[] { 0, w - 1 }) {
      int i = y * paso + x * 4; lr.Add(px[i + 2]); lg.Add(px[i + 1]); lb.Add(px[i]);
    }
    lr.Sort(); lg.Sort(); lb.Sort();
    int fr = lr[lr.Count / 2], fg = lg[lg.Count / 2], fb = lb[lb.Count / 2];

    // Inundacion desde el marco. Un vecino entra si se parece al pixel de donde
    // viene (tolerancia corta: asi no salta el canto duro de la losa) y sigue
    // en el entorno del tostado (tolerancia larga: asi se traga la sombra).
    bool[] fondo = new bool[w * h];
    Queue<int> cola = new Queue<int>();
    for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
      if (x != 0 && y != 0 && x != w - 1 && y != h - 1) continue;
      int p = y * w + x, i = y * paso + x * 4;
      if (!fondo[p] && Dist(px[i + 2], px[i + 1], px[i], fr, fg, fb) < 60) { fondo[p] = true; cola.Enqueue(p); }
    }
    int[] dx = { 1, -1, 0, 0 }, dy = { 0, 0, 1, -1 };
    while (cola.Count > 0) {
      int p = cola.Dequeue();
      int x0 = p % w, y0 = p / w, i0 = y0 * paso + x0 * 4;
      for (int k = 0; k < 4; k++) {
        int x1 = x0 + dx[k], y1 = y0 + dy[k];
        if (x1 < 0 || y1 < 0 || x1 >= w || y1 >= h) continue;
        int q = y1 * w + x1;
        if (fondo[q]) continue;
        int i1 = y1 * paso + x1 * 4;
        if (Dist(px[i1 + 2], px[i1 + 1], px[i1], px[i0 + 2], px[i0 + 1], px[i0]) >= local) continue;
        if (Dist(px[i1 + 2], px[i1 + 1], px[i1], fr, fg, fb) >= techo) continue;
        fondo[q] = true; cola.Enqueue(q);
      }
    }

    // Alfa con el canto medio pixel hacia dentro: el reborde de pixeles
    // mezclados con el tostado se veria como un halo claro sobre fondo oscuro.
    byte[] duro = new byte[w * h];
    for (int p = 0; p < w * h; p++) duro[p] = fondo[p] ? (byte)0 : (byte)255;
    byte[] alfa = new byte[w * h];
    for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
      int suma = 0, cuenta = 0;
      for (int j = -1; j <= 1; j++) { int yy = y + j; if (yy < 0 || yy >= h) continue;
        for (int i = -1; i <= 1; i++) { int xx = x + i; if (xx < 0 || xx >= w) continue;
          suma += duro[yy * w + xx]; cuenta++; } }
      double v = ((double)suma / cuenta - 96.0) * 255.0 / 104.0;
      alfa[y * w + x] = (byte)Math.Round(Math.Max(0, Math.Min(255, v)));
    }

    // Los pixeles a medio alfa llevan tostado mezclado: se les pone el color
    // medio de los vecinos opacos, que es el color limpio del modelo.
    byte[] copia = (byte[])px.Clone();
    for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
      int p = y * w + x;
      if (alfa[p] == 0 || alfa[p] >= 250) continue;
      int sr = 0, sg = 0, sb = 0, n = 0;
      for (int j = -2; j <= 2; j++) { int yy = y + j; if (yy < 0 || yy >= h) continue;
        for (int i = -2; i <= 2; i++) { int xx = x + i; if (xx < 0 || xx >= w) continue;
          if (alfa[yy * w + xx] < 250) continue;
          int ii = yy * paso + xx * 4; sr += copia[ii + 2]; sg += copia[ii + 1]; sb += copia[ii]; n++; } }
      if (n == 0) continue;
      int io = y * paso + x * 4;
      px[io + 2] = (byte)(sr / n); px[io + 1] = (byte)(sg / n); px[io] = (byte)(sb / n);
    }
    for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) px[y * paso + x * 4 + 3] = alfa[y * w + x];

    Marshal.Copy(px, 0, bd.Scan0, px.Length);
    bmp.UnlockBits(bd);

    int ax = w, ay = h, bx = -1, by = -1;
    for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
      if (alfa[y * w + x] <= 6) continue;
      if (x < ax) ax = x; if (x > bx) bx = x;
      if (y < ay) ay = y; if (y > by) by = y;
    }
    Bitmap corte = bmp.Clone(new Rectangle(ax, ay, bx - ax + 1, by - ay + 1), PixelFormat.Format32bppArgb);
    bmp.Dispose();
    return corte;
  }

  // Ancho de la caseta: la masa azul marino, medida SOLO en la mitad alta del
  // recorte. Es la unica referencia que iguala los cuatro encuadres: la losa
  // de adoquin no vale, porque en el render de la izquierda se sale del cuadro
  // por los dos lados. Y a pantalla completa tampoco vale, porque el adoquin
  // en sombra tira a azulado y se cuela en la cuenta: medido, da 629 px de
  // caseta en el frente donde de verdad hay 494.
  public static int[] Caseta(Bitmap bmp)
  {
    int w = bmp.Width, h = bmp.Height;
    BitmapData bd = bmp.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    int paso = bd.Stride;
    byte[] px = new byte[paso * h];
    Marshal.Copy(bd.Scan0, px, 0, px.Length);
    bmp.UnlockBits(bd);

    int corte = (int)(h * 0.45);
    int x0 = w, x1 = -1;
    for (int y = 0; y < corte; y++) for (int x = 0; x < w; x++) {
      int i = y * paso + x * 4;
      if (px[i + 3] < 200) continue;
      int b = px[i], r = px[i + 2];
      if (r > 100) continue;        // marino oscuro
      if (b < r + 10) continue;     // con azul de verdad, no gris de adoquin
      if (x < x0) x0 = x; if (x > x1) x1 = x;
    }
    return new int[] { x0, x1 };
  }
}
'@
Add-Type -TypeDefinition $codigo -ReferencedAssemblies "System.Drawing"

$base = "C:\Users\Dario\Desktop\WEBS\ElEscaparate"
$destino = Join-Path $base "assets\img"
if (-not (Test-Path $destino)) { New-Item -ItemType Directory $destino | Out-Null }

# El orden es el del giro, no el de los nombres del archivo original.
$fotos = @(
  @{ nombre = "frente";    archivo = "imagen3d-delantera.png" },
  @{ nombre = "derecha";   archivo = "imagen3d-derecha.jfif" },
  @{ nombre = "detras";    archivo = "imagen3d-trasera.png" },
  @{ nombre = "izquierda"; archivo = "imagen3d-izquierda.jpg" }
)

$piezas = @()
foreach ($f in $fotos) {
  $bmp = [Modelo]::Recorta((Join-Path $base $f.archivo), 14.0, 135.0)
  $c = [Modelo]::Caseta($bmp)
  $piezas += [pscustomobject]@{
    nombre = $f.nombre; bmp = $bmp
    ancho = $c[1] - $c[0] + 1
    cx = ($c[0] + $c[1]) / 2.0
  }
  Write-Output ("{0,-10} recorte {1,4}x{2,-4} caseta ancho {3} centro x {4}" -f `
    $f.nombre, $bmp.Width, $bmp.Height, ($c[1]-$c[0]+1), [int](($c[0]+$c[1])/2))
}

# Se iguala por el ancho de la caseta, que no depende de la altura de camara:
# un cuerpo vertical proyecta el mismo ancho mire desde donde mire la camara.
# El objetivo es algo menor que las tres que ya comparten encuadre, para que
# ninguna se amplie y no se invente detalle que no hay.
$objetivo = 400.0

$colocadas = @()
foreach ($p in $piezas) {
  $e = $objetivo / $p.ancho
  $colocadas += [pscustomobject]@{
    nombre = $p.nombre; bmp = $p.bmp; escala = $e
    w = $p.bmp.Width * $e; h = $p.bmp.Height * $e
    cx = $p.cx * $e
  }
}

# El lienzo comun: lo que haga falta para que ninguna de las cuatro se corte.
# En horizontal manda el centro de la caseta; en vertical, el suelo, que es el
# canto de abajo del recorte. Asi la caseta se queda plantada en el mismo sitio
# y lo que gira es el modelo, no el encuadre.
$izq = ($colocadas | ForEach-Object { $_.cx } | Measure-Object -Maximum).Maximum
$der = ($colocadas | ForEach-Object { $_.w - $_.cx } | Measure-Object -Maximum).Maximum
$arr = ($colocadas | ForEach-Object { $_.h } | Measure-Object -Maximum).Maximum
$aba = 0.0

$W = [int][Math]::Ceiling($izq + $der)
$H = [int][Math]::Ceiling($arr + $aba)
Write-Output ("lienzo comun {0}x{1}, centro de caseta en {2},{3}" -f $W, $H, [int]$izq, [int]$arr)

foreach ($c in $colocadas) {
  $lienzo = New-Object System.Drawing.Bitmap $W, $H, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($lienzo)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.DrawImage($c.bmp, ($izq - $c.cx), ($H - $c.h), $c.w, $c.h)
  $g.Dispose()

  $ruta = Join-Path $destino ("modelo-" + $c.nombre + ".png")
  $lienzo.Save($ruta, [System.Drawing.Imaging.ImageFormat]::Png)
  $lienzo.Dispose()
  $c.bmp.Dispose()
  $kb = [int]((Get-Item $ruta).Length / 1024)
  Write-Output ("  modelo-{0}.png  escala {1:N3}  {2} KB" -f $c.nombre, $c.escala, $kb)
}

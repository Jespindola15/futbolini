# Picadito Pixel

Fútbol arcade pixelado con física tipo HaxBall: cada uno maneja un jugador, la pelota rebota en las vallas,
estadios reales, torneos (Libertadores, Champions, Mundial), arquero manejable y salas online.

El juego es una página estática (HTML, CSS y JavaScript, sin compilar). El online usa un servidor chiquito
de salas en Cloudflare Workers.

```
public/          el juego (esto es lo que se publica en Netlify)
  index.html
  style.css
  game.js
  config.js      ← acá va la dirección del servidor de salas
server/          servidor de salas online (Cloudflare Workers + Durable Objects)
  src/index.js       Worker y Durable Object (una "sala" por objeto)
  src/room-core.js   lógica de las salas
  dev-server.mjs     servidor local para probar en tu compu
  wrangler.toml      configuración de Cloudflare
netlify.toml     configuración de Netlify
```

## 1. Subirlo a GitHub

Opción fácil (desde la web):
1. Entrá a <https://github.com/new>, poné un nombre (por ejemplo `picadito-pixel`) y creá el repositorio.
2. En la página del repositorio vacío tocá **uploading an existing file**.
3. Arrastrá **todo el contenido** de esta carpeta (las carpetas `public` y `server`, `netlify.toml`,
   `README.md` y `.gitignore`) y tocá **Commit changes**.

Opción con la terminal:
```bash
cd picadito-pixel
git init
git add .
git commit -m "Picadito Pixel"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/picadito-pixel.git
git push -u origin main
```

## 2. Publicar el juego en Netlify

1. Entrá a <https://app.netlify.com> → **Add new site** → **Import an existing project** → **GitHub**.
2. Elegí el repositorio `picadito-pixel`.
3. No cambies nada: el archivo `netlify.toml` ya le dice que publique la carpeta `public` y que no hay
   que compilar. Tocá **Deploy**.
4. En un minuto te da una dirección tipo `https://algo.netlify.app`. Ya se puede jugar local y torneos.
   (En **Site configuration → Change site name** podés ponerle un nombre más lindo.)

Cada vez que subas cambios a GitHub, Netlify publica la versión nueva solo.

## 3. Activar el online con Cloudflare

Necesitás una cuenta gratis de Cloudflare (<https://dash.cloudflare.com/sign-up>) y Node.js 18 o más nuevo
(<https://nodejs.org>).

```bash
cd server
npm install
npx wrangler login      # se abre el navegador para autorizar tu cuenta de Cloudflare
npx wrangler deploy
```

Al terminar, `wrangler` muestra la dirección del servidor, algo como
`https://picadito-online.tu-usuario.workers.dev`. Abrila en el navegador: tiene que decir `picadito-online: ok`.

Después:
1. Abrí `public/config.js` y pegá esa dirección **cambiando `https://` por `wss://`**:
   ```js
   window.PICADITO_SERVER = 'wss://picadito-online.tu-usuario.workers.dev';
   ```
2. Subí ese cambio a GitHub (o editá el archivo directo en github.com). Netlify vuelve a publicar solo.
3. Listo: en el juego, pestaña **ONLINE** → **CREAR SALA**, y les pasás el link y el código a tus amigos.

**Recomendado:** que solo tu sitio pueda usar el servidor. En `server/wrangler.toml` poné la dirección de
Netlify (sin barra al final) y volvé a publicar:
```toml
[vars]
ALLOWED_ORIGINS = "https://algo.netlify.app"
```
```bash
npx wrangler deploy
```

### Cómo funciona el online
- Cada sala (y la lista de salas) es un *Durable Object* de Cloudflare que reenvía los mensajes entre los
  que están conectados por WebSocket. No se guarda nada: cuando se van todos, la sala desaparece.
- El partido lo calcula el navegador del **anfitrión** (quien crea la sala) y les manda la "foto" del partido
  unas 30 veces por segundo a los demás. Conviene que el anfitrión tenga buena conexión y deje la pestaña
  del juego a la vista.
- Fuera de claude.ai no hay cuentas: cada uno pone su apodo en la pestaña ONLINE.

### Costos
El plan gratis de Cloudflare Workers alcanza de sobra para jugar con amigos: incluye Durable Objects
(con almacenamiento SQLite, que es lo que usa este servidor) y 100.000 pedidos por día; los mensajes de
WebSocket que llegan al servidor cuentan 20 a 1. Un partido de 3 minutos entre dos personas usa del orden
de unos cientos de esos pedidos. Los límites actuales están en
<https://developers.cloudflare.com/durable-objects/platform/pricing/>.

## Probarlo en tu compu (con online)

```bash
cd server
npm install
npm run local
```
Abrí <http://localhost:8787> en dos pestañas (o en dos navegadores) y armá una sala.
Para probar el Worker tal cual corre en Cloudflare: `npx wrangler dev` (queda en el puerto 8787 por defecto;
si usás los dos a la vez, cambiá uno de puerto).

## Controles
- **P1:** WASD mover · Espacio patear (mantené para cargar; soltá en la zona verde para tiro perfecto) ·
  E globo · Q barrida · R + dirección filigrana · Shift sprint
- **P2:** Flechas · Enter · Shift derecho · Ctrl derecho
- **Arquero manejable (2 vs 2 o más):** E agarrar (solo dentro del área) · Q estirada · Espacio sacar
- **Celular:** joystick a la izquierda y botones a la derecha
- Esc pausa · M sonido

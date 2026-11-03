// Configuración de Picadito Pixel.
// Dirección del servidor de salas online (Cloudflare Worker). Después de publicarlo con `npx wrangler deploy`,
// pegá acá la dirección que te da Cloudflare, cambiando https:// por wss://
// Ejemplo: window.PICADITO_SERVER = 'wss://picadito-online.tu-usuario.workers.dev';
window.PICADITO_SERVER = '';

// Si abrís el juego desde el servidor local de prueba (npm run local), se usa ese mismo servidor.
if (!window.PICADITO_SERVER && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && location.port === '8787') {
  window.PICADITO_SERVER = 'ws://' + location.host;
}

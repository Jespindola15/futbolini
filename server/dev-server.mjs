// Servidor de salas para probar en tu computadora (mismo protocolo que el de Cloudflare).
// Uso:  cd server && npm install && npm run local
//       → abrí http://localhost:8787 en el navegador: el juego usa este mismo servidor para las salas.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { RoomCore } from './src/room-core.js';

const PORT = Number(process.env.PORT || 8787);
const ROOM_RE = /^[a-z0-9][a-z0-9_.-]{0,47}$/;
const rooms = new Map();

// sirve los archivos del juego (carpeta public/)
const ROOT = fileURLToPath(new URL('../public/', import.meta.url));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
const server = http.createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const rel = normalize(path === '/' ? '/index.html' : path).replace(/^(\.\.[\/\\])+/, '');
  if (rel.includes('..')) { res.writeHead(404); res.end(); return; }
  try {
    const body = await readFile(join(ROOT, rel));
    res.writeHead(200, { 'content-type': TYPES[extname(rel)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch (e) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); res.end('no encontrado'); }
});
const wss = new WebSocketServer({ noServer: true, maxPayload: 16384 });

server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url, 'http://localhost');
  const m = url.pathname.match(/^\/room\/([^/]+)$/);
  const name = m ? decodeURIComponent(m[1]) : '';
  if (!ROOM_RE.test(name)) { socket.destroy(); return; }
  wss.handleUpgrade(req, socket, head, ws => {
    let room = rooms.get(name);
    if (!room) { room = new RoomCore(); rooms.set(name, room); }
    const sess = room.join(ws, url.searchParams.get('peer'));
    if (!sess) return;
    ws.on('message', (data, isBinary) => { if (!isBinary) room.message(ws, data.toString()); });
    ws.on('close', () => { room.leave(ws); if (!room.size) rooms.delete(name); });
    ws.on('error', () => room.leave(ws));
  });
});

server.listen(PORT, () => console.log(`Picadito Pixel en http://localhost:${PORT}  (salas en ws://localhost:${PORT})`));

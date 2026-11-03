// Servidor de salas de Picadito Pixel para Cloudflare Workers.
// Cada sala ("lobby" o "pp-xxxx") es un Durable Object que mantiene las conexiones WebSocket de quienes están en ella.
import { RoomCore, cleanPeerId } from './room-core.js';

const ROOM_RE = /^[a-z0-9][a-z0-9_.-]{0,47}$/;

function cors(origin) {
  return { 'access-control-allow-origin': origin || '*', 'content-type': 'text/plain; charset=utf-8' };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response('picadito-online: ok', { headers: cors(origin) });
    }
    const m = url.pathname.match(/^\/room\/([^/]+)$/);
    if (!m) return new Response('no encontrado', { status: 404, headers: cors(origin) });
    const name = decodeURIComponent(m[1]);
    if (!ROOM_RE.test(name)) return new Response('nombre de sala inválido', { status: 400, headers: cors(origin) });
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('se espera una conexión WebSocket', { status: 426, headers: cors(origin) });
    }
    // si configuraste ALLOWED_ORIGINS, solo tu sitio puede conectarse
    if (allowed.length && !allowed.includes(origin)) {
      return new Response('origen no permitido', { status: 403, headers: cors(origin) });
    }
    const id = env.ROOMS.idFromName(name);
    return env.ROOMS.get(id).fetch(request);
  },
};

export class Room {
  constructor(state, env) {
    this.state = state;
    this.core = new RoomCore();
  }

  async fetch(request) {
    const url = new URL(request.url);
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    server.accept();
    const sess = this.core.join(server, cleanPeerId(url.searchParams.get('peer')));
    if (sess) {
      server.addEventListener('message', ev => this.core.message(server, typeof ev.data === 'string' ? ev.data : ''));
      const bye = () => this.core.leave(server);
      server.addEventListener('close', bye);
      server.addEventListener('error', bye);
    }
    return new Response(null, { status: 101, webSocket: client });
  }
}

// Lógica de una sala: quién está y la "presencia" de cada uno (un objeto JSON chico que cada jugador va
// actualizando: su apodo, el lugar que eligió, sus controles; el anfitrión además publica la foto del partido).
// Cada cambio se reenvía a los demás de la sala. No se guarda nada: si se van todos, la sala desaparece.
// Se usa igual en Cloudflare (src/index.js) y en el servidor local de prueba (dev-server.mjs).

export const MAX_PEERS = 64;          // personas por sala
export const MAX_MSG = 8192;          // bytes por mensaje
export const MAX_PRESENCE = 8192;     // bytes de presencia por persona
export const MAX_RATE = 90;           // mensajes por segundo por persona (el juego manda ~30)

export function cleanPeerId(v) {
  const s = String(v || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
  return s || 'p' + Math.random().toString(36).slice(2, 10);
}

export class RoomCore {
  constructor() {
    this.sessions = new Map(); // socket -> { peer, presence, n, t0 }
  }

  get size() { return this.sessions.size; }

  // socket: objeto con send(texto) y close(código, motivo)
  join(socket, peerId) {
    const peer = cleanPeerId(peerId);
    // si la misma persona se reconecta, se reemplaza la conexión vieja
    for (const [ws, s] of this.sessions) {
      if (s.peer === peer) { this.sessions.delete(ws); try { ws.close(1000, 'reemplazada'); } catch (e) {} }
    }
    if (this.sessions.size >= MAX_PEERS) { try { socket.close(1013, 'sala llena'); } catch (e) {} return null; }
    const sess = { peer, presence: {}, n: 0, t0: Date.now() };
    this.sessions.set(socket, sess);
    const others = [...this.sessions.values()].filter(s => s !== sess).map(s => ({ peer: s.peer, presence: s.presence }));
    this.sendTo(socket, { t: 'hello', you: peer, peers: others });
    this.broadcast({ t: 'p', peer, patch: {} }, socket);
    return sess;
  }

  message(socket, data) {
    const sess = this.sessions.get(socket);
    if (!sess || typeof data !== 'string' || data.length > MAX_MSG) return;
    const now = Date.now();
    if (now - sess.t0 > 1000) { sess.t0 = now; sess.n = 0; }
    if (++sess.n > MAX_RATE) return;
    let m;
    try { m = JSON.parse(data); } catch (e) { return; }
    if (!m || m.t !== 'p' || !m.patch || typeof m.patch !== 'object' || Array.isArray(m.patch)) return;
    const keys = Object.keys(m.patch).slice(0, 32);
    const next = Object.assign({}, sess.presence), patch = {};
    for (const k of keys) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype' || k.length > 40) continue;
      const v = m.patch[k];
      if (v === null) delete next[k]; else next[k] = v;
      patch[k] = v;
    }
    if (JSON.stringify(next).length > MAX_PRESENCE) return;
    sess.presence = next;
    this.broadcast({ t: 'p', peer: sess.peer, patch }, socket);
  }

  leave(socket) {
    const sess = this.sessions.get(socket);
    if (!sess) return;
    this.sessions.delete(socket);
    this.broadcast({ t: 'leave', peer: sess.peer });
  }

  sendTo(socket, msg) {
    try { socket.send(JSON.stringify(msg)); } catch (e) { this.leave(socket); }
  }

  broadcast(msg, except) {
    const text = JSON.stringify(msg);
    for (const ws of [...this.sessions.keys()]) {
      if (ws === except) continue;
      try { ws.send(text); } catch (e) { this.leave(ws); }
    }
  }
}

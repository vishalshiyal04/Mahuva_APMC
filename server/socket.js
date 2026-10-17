import { Server } from 'socket.io';

// રિયલ-ટાઇમ (લાઈવ બોલી) માટે Socket.io. initSocket પછી બધે `io` વાપરી શકાય.
export let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, { cors: { origin: '*' } });
  return io;
}

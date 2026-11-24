import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { allowedOrigins } from "./middleware/security.js";

// રિયલ-ટાઇમ (લાઈવ બોલી + સૂચનાઓ) માટે Socket.io. initSocket પછી બધે `io` વાપરી શકાય.
export let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: allowedOrigins.length ? allowedOrigins : "*" },
  });

  // લોગિન કરેલો યુઝર પોતાના ખાનગી room માં જોડાય → ફક્ત તેને જ તેની સૂચના મળે
  io.on("connection", (socket) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return;
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      socket.join("user:" + id);
    } catch {
      /* ટોકન ખોટું/જૂનું હોય તો ફક્ત જાહેર ઇવેન્ટ મળે */
    }
  });
  return io;
}

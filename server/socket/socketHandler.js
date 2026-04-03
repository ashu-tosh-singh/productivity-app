const jwt = require('jsonwebtoken');

// Map to track userId → Set of socketIds
// Used for debugging and knowing who's connected
const connectedUsers = new Map();

const initSocket = (io) => {

  // ── Auth Middleware for Socket.io ─────────────────────────────
  // Every socket connection must send a valid JWT
  // This runs BEFORE the connection event fires
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication error — no token'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id; // Attach userId to socket object
      next();
    } catch (err) {
      return next(new Error('Authentication error — invalid token'));
    }
  });

  // ── Connection Event ──────────────────────────────────────────
  io.on('connection', (socket) => {
    const userId = socket.userId;

    // Join a private room for this user
    // Room name = userId string — unique per user
    socket.join(userId);

    // Track connected sockets for this user
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket.id);

    console.log(`🟢 User ${userId} connected (socket: ${socket.id})`);

    // ── Disconnect ──────────────────────────────────────────────
    socket.on('disconnect', () => {
      const userSockets = connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          connectedUsers.delete(userId); // Clean up when all tabs close
        }
      }
      console.log(`🔴 User ${userId} disconnected (socket: ${socket.id})`);
    });
  });
};

// Helper: emit an event to ALL of a user's connected tabs
// Called from controllers after any DB change
const emitToUser = (io, userId, event, data) => {
  io.to(userId.toString()).emit(event, data);
};

module.exports = { initSocket, emitToUser };
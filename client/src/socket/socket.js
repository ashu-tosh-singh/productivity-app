import { io } from 'socket.io-client';

// Module-level singleton — one socket connection for the whole app
let socket = null;

// Call this once after login (in App.jsx)
export const connectSocket = (token) => {
  // If already connected, don't reconnect
  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },          // JWT sent on handshake — verified by server middleware
    reconnectionAttempts: 5,  // Try to reconnect 5 times before giving up
    reconnectionDelay: 1000,  // Wait 1s between attempts
  });

  socket.on('connect', () => {
    console.log('🟢 Socket connected:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('🔴 Socket error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔴 Socket disconnected:', reason);
  });

  return socket;
};

// Call this on logout
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Use this anywhere you need to listen/emit
export const getSocket = () => socket;
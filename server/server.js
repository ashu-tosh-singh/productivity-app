require('express-async-errors');
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { initSocket } = require('./socket/socketHandler');

dotenv.config();

const app = express();
const server = http.createServer(app);

// ── Socket.io setup ───────────────────────────────────────────
// Must allow the same origin as our React app
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

initSocket(io); // Register all socket events

// ── Make io accessible inside controllers ─────────────────────
// We attach it to app so we can pull it out in any controller
// via req.app.get('io')
app.set('io', io);

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ── Database ──────────────────────────────────────────────────
connectDB();

// ── Routes ────────────────────────────────────────────────────
const authRoutes  = require('./routes/authRoutes');
const noteRoutes  = require('./routes/noteRoutes');
const todoRoutes  = require('./routes/todoRoutes');
const eventRoutes = require('./routes/eventRoutes');

app.use('/api/auth',   authRoutes);
app.use('/api/notes',  noteRoutes);
app.use('/api/todos',  todoRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => res.json({ message: 'API is running' }));

// ── Error Handler (always last) ───────────────────────────────
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
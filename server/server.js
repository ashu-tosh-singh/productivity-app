// Load async error handling patch FIRST — before anything else
require('express-async-errors');
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
// http.createServer wraps Express so Socket.io can share the same port
const server = http.createServer(app);

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); // Parse JSON request bodies

// --- DB Connection ---
connectDB();

// Routes
const authRoutes  = require('./routes/authRoutes');
const noteRoutes  = require('./routes/noteRoutes');
const todoRoutes  = require('./routes/todoRoutes');
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/notes',  noteRoutes);
app.use('/api/todos',  todoRoutes);
app.use('/api/events', eventRoutes);

// --- Health check route ---
app.get('/', (req, res) => res.json({ message: 'API is running' }));

// --- Error middleware (always last) ---
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
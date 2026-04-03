# productivity-app

# tree structure
productivity-app/
│
├── client/                          # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                     # Axios instances & API calls
│   │   │   └── axios.js
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   └── common/              # Buttons, Modals, etc.
│   │   ├── context/                 # Global state (Auth, Theme)
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/                   # Custom hooks
│   │   │   └── useSocket.js
│   │   ├── pages/                   # Route-level pages
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Notes/
│   │   │   │   └── Notes.jsx
│   │   │   ├── Todos/
│   │   │   │   └── Todos.jsx
│   │   │   └── Calendar/
│   │   │       └── Calendar.jsx
│   │   ├── socket/                  # Socket.io client setup
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/                 # Route logic (thin routes, fat controllers)
│   │   ├── authController.js
│   │   ├── noteController.js
│   │   ├── todoController.js
│   │   └── eventController.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── errorMiddleware.js       # Global error handler
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Note.js
│   │   ├── Todo.js
│   │   └── Event.js
│   ├── routes/                      # Express routers
│   │   ├── authRoutes.js
│   │   ├── noteRoutes.js
│   │   ├── todoRoutes.js
│   │   └── eventRoutes.js
│   ├── socket/
│   │   └── socketHandler.js         # All Socket.io events
│   ├── .env
│   ├── server.js                    # Entry point
│   └── package.json
│
└── README.md


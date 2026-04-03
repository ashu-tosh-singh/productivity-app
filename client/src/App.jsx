import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import { connectSocket, disconnectSocket } from "./socket/socket";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function Dashboard() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    disconnectSocket(); // Clean up socket on logout
    logout();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {user?.username}!</h2>
      <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>
        Full UI coming in Step 5 🎨
      </p>
      <button
        onClick={handleLogout}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "var(--accent)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default function App() {
  const { loadUser, token } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  // Connect socket whenever we have a token (login or page refresh)
  // Disconnect when token is gone (logout)
  useEffect(() => {
    if (token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

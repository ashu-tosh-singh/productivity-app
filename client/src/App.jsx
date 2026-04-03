import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder — we'll build this in Step 5
function Dashboard() {
  const { user, logout } = useAuthStore();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome, {user?.username}!</h2>
      <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
        Dashboard coming in Step 5
      </p>
      <button
        onClick={logout}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default function App() {
  const { loadUser } = useAuthStore();

  // On every app load, verify the stored token is still valid
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Catch-all → redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
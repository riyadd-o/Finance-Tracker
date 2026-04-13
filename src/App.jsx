import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Loader2 } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';

// Pages
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import ResetPassword from './components/ResetPassword';

import './App.css';

const ProtectedRoute = ({ session, children }) => {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 className="spinner-ring" size={48} />
        <p>Initializing secure session...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar session={session} />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <AuthPage initialMode="login" />} />
            <Route path="/register" element={session ? <Navigate to="/dashboard" /> : <AuthPage initialMode="signup" />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute session={session}>
                  <Dashboard session={session} />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

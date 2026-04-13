import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // 1. Initial session check
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setCheckingSession(false);
    };

    checkInitialSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setMessage('Password updated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="auth-page-wrapper">
        <div className="loading-screen">
          <Loader2 className="spinner-ring" size={48} />
          <p>Verifying secure recovery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-wrapper">
      <motion.div 
        className="auth-card glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="auth-card-inner">
          <span className="auth-badge">Secure Recovery</span>
          <h2 className="auth-title">Reset<span>Password</span></h2>
          
          <AnimatePresence mode="wait">
            {!session ? (
              <motion.div className="auth-error">
                <AlertCircle size={16} />
                <span>Invalid link. Please try again.</span>
                <button className="nav-cta-btn" onClick={() => navigate('/login')} style={{marginTop: '2rem'}}>Back to Login</button>
              </motion.div>
            ) : (
              <form onSubmit={handleReset} className="auth-form">
                <p className="auth-subtitle">Set your new master password.</p>

                {message && <div className="auth-success">{message}</div>}
                {errorMsg && <div className="auth-error">{errorMsg}</div>}

                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-wrap prefix">
                    <Lock size={18} className="input-icon" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-wrap prefix">
                    <Lock size={18} className="input-icon" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading || message}>
                  {loading ? <Loader2 className="spinner-mini" /> : 'Update Password'}
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

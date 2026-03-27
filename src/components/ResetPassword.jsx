import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import './Auth.css';

const ResetPassword = () => {
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

    // 2. Listen for auth changes (Supabase handles the URL hash automatically)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!password || !confirmPassword) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
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
      
      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/';
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
          <p>Verifying secure recovery link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-wrapper">
      <motion.div 
        className="auth-card glass-panel"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
      >
        <div className="auth-card-inner">
          <span className="auth-badge">Security Access</span>
          <h2 className="auth-title">Update<span>Password</span></h2>
          
          <AnimatePresence mode="wait">
            {!session ? (
              <motion.div 
                key="no-session"
                className="auth-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <AlertCircle size={16} />
                  <span>Invalid or expired reset link. Please request a new one.</span>
                </div>
                <button className="back-link" style={{marginTop: '20px'}} onClick={() => window.location.href = '/'}>
                  Go to Login
                </button>
              </motion.div>
            ) : (
              <motion.div key="form">
                <p className="auth-subtitle">Create a new secure master password</p>

                {message && (
                  <div className="auth-success" style={{marginBottom: '20px'}}>
                    {message}
                  </div>
                )}
                
                {errorMsg && (
                  <div className="auth-error" style={{marginBottom: '20px'}}>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                      <AlertCircle size={16} />
                      <span>{errorMsg}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleReset} className="auth-form">
                  <div className="form-group">
                    <label>New Password</label>
                    <div className="input-wrap prefix">
                      <Lock size={18} className="input-icon" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="auth-input"
                        disabled={loading || message}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-wrap prefix">
                      <Lock size={18} className="input-icon" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="auth-input"
                        disabled={loading || message}
                      />
                    </div>
                  </div>

                  <motion.button 
                    type="submit" 
                    className="submit-btn full-width" 
                    disabled={loading || message}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? <Loader2 className="spinner-mini" /> : (
                      <>Commit New Password <ShieldCheck size={18} style={{marginLeft: '8px'}} /></>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

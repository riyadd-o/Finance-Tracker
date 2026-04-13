import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock, ArrowRight, UserPlus, LogIn, KeyRound, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/Auth.css';

const AuthPage = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState(initialMode); 
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setMessage('');

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else if (mode === 'signup') {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        
        if (signUpData.user) {
          await supabase.from('users').insert([{ id: signUpData.user.id, email: signUpData.user.email }]);
        }
        setMessage('Registration successful! Check your email to confirm.');
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <motion.div 
        className="auth-card glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="auth-card-inner">
          <span className="auth-badge">Secure Gateway</span>
          <h2 className="auth-title">
            {mode === 'login' ? 'Welcome Back' : 'Join Our Community'}
          </h2>
          
          <p className="auth-subtitle">
            {mode === 'login' ? 'Enter your credentials to access your vault.' : 'Start your journey to financial freedom today.'}
          </p>

          <AnimatePresence mode="wait">
            {message && <motion.div className="auth-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{message}</motion.div>}
            {errorMsg && (
              <motion.div className="auth-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AlertCircle size={16} /> <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrap prefix">
                <Mail size={18} className="input-icon" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap prefix">
                <Lock size={18} className="input-icon" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
            </div>

            <motion.button type="submit" className="submit-btn" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {loading ? <Loader2 className="spinner-mini" /> : (
                mode === 'login' ? <>Sign In <LogIn size={18} /></> : <>Create Account <UserPlus size={18} /></>
              )}
            </motion.button>
          </form>

          <div className="auth-switch-alt">
            {mode === 'login' ? (
              <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            ) : (
              <p>Already have an account? <Link to="/login">Sign In</Link></p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;

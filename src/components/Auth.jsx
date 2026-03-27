import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock, ArrowRight, UserPlus, LogIn, KeyRound, AlertCircle } from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // login, signup, forgot
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Rate limiting state
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (cooldown > 0 && mode !== 'login') {
      setErrorMsg(`Too many attempts. Please wait ${cooldown} seconds.`);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setMessage('');

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Wrong password or user not found. Please try again.');
          }
          throw error;
        }
      } else if (mode === 'signup') {
        // 1. Pre-check users table for duplicate
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .maybeSingle();

        if (checkError) console.error('Check error:', checkError);
        if (existingUser) {
          throw new Error('Account already exists with this email. Please log in.');
        }

        // 2. Perform SignUp
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        // 3. Insert into users table for our own records/checks
        if (signUpData.user) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([{ id: signUpData.user.id, email: signUpData.user.email }]);
          
          if (insertError) console.error('Insert error:', insertError);
        }

        setMessage('Registration successful! Check your email to confirm your account.');
        setCooldown(60);
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage('Reset instructions sent! Check your email inbox.');
        setCooldown(60);
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setMessage('');
  };

  return (
    <div className="auth-page-wrapper">
      <motion.div 
        className="auth-card glass-panel"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-card-inner">
          <span className="auth-badge">Secure Access</span>
          <h2 className="auth-title">Finance<span>Tracker</span></h2>
          
          <p className="auth-subtitle">
            {mode === 'login' && 'Sign in to access your financial dashboard'}
            {mode === 'signup' && 'Join the community and master your revenue'}
            {mode === 'forgot' && 'Reset your master password securely'}
          </p>

          <AnimatePresence mode="wait">
            {message && (
              <motion.div 
                className="auth-success"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                {message}
              </motion.div>
            )}

            {errorMsg && (
              <motion.div 
                className="auth-error"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrap prefix">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="auth-input"
                  disabled={loading}
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="form-group">
                <div className="label-row">
                  <label>Password</label>
                  {mode === 'login' && (
                    <button type="button" className="forgot-link" onClick={() => switchMode('forgot')}>
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="input-wrap prefix">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="auth-input"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <motion.button 
              type="submit" 
              className="submit-btn full-width" 
              disabled={loading || (cooldown > 0 && mode !== 'login')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <Loader2 className="spinner-mini" /> : (
                <>
                  {mode === 'login' && <>Sign In <LogIn size={18} style={{marginLeft: '8px'}} /></>}
                  {mode === 'signup' && <>Create Account <UserPlus size={18} style={{marginLeft: '8px'}} /></>}
                  {mode === 'forgot' && <>Request Reset <KeyRound size={18} style={{marginLeft: '8px'}} /></>}
                </>
              )}
            </motion.button>
            
            {cooldown > 0 && mode !== 'login' && (
              <p className="cooldown-text">Please wait {cooldown}s before resending</p>
            )}
          </form>

          <div className="auth-switch-alt">
            {mode === 'login' ? (
              <p>New here? <button onClick={() => switchMode('signup')}>Sign Up</button></p>
            ) : mode === 'signup' ? (
              <p>Already have an account? <button onClick={() => switchMode('login')}>Sign In</button></p>
            ) : (
              <p>Back to <button onClick={() => switchMode('login')}>Sign In</button></p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;

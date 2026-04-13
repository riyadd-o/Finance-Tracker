import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogOut, LayoutDashboard, LogIn, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = ({ session }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="navbar glass-nav">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Finance<span>Tracker</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links desktop-only">
          {session ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-link logout-link">
                <LogOut size={18} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/register" className="nav-cta-btn">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="mobile-nav-overlay"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mobile-links">
                {session ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }}>Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                    <Link to="/register" className="mobile-cta" onClick={() => setIsOpen(false)}>Get Started</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Zap, PieChart, ArrowRight, Wallet, Activity, CreditCard } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="hero-badge">
            <Shield size={14} />
            <span>Trusted by 10,000+ users worldwide</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="hero-title">
            Master Your Money, <br />
            <span>Master Your Life.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="hero-subtitle">
            The next generation of personal finance tracking. Beautiful analytics, 
            real-time insights, and absolute privacy for your financial journey.
          </motion.p>
          
          <motion.div variants={itemVariants} className="hero-actions">
            <Link to="/register" className="primary-btn">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="secondary-btn">
              View Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Visual Mockup */}
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <div className="visual-glass-container">
            <div className="visual-element chart-mock">
              <PieChart size={120} strokeWidth={1.5} color="var(--primary)" />
            </div>
            <div className="visual-element card-mock">
              <Wallet size={40} />
              <div className="mock-lines">
                <div className="line long"></div>
                <div className="line short"></div>
              </div>
            </div>
            <div className="visual-element activity-mock">
              <Activity size={40} />
            </div>
          </div>
          <div className="hero-gradient-orb"></div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why FinanceTracker?</h2>
          <p>Everything you need to automate your financial growth.</p>
        </div>
        
        <div className="features-grid">
          {[
            { icon: <Zap />, title: "Real-time Tracking", desc: "Instantly log transactions and see your balance update across all devices." },
            { icon: <PieChart />, title: "Rich Analytics", desc: "Visual breakthroughs in how you spend. Understand your habits in seconds." },
            { icon: <TrendingUp />, title: "Wealth Growth", desc: "Set goals and monitor your progress with intelligent projection tools." },
            { icon: <Shield />, title: "Bank-Grade Security", desc: "Your data is encrypted and secure with Supabase's high-security architecture." }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              className="feature-card glass-panel"
              whileHover={{ y: -10 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="cta-banner">
        <div className="cta-content glass-panel">
          <h2>Ready to transform your finances?</h2>
          <p>Join thousands of others making smarter financial decisions every day.</p>
          <Link to="/register" className="primary-btn large">Start Tracking Now</Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 FinanceTracker. Built for high-performers.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

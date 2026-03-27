import React, { useMemo, useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip, CartesianGrid
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import './AnalyticsDashboard.css';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

const AnalyticsDashboard = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState('allocation'); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Calculate General Stats
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;

  // 2. Prepare Data for Pie Chart
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryMap = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    return Object.keys(categoryMap)
      .map(key => ({ name: key, value: categoryMap[key] }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // 3. Prepare Data for Bar Chart
  const monthlyData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const monthMap = expenses.reduce((acc, t) => {
      acc[new Date(t.date).toLocaleString('default', { month: 'short' })] = (acc[new Date(t.date).toLocaleString('default', { month: 'short' })] || 0) + t.amount;
      return acc;
    }, {});
    return Object.keys(monthMap).map(key => ({ month: key, amount: monthMap[key] }));
  }, [transactions]);

  const customTooltipStyle = {
    backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255, 255, 255, 0.1)', 
    color: '#fff', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    padding: '12px', fontSize: '0.9rem', fontWeight: '600'
  };

  const ChartOne = () => (
    <motion.div 
      initial={{ opacity: 0, x: isMobile ? -20 : 0 }} animate={{ opacity: 1, x: 0 }}
      className="chart-card glass-panel"
    >
      <div className="chart-header">
        <h3>Allocation Summary</h3>
        <p>Distribution by category</p>
      </div>
      {categoryData.length > 0 ? (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={6} dataKey="value" stroke="none">
                {categoryData.map((e, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} cornerRadius={8} />)}
              </Pie>
              <PieTooltip contentStyle={customTooltipStyle} formatter={(v) => `$${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : <div className="empty-chart">No data available</div>}
    </motion.div>
  );

  const ChartTwo = () => (
    <motion.div 
      initial={{ opacity: 0, x: isMobile ? 20 : 0 }} animate={{ opacity: 1, x: 0 }}
      className="chart-card glass-panel"
    >
      <div className="chart-header">
        <h3>Financial Velocity</h3>
        <p>Outflow trends (Monthly)</p>
      </div>
      {monthlyData.length > 0 ? (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <BarTooltip cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 8 }} contentStyle={customTooltipStyle} />
              <Bar dataKey="amount" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={28} />
              <defs><linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="var(--primary)" /><stop offset="100%" stopColor="var(--secondary)" /></linearGradient></defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : <div className="empty-chart">Insufficient data</div>}
    </motion.div>
  );

  return (
    <div className="analytics-container">
      <div className="stats-main-wrapper">
        <motion.div className="stat-card liquidity-card glass-panel">
          <div className="stat-icon-wrapper wallet-bg"><Wallet size={24} /></div>
          <div className="stat-content">
            <p className="stat-title">Current Liquidity</p>
            <h2 className="stat-value big-value">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          </div>
        </motion.div>

        <div className="stats-secondary-grid">
          <motion.div className="stat-card glass-panel compact" whileHover={{ y: -3 }}>
            <div className="stat-icon-wrapper income-bg small"><TrendingUp size={18} /></div>
            <div className="stat-content"><p className="stat-title">Revenue</p><h2 className="stat-value text-success">+${income.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2></div>
          </motion.div>
          <motion.div className="stat-card glass-panel compact" whileHover={{ y: -3 }}>
            <div className="stat-icon-wrapper expense-bg small"><TrendingDown size={18} /></div>
            <div className="stat-content"><p className="stat-title">Outflow</p><h2 className="stat-value text-danger">-${expense.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2></div>
          </motion.div>
        </div>
      </div>

      <div className="charts-section">
        <div className="mobile-tabs glass-panel">
          <button className={`tab-btn ${activeTab === 'allocation' ? 'active' : ''}`} onClick={() => setActiveTab('allocation')}>
            <PieIcon size={18} /><span>Allocation</span>
          </button>
          <button className={`tab-btn ${activeTab === 'velocity' ? 'active' : ''}`} onClick={() => setActiveTab('velocity')}>
            <BarChart3 size={18} /><span>Velocity</span>
          </button>
        </div>

        <div className="charts-grid-responsive">
          {isMobile ? (
            <AnimatePresence mode="wait">
              {activeTab === 'allocation' ? <ChartOne key="1" /> : <ChartTwo key="2" />}
            </AnimatePresence>
          ) : (
            <React.Fragment><ChartOne /><ChartTwo /></React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

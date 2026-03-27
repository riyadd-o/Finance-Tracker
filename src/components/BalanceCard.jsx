import React from 'react';
import './BalanceCard.css';

const BalanceCard = ({ balance, income, expense }) => {
  return (
    <div className="balance-card glass-panel">
      <div className="balance-top">
        <p className="subtitle">Total Balance</p>
        <h2 className="main-balance">${balance.toFixed(2)}</h2>
      </div>
      
      <div className="stats-row">
        <div className="stat-item income">
          <div className="icon-wrapper bg-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="stat-text">
            <span>Income</span>
            <h4>${income.toFixed(2)}</h4>
          </div>
        </div>
        
        <div className="stat-divider"></div>

        <div className="stat-item expense">
          <div className="icon-wrapper bg-danger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="stat-text">
            <span>Expense</span>
            <h4>${expense.toFixed(2)}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;

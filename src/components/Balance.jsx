import React from 'react';

const Balance = ({ transactions }) => {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = transactions
    .filter(item => item.type === 'income')
    .reduce((acc, item) => (acc += item.amount), 0)
    .toFixed(2);

  const expense = transactions
    .filter(item => item.type === 'expense')
    .reduce((acc, item) => (acc += item.amount), 0)
    .toFixed(2);

  return (
    <div className="balance-container glass">
      <div className="balance-summary">
        <h4>Your Balance</h4>
        <h1 id="balance" className={total >= 0 ? 'plus' : 'minus'}>
          {total < 0 ? '-' : ''}${Math.abs(total).toFixed(2)}
        </h1>
      </div>

      <div className="inc-exp-container">
        <div>
          <h4>Income</h4>
          <p id="money-plus" className="money plus">+${income}</p>
        </div>
        <div>
          <h4>Expense</h4>
          <p id="money-minus" className="money minus">-${expense}</p>
        </div>
      </div>
    </div>
  );
};

export default Balance;

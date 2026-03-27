import React from 'react';
import TransactionItem from './TransactionItem';
import './TransactionList.css';

const TransactionList = ({ transactions, deleteTransaction, onEdit }) => {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions found. Add a new one to get started!</p>
      </div>
    );
  }

  return (
    <ul className="transaction-list">
      {transactions.map(transaction => (
        <TransactionItem 
          key={transaction.id} 
          transaction={transaction}
          onDelete={() => deleteTransaction(transaction.id)}
          onEdit={() => onEdit(transaction)}
        />
      ))}
    </ul>
  );
};

export default TransactionList;

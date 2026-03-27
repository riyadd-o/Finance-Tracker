import React, { useState, useEffect } from 'react';

const AddTransaction = ({ addTransaction, editTransaction, editingTransaction, clearEdit }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setType('expense');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const onSubmit = e => {
    e.preventDefault();

    if (title.trim() === '' || amount === '' || category.trim() === '') {
      alert('Please fill in all fields');
      return;
    }

    const newTransaction = {
      id: editingTransaction ? editingTransaction.id : Math.floor(Math.random() * 100000000),
      title,
      amount: +amount,
      type,
      category,
      date
    };

    if (editingTransaction) {
      editTransaction(newTransaction);
    } else {
      addTransaction(newTransaction);
    }
    
    resetForm();
    if (clearEdit) clearEdit();
  };

  return (
    <div className="add-transaction-container glass">
      <h3>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group row">
            <div className="form-control">
            <label htmlFor="title">Title</label>
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter title..." 
            />
            </div>
            <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0.00" 
                step="0.01"
            />
            </div>
        </div>

        <div className="form-group row">
            <div className="form-control">
            <label htmlFor="type">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>
            </div>
            <div className="form-control">
            <label htmlFor="category">Category</label>
            <input 
                type="text" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                placeholder="e.g. Food, Rent..." 
            />
            </div>
        </div>

        <div className="form-control">
          <label htmlFor="date">Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>

        <div className="button-group">
            <button className="btn submit-btn">
                {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
            {editingTransaction && (
                <button type="button" className="btn cancel-btn" onClick={() => clearEdit()}>
                    Cancel
                </button>
            )}
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;

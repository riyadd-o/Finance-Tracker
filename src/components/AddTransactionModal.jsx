import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import './AddTransactionModal.css';

const AddTransactionModal = ({ onClose, addTransaction, updateTransaction, editingTransaction }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        title: editingTransaction.title,
        amount: editingTransaction.amount.toString(),
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: editingTransaction.date
      });
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) return;

    const transactionObj = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingTransaction) {
      updateTransaction({ ...transactionObj, id: editingTransaction.id });
    } else {
      addTransaction(transactionObj);
    }
  };

  return (
    <motion.div 
      className="modal-backdrop" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content glass-panel" 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-pill">
              <Activity size={20} />
            </div>
            <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          </div>
          <motion.button 
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="close-btn" 
            onClick={onClose}
          >
            <X size={24} />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>title</label>
            <div className="input-wrap">
              <input 
                name="title" 
                type="text" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="e.g. Server Allocation" 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount</label>
              <div className="input-wrap prefix">
                <DollarSign size={18} className="input-icon" />
                <input 
                  name="amount" 
                  type="number" 
                  step="0.01" 
                  value={formData.amount} 
                  onChange={handleChange} 
                  placeholder="0.00" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>type</label>
              <div className="input-wrap">
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <div className="input-wrap prefix">
                <Tag size={18} className="input-icon" />
                <input 
                  name="category" 
                  type="text" 
                  value={formData.category} 
                  onChange={handleChange} 
                  placeholder="e.g. Infrastructure" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>date</label>
              <div className="input-wrap prefix">
                <Calendar size={18} className="input-icon" />
                <input 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          </div>

          <motion.button 
            type="submit" 
            className="submit-btn full-width"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddTransactionModal;

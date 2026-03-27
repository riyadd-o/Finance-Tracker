import React from 'react';
import { 
  Trash2, Edit2, 
  ShoppingBag, Video, Coffee, Home, Heart,
  Car, Briefcase, Minus, Plus, CreditCard,
  Zap, Package, Utensils
} from 'lucide-react';
import { motion } from 'framer-motion';
import './TransactionItem.css';

const getCategoryIcon = (category) => {
  const cat = category.toLowerCase();
  
  if (cat.includes('food') || cat.includes('restaurant') || cat.includes('eat')) return <Utensils size={20} />;
  if (cat.includes('transport') || cat.includes('car') || cat.includes('uber')) return <Car size={20} />;
  if (cat.includes('shopping') || cat.includes('clothes') || cat.includes('amazon')) return <ShoppingBag size={20} />;
  if (cat.includes('rent') || cat.includes('home') || cat.includes('house')) return <Home size={20} />;
  if (cat.includes('salary') || cat.includes('wage') || cat.includes('work')) return <Briefcase size={20} />;
  if (cat.includes('entertainment') || cat.includes('subscription') || cat.includes('netflix')) return <Video size={20} />;
  if (cat.includes('health') || cat.includes('doctor') || cat.includes('gym')) return <Heart size={20} />;
  if (cat.includes('utilities') || cat.includes('bill') || cat.includes('electricity')) return <Zap size={20} />;
  if (cat.includes('coffee') || cat.includes('starbucks') || cat.includes('cafe')) return <Coffee size={20} />;
  
  return <Package size={20} />;
};

const TransactionItem = ({ transaction, onDelete, onEdit }) => {
  const isIncome = transaction.type === 'income';
  
  return (
    <motion.li 
      className="transaction-item"
      whileHover={{ scale: 1.01, x: 4 }}
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
    >
      <div className="item-main">
        <div className={`category-icon-wrapper ${isIncome ? 'income-theme' : 'expense-theme'}`}>
          {getCategoryIcon(transaction.category)}
        </div>
        
        <div className="item-info">
          <div className="item-title">{transaction.title}</div>
          <div className="item-audit">
            <span className="audit-category">{transaction.category}</span>
            <span className="audit-dot"></span>
            <span className="audit-date">{new Date(transaction.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
      
      <div className="item-trailing">
        <div className={`item-nominal ${isIncome ? 'text-success' : 'text-danger'}`}>
          {isIncome ? <Plus size={14} className="prefix-icon" /> : <Minus size={14} className="prefix-icon" />}
          ${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        
        <div className="item-ops">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.9 }}
            className="op-btn edit-op" 
            onClick={onEdit}
            title="Update Protocol"
          >
            <Edit2 size={16} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.12)' }}
            whileTap={{ scale: 0.9 }}
            className="op-btn delete-op" 
            onClick={onDelete}
            title="Terminate Entry"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.li>
  );
};

export default TransactionItem;

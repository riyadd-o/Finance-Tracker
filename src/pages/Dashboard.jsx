import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import Filters from '../components/Filters';
import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1
    } 
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

const Dashboard = ({ session }) => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session]);

  const fetchTransactions = async () => {
    if (!session?.user) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setTransactions(data);
    } catch (error) {
      console.log('Error fetching transactions:', error);
    }
  };

  const addTransaction = async (transaction) => {
    if (!session?.user) return;
    try {
      const { error } = await supabase
        .from('transactions')
        .insert([{
          title: transaction.title,
          amount: parseFloat(transaction.amount),
          type: transaction.type,
          category: transaction.category,
          date: transaction.date,
          user_id: session.user.id
        }]);

      if (error) throw error;
      
      setIsModalOpen(false);
      fetchTransactions();
    } catch (error) {
      console.log('Error adding transaction:', error);
    }
  };

  const updateTransaction = async (updatedTx) => {
    if (!session?.user) return;
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          title: updatedTx.title,
          amount: parseFloat(updatedTx.amount),
          type: updatedTx.type,
          category: updatedTx.category,
          date: updatedTx.date
        })
        .match({ id: updatedTx.id, user_id: session.user.id });

      if (error) throw error;
      
      setEditingTransaction(null);
      setIsModalOpen(false);
      fetchTransactions();
    } catch (error) {
      console.log('Error updating transaction:', error);
    }
  };

  const deleteTransaction = async (id) => {
    if (!session?.user) return;
    if (window.confirm("Delete this transaction?")) {
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .match({ id, user_id: session.user.id });

        if (error) throw error;
        
        fetchTransactions();
      } catch (error) {
        console.log('Error deleting transaction:', error);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchType = filterType === 'all' || t.type === filterType;
    const matchCategory = t.category.toLowerCase().includes(filterCategory.toLowerCase());
    return matchType && matchCategory;
  });

  return (
    <div className="app-layout">
      <motion.div 
        className="container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.header className="header glass-panel" variants={childVariants}>
          <h1>Welcome Back, <span>{session.user.email.split('@')[0]}</span></h1>
          <p>Your financial overview is up to date.</p>
        </motion.header>

        <motion.div variants={childVariants}>
          <AnalyticsDashboard transactions={transactions} />
        </motion.div>

        <motion.div className="history-section glass-panel" variants={childVariants}>
          <div className="history-header">
            <h3>Recent Ledger</h3>
          </div>
          
          <Filters 
            filterType={filterType} 
            setFilterType={setFilterType}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />

          <TransactionList 
            transactions={filteredTransactions} 
            deleteTransaction={deleteTransaction}
            onEdit={handleEdit}
          />
        </motion.div>
      </motion.div>

      <motion.button 
        className="floating-add-btn" 
        whileHover={{ y: -8, scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={32} />
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <AddTransactionModal 
            onClose={handleCloseModal}
            addTransaction={addTransaction}
            updateTransaction={updateTransaction}
            editingTransaction={editingTransaction}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

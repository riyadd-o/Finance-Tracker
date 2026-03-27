import React from 'react';
import { Search, Filter } from 'lucide-react';
import './Filters.css';

const Filters = ({ filterType, setFilterType, filterCategory, setFilterCategory }) => {
  return (
    <div className="filters-container">
      <div className="filter-box type-filter">
        <Filter className="filter-icon" size={18} />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Transactions</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="filter-box search-filter">
        <Search className="filter-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search categories..." 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Filters;

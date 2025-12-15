import React, { useState } from 'react';
import { IoSearch } from 'react-icons/io5';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Search icon */}
      <span className="search-icon">
        <IoSearch size={20} />
      </span>
      
      <input
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search blogs..."
      />
      
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;
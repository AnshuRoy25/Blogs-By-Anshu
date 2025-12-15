import React, { useState } from 'react';

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
      <span className="search-icon">🔍</span>
      
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
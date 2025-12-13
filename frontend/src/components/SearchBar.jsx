import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  // Create a "memory box" that stores the search text
  const [searchTerm, setSearchTerm] = useState('');
  
  // When user types, update the memory box
  const handleChange = (e) => {
    setSearchTerm(e.target.value);  // e.target.value = what user typed
  };
  
  // When user clicks search button, send the text to parent
  const handleSubmit = (e) => {
    e.preventDefault();  // Don't reload page
    if (searchTerm.trim()) {  // If user actually typed something
      onSearch(searchTerm);  // Tell parent what to search for
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={searchTerm}           // Show what's in memory
        onChange={handleChange}      // Update memory when user types
        placeholder="Search blogs..."
      />
      <button type="submit">🔍</button>
    </form>
  );
}

export default SearchBar;

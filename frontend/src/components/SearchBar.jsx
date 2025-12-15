import React from 'react';
import { IoSearch } from 'react-icons/io5';

function SearchBar({ onSearch, searchTerm }) {
  const handleChange = (e) => {
    // Trigger search on every keystroke
    onSearch(e.target.value);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* Search icon */}
      <span className="search-icon">
        <IoSearch size={20} />
      </span>
      
      <input
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search blogs..."
      />
      
      {/* Hide submit button since search is automatic */}
      <button type="submit" style={{ display: 'none' }}>Search</button>
    </form>
  );
}

export default SearchBar;
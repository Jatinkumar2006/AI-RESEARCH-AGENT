// Simple reusable search bar component
function SearchBar({ query, setQuery, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        placeholder="Enter topic..."
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={onSearch}
        disabled={!query.trim()}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
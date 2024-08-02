// SearchBar.jsx
import { useState, useRef } from "react";

const SearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const searchFormRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <div id="form">
      <input
        type="text"
        value={search}
        id="keyword"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button ref={searchFormRef} id="submit_btn" type="submit" onClick={handleSearch}>
        검색
      </button>
    </div>
  );
};

export default SearchBar;

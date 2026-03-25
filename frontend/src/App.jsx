import { useState, useEffect } from "react";
import "./App.css";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="app">
      <h1 className="title">Company Search</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search companies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="status">Searching...</p>}

      {!loading && query && results.length === 0 && (
        <p className="status">No results found for "{query}"</p>
      )}

      {results.length > 0 && (
        <ul className="results">
          {results.map((company) => (
            <li key={company.id}>{company.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
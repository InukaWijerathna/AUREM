import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get('keyword') || '');

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.trim()) navigate(`/products?keyword=${encodeURIComponent(term.trim())}`);
    }, 400),
    []
  );

  const handleChange = (e) => {
    setValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) navigate(`/products?keyword=${encodeURIComponent(value.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search pieces…"
        className="w-full pl-9 pr-4 py-2 bg-transparent border border-sand-gold/60 text-sm text-espresso placeholder-mid-gold font-sans focus:outline-none focus:border-primary-600 transition-colors"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mid-gold" strokeWidth={1.5} />
    </form>
  );
}

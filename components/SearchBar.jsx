import { useState, useEffect, useRef } from 'react';

const SearchBar = ({
  label = 'Search fishing spots',
  placeholder = 'Search locations, lakes, or access points',
  suggestionsEndpoint = '/api/spots/search',
  minimumQueryLength = 2,
  debounceMs = 250,
  maxResults = 6,
  onSelectSpot = () => {},
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [error, setError] = useState('');
  const listboxId = 'search-suggestions';
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < minimumQueryLength) {
      setSuggestions([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    const handler = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(
          `${suggestionsEndpoint}?q=${encodeURIComponent(query.trim())}&limit=${maxResults}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error('Unable to load fishing spots');
        const data = await response.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('No results. Refine your search or try a nearby location.');
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, suggestionsEndpoint, debounceMs, maxResults, minimumQueryLength]);

  const handleSelect = (spot) => {
    setQuery(spot?.name || '');
    setSuggestions([]);
    setFocusedIndex(-1);
    onSelectSpot(spot);
  };

  const handleKeyDown = (event) => {
    if (!suggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' && focusedIndex >= 0) {
      event.preventDefault();
      handleSelect(suggestions[focusedIndex]);
    } else if (event.key === 'Escape') {
      setSuggestions([]);
      setFocusedIndex(-1);
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
      const id = `${listboxId}-option-${focusedIndex}`;
      inputRef.current?.setAttribute('aria-activedescendant', id);
    } else {
      inputRef.current?.removeAttribute('aria-activedescendant');
    }
  }, [focusedIndex, suggestions.length]);

  return (
    <div className="w-full max-w-2xl">
      <label htmlFor="fishing-search" className="block text-sm font-medium text-slate-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="flex items-center rounded-ui border border-slate-200 bg-surface shadow-card focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
          <svg
            className="ml-3 h-5 w-5 text-slate-500"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Search"
          >
            <path
              d="M11 4a7 7 0 0 1 5.523 11.238l3.62 3.62a1 1 0 0 1-1.415 1.415l-3.62-3.62A7 7 0 1 1 11 4zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
              fill="currentColor"
            />
          </svg>
          <input
            ref={inputRef}
            id="fishing-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setFocusedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={suggestions.length > 0}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-3 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setFocusedIndex(-1);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (focusedIndex >= 0 && suggestions[focusedIndex]) {
                handleSelect(suggestions[focusedIndex]);
              }
            }}
            className="m-2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-ui bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:bg-accent"
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="mt-2 text-sm text-slate-500" role="status">
            Finding fishing spots near your query...
          </p>
        )}

        {error && !loading && (
          <p className="mt-2 text-sm text-rose-600" role="alert">
            {error}
          </p>
        )}

        {suggestions.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-10 mt-2 w-full rounded-ui border border-slate-200 bg-surface shadow-card"
          >
            {suggestions.map((spot, index) => (
              <li
                key={spot.id ?? spot.name ?? index}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={focusedIndex === index}
                className={`cursor-pointer border-b border-slate-100 px-4 py-3 text-sm text-slate-900 last:border-none ${
                  focusedIndex === index ? 'bg-slate-100' : 'bg-white'
                } hover:bg-slate-50`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(spot)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <p className="font-semibold">{spot.name}</p>
                <p className="text-xs text-slate-500">{spot.region || spot.waterbody || 'Waterbody unknown'}</p>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Powered by fishing-spot-finder data — refine searches by waterbody, species, or nearby towns.
        </p>
      </div>
    </div>
  );
};

export default SearchBar;
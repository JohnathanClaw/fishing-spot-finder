import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Map', href: '/map' },
  { label: 'Reports', href: '/reports' },
  { label: 'Search', href: '/search' },
  { label: 'About', href: '/about' }
];

const brand = 'fishing-spot-finder';

const Search = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/fishing_spots?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search spots');
      const data = await res.json();
      setResults(data.data || []);
    } catch (err) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Search Fishing Spots - fishing-spot-finder</title>
      </Head>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Inter',sans-serif]">
        <Header brand={brand} navItems={navItems} />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-semibold mb-6">Search Fishing Spots</h1>
          <SearchBar onSearch={handleSearch} />
          {loading && <p>Searching...</p>}
          {error && <p className="text-red-600">{error}</p>}
          <ul className="space-y-4 mt-6">
            {results.map((spot) => (
              <li key={spot.id} className="p-4 border rounded shadow-sm bg-white">
                <div className="font-semibold">{spot.name}</div>
                <div className="text-sm text-gray-600">{spot.location}</div>
              </li>
            ))}
          </ul>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Search;

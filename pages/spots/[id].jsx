import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SpotPopup from '../../components/SpotPopup';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Map', href: '/map' },
  { label: 'Reports', href: '/reports' },
  { label: 'Search', href: '/search' },
  { label: 'About', href: '/about' }
];

const brand = 'fishing-spot-finder';

const SpotDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchSpot = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/fishing_spots/${id}`);
        if (!res.ok) throw new Error('Failed to load spot');
        const data = await res.json();
        setSpot(data.data || null);
      } catch (err) {
        setError(err.message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };
    fetchSpot();
  }, [id]);

  return (
    <>
      <Head>
        <title>Fishing Spot Details - fishing-spot-finder</title>
      </Head>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Inter',sans-serif]">
        <Header brand={brand} navItems={navItems} />
        <main className="max-w-2xl mx-auto px-4 py-12">
          {loading && <p>Loading spot...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {spot && <SpotPopup spot={spot} />}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SpotDetail;

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Map', href: '/map' },
  { label: 'Reports', href: '/reports' },
  { label: 'Search', href: '/search' },
  { label: 'About', href: '/about' }
];

const brand = 'fishing-spot-finder';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const reviewsRes = await fetch('/api/spot_reviews');
        if (!reviewsRes.ok) throw new Error('Failed to load reports');
        const reviewsData = await reviewsRes.json();
        setReports(reviewsData.data || []);

        const spotsRes = await fetch('/api/fishing_spots');
        if (!spotsRes.ok) throw new Error('Failed to load spots');
        const spotsData = await spotsRes.json();
        setSpots(spotsData.data || []);
      } catch (err) {
        setError(err.message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Fishing Reports - fishing-spot-finder</title>
      </Head>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Inter',sans-serif]">
        <Header brand={brand} navItems={navItems} />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-semibold mb-6">Recent Fishing Reports</h1>
          {loading && <p>Loading reports...</p>}
          {error && <p className="text-red-600">{error}</p>}
          <ul className="space-y-4">
            {reports.map((report) => (
              <li key={report.id} className="p-4 border rounded shadow-sm bg-white">
                <div className="font-semibold">{report.title}</div>
                <div className="text-sm text-gray-600">{report.date}</div>
                <div>{report.content}</div>
              </li>
            ))}
          </ul>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Reports;

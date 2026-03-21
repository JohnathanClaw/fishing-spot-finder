import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Map', href: '/map' },
  { label: 'Reports', href: '/reports' },
  { label: 'Search', href: '/search' },
  { label: 'About', href: '/about' }
];

const brand = 'fishing-spot-finder';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/user_settings');
        if (!res.ok) {
          throw new Error('Unable to load user settings');
        }
        const data = await res.json();
        setSettings(data.data || {});
      } catch (err) {
        setError(err.message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      <Head>
        <title>Account Settings - fishing-spot-finder</title>
      </Head>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Inter',sans-serif]">
        <Header brand={brand} navItems={navItems} />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-semibold mb-6">Account Settings</h1>
          {loading && <p>Loading settings...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {settings && (
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Email:</span> {settings.email || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Notifications:</span> {settings.notifications ? 'On' : 'Off'}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Settings;

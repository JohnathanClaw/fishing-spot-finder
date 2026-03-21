import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchSpots = async () => {
      try {
        const res = await fetch('/api/fishing-spots');
        if (!res.ok) {
          throw new Error('Failed to load fishing spots');
        }
        const data = await res.json();
        if (isMounted) {
          setSpots(Array.isArray(data.data) ? data.data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchSpots();
    return () => {
      isMounted = false;
    };
  }, []);

  const renderSpotContent = () => {
    if (loading) {
      return <p className="text-muted">Loading...</p>;
    }
    if (error) {
      return <p className="text-error">Error: {error}</p>;
    }
    if (!spots.length) {
      return <p className="text-muted">No fishing spots found. Be the first to add one!</p>;
    }
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {spots.slice(0, 6).map((spot) => (
          <Link
            key={spot.id}
            href={`/spots/${spot.id}`}
            className="flex flex-col justify-between rounded-ui border border-[var(--border)] bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <div>
              <h3 className="text-lg font-semibold text-[#0f172a]">{spot.name}</h3>
              <p className="mt-2 text-sm text-[#475569] line-clamp-3">{spot.description}</p>
            </div>
            <dl className="mt-4 space-y-2 text-sm text-[#0f172a]">
              <div className="flex justify-between">
                <dt className="text-muted">Latitude</dt>
                <dd>{spot.latitude}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Longitude</dt>
                <dd>{spot.longitude}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Created</dt>
                <dd>{new Date(spot.created_at).toLocaleDateString()}</dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg text-[#0f172a]">
      <Head>
        <title>fishing-spot-finder - Home</title>
        <meta name="description" content="Landing page introducing fishing-spot-finder, your hub for discovering prime fishing locations." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <section className="rounded-ui border border-[var(--border)] bg-surface p-8 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#2563eb]">Welcome to fishing-spot-finder</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-[#0f172a]">
            Discover hidden waters with fishing-spot-finder
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#475569]">
            fishing-spot-finder surfaces community-vetted fishing locations with detailed notes, precise coordinates, and
            trustworthy reviews so you can spend more time casting and less time guessing.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/map"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-ui bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Explore live map
            </Link>
            <Link
              href="/search"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-ui border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[#0f172a] transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Search nearby waters
            </Link>
            <Link
              href="/account"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-ui border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[#0f172a] transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Manage your account
            </Link>
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Precise coordinates',
              description: 'Every entry includes decimal latitude and longitude straight from verified scouts.',
            },
            {
              title: 'Community reviews',
              description: 'Check real ratings and feedback from anglers who have fished the spot before you.',
            },
            {
              title: 'Smart preferences',
              description: 'Set notification preferences and preferred radius to tailor discovery alerts.',
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-ui border border-[var(--border)] bg-surface p-6 shadow-card">
              <h3 className="text-lg font-semibold text-[#0f172a]">{feature.title}</h3>
              <p className="mt-3 text-sm text-[#475569]">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 rounded-ui border border-[var(--border)] bg-surface p-8 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#2563eb]">Community intel</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#0f172a]">Recent fishing spots shared by the crew</h2>
              <p className="mt-2 text-sm text-[#475569]">Tap a card to dive into coordinates, descriptions, and on-the-water notes.</p>
            </div>
            <Link
              href="/spots/new"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-ui bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Add a fishing spot
            </Link>
          </div>
          <div className="mt-8">{renderSpotContent()}</div>
        </section>

        <section className="mt-14 rounded-ui border border-[var(--border)] bg-[#0f172a] p-8 text-white shadow-card">
          <h2 className="text-2xl font-semibold">Ready to plan your next cast?</h2>
          <p className="mt-3 max-w-2xl text-sm text-[#e2e8f0]">
            Build your personalized scouting list, save favorite fishing spots, and get notified when new reviews land in your radius.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-ui bg-white px-6 py-3 text-sm font-semibold text-[#0f172a] transition hover:bg-[#e2e8f0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Create a free account
            </Link>
            <Link
              href="/learn-more"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-ui border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Learn more about the mission
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
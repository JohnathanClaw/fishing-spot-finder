import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Map from '../components/Map';
import SpotPopup from '../components/SpotPopup';
import SearchBar from '../components/SearchBar';

const MapPage = () => {
  const [spots, setSpots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [radiusKm, setRadiusKm] = useState(25);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const spotRes = await fetch('/api/fishing_spots');
        if (!spotRes.ok) throw new Error('Failed to load fishing spots');
        const spotJson = await spotRes.json();
        const reviewRes = await fetch('/api/spot_reviews');
        if (!reviewRes.ok) throw new Error('Failed to load spot reviews');
        const reviewJson = await reviewRes.json();
        if (!active) return;
        setSpots(Array.isArray(spotJson.data) ? spotJson.data : []);
        setReviews(Array.isArray(reviewJson.data) ? reviewJson.data : []);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unexpected error');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => setUserLocation(null),
      { enableHighAccuracy: true, maximumAge: 600000 }
    );
  }, []);

  const reviewSummary = useMemo(() => {
    const summary = {};
    reviews.forEach((rev) => {
      if (!summary[rev.fishing_spot_id]) {
        summary[rev.fishing_spot_id] = { total: 0, count: 0 };
      }
      summary[rev.fishing_spot_id].total += rev.rating;
      summary[rev.fishing_spot_id].count += 1;
    });
    return summary;
  }, [reviews]);

  const getDistanceKm = (spot) => {
    if (!userLocation) return 0;
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(spot.latitude - userLocation.latitude);
    const dLon = toRad(spot.longitude - userLocation.longitude);
    const lat1 = toRad(userLocation.latitude);
    const lat2 = toRad(spot.latitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSearchInput = (value) => {
    if (typeof value === 'string') {
      setSearchTerm(value);
    } else if (value && value.target) {
      setSearchTerm(value.target.value);
    }
  };

  const filteredSpots = useMemo(() => {
    return spots
      .filter((spot) => {
        if (!searchTerm) return true;
        const query = searchTerm.toLowerCase();
        return (
          spot.name?.toLowerCase().includes(query) ||
          spot.description?.toLowerCase().includes(query)
        );
      })
      .filter((spot) => {
        if (!userLocation) return true;
        return getDistanceKm(spot) <= radiusKm;
      });
  }, [spots, searchTerm, radiusKm, userLocation]);

  if (loading) {
    return (
      <>
        <Head>
          <title>fishing-spot-finder - Map View</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          />
        </Head>
        <div className="min-h-screen bg-bg text-[#0f172a]">
          <Header />
          <main className="flex items-center justify-center py-24">
            <p className="text-lg font-medium">Loading...</p>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>fishing-spot-finder - Map View</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          />
        </Head>
        <div className="min-h-screen bg-bg text-[#0f172a]">
          <Header />
          <main className="mx-auto max-w-3xl py-24 px-6">
            <div className="rounded-ui border border-[#e2e8f0] bg-surface p-8 text-center shadow-card">
              <h1 className="text-2xl font-semibold mb-4">
                fishing-spot-finder Map View
              </h1>
              <p className="text-[#dc2626]">{error}</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!filteredSpots.length) {
    return (
      <>
        <Head>
          <title>fishing-spot-finder - Map View</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          />
        </Head>
        <div className="min-h-screen bg-bg text-[#0f172a]">
          <Header />
          <main className="mx-auto max-w-5xl py-24 px-6 space-y-6">
            <div className="flex flex-col gap-4 rounded-ui border border-[#e2e8f0] bg-surface p-6 shadow-card">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <SearchBar
                  value={searchTerm}
                  onChange={handleSearchInput}
                  onSearch={handleSearchInput}
                  label="Search fishing-spot-finder locations"
                />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#64748b]">
                    Radius (km)
                  </span>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    step="5"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="h-11 w-24 rounded-ui border border-[#e2e8f0] bg-white px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-ui border border-[#e2e8f0] bg-surface p-10 text-center shadow-card">
              <h2 className="text-xl font-semibold mb-2">
                No fishing spots found
              </h2>
              <p className="text-[#64748b]">
                Try expanding your radius or updating the search to see more
                fishing-spot-finder locations.
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>fishing-spot-finder - Map View</title>
        <meta
          name="description"
          content="Interactive fishing-spot-finder map view with ratings and radius filters."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </Head>
      <div className="min-h-screen bg-bg text-[#0f172a]">
        <Header />
        <main className="mx-auto flex max-w-6xl flex-col gap-6 py-10 px-6 lg:flex-row">
          <section className="w-full space-y-6 lg:w-2/3">
            <div className="rounded-ui border border-[#e2e8f0] bg-surface p-4 shadow-card">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <SearchBar
                  value={searchTerm}
                  onChange={handleSearchInput}
                  onSearch={handleSearchInput}
                  label="Search fishing-spot-finder spots"
                />
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-[#64748b]">
                    Radius (km)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-40 accent-accent"
                  />
                  <span className="text-sm font-semibold text-accent">
                    {radiusKm} km
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-ui border border-[#e2e8f0] bg-surface shadow-card">
              <Map
                spots={filteredSpots}
                center={userLocation}
                onSpotSelect={setSelectedSpot}
                activeSpotId={selectedSpot?.id}
              />
            </div>
            {selectedSpot && (
              <SpotPopup
                spot={selectedSpot}
                ratingSummary={reviewSummary[selectedSpot.id]}
                onClose={() => setSelectedSpot(null)}
              />
            )}
          </section>
          <aside className="w-full rounded-ui border border-[#e2e8f0] bg-surface p-6 shadow-card lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              fishing-spot-finder highlights
            </h2>
            <ul className="space-y-4">
              {filteredSpots.map((spot) => {
                const summary = reviewSummary[spot.id];
                const avgRating = summary
                  ? (summary.total / summary.count).toFixed(1)
                  : 'No ratings';
                return (
                  <li
                    key={spot.id}
                    className="rounded-ui border border-[#e2e8f0] p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{spot.name}</h3>
                        <p className="text-sm text-[#64748b]">
                          {spot.description}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#2563eb]/10 px-3 py-1 text-sm font-medium text-accent">
                        {avgRating}
                      </span>
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-[#64748b]">
                      <div>
                        <dt className="font-medium text-[#0f172a]">
                          Latitude
                        </dt>
                        <dd>{Number(spot.latitude).toFixed(4)}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-[#0f172a]">
                          Longitude
                        </dt>
                        <dd>{Number(spot.longitude).toFixed(4)}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-[#0f172a]">Created</dt>
                        <dd>
                          {new Date(spot.created_at).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-[#0f172a]">
                          Distance
                        </dt>
                        <dd>
                          {userLocation
                            ? `${getDistanceKm(spot).toFixed(1)} km`
                            : '—'}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedSpot(spot)}
                        className="flex-1 rounded-ui bg-accent px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                      >
                        Show on map
                      </button>
                      <Link
                        href={`/spots/${spot.id}`}
                        className="flex-1 rounded-ui border border-accent px-4 py-2 text-center text-sm font-semibold text-accent transition hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                      >
                        View details
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MapPage;
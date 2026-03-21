import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error('Unable to load team members');
        }
        const data = await res.json();
        setTeamMembers(data.data || []);
      } catch (err) {
        setError(err.message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <>
      <Head>
        <title>fishing-spot-finder - About</title>
        <meta
          name="description"
          content="Learn about the fishing-spot-finder mission, team, and how to get in touch."
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </Head>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Inter',sans-serif]">
        <Header brand={brand} navItems={navItems} />
        <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
          <section className="bg-[var(--surface)] rounded-[var(--radius)] shadow-card border border-[var(--border)] p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)] mb-4">
              About fishing-spot-finder
            </p>
            <h1 className="text-4xl font-semibold mb-6 leading-tight">
              Helping anglers discover the next unforgettable catch
            </h1>
            <p className="text-base text-[#334155] leading-relaxed max-w-3xl">
              fishing-spot-finder brings verified fishing spot intelligence to everyday anglers.
              We blend community-sourced insights with environmental data so you can make confident
              decisions before you even load the tackle box.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="bg-[var(--surface)] rounded-[var(--radius)] shadow-card border border-[var(--border)] p-6 space-y-3">
              <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
              <p>
                To empower anglers with the best local knowledge, environmental data, and community insights
                so every fishing trip is a success.
              </p>
            </div>
            <div className="bg-[var(--surface)] rounded-[var(--radius)] shadow-card border border-[var(--border)] p-6 space-y-3">
              <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
              <p>
                Have questions, feedback, or want to contribute? Email us at
                <a href="mailto:info@fishing-spot-finder.com" className="text-[var(--accent)] underline ml-1">info@fishing-spot-finder.com</a>
              </p>
            </div>
          </section>

          <section className="bg-[var(--surface)] rounded-[var(--radius)] shadow-card border border-[var(--border)] p-8">
            <h2 className="text-2xl font-semibold mb-6">Meet the Team</h2>
            {loading && <p>Loading team members...</p>}
            {error && <p className="text-red-600">{error}</p>}
            <ul className="grid gap-4 md:grid-cols-2">
              {teamMembers.map((member) => (
                <li key={member.id} className="p-4 border rounded shadow-sm bg-white">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </li>
              ))}
            </ul>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;

import { useState, useMemo } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Map View', href: '/map' },
  { label: 'Fishing Spot Details', href: '/spots/[id]' },
  { label: 'Search Fishing Spots', href: '/search' },
  { label: 'Recent Reports', href: '/reports' },
  { label: 'User Settings', href: '/account/settings' },
  { label: 'About', href: '/about' },
];

const matchActive = (href, path) => {
  if (!path) return false;
  if (href === '/spots/[id]') {
    return path.startsWith('/spots/');
  }
  return path === href;
};

export default function Header({ currentPath = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeMap = useMemo(
    () =>
      navLinks.reduce((acc, link) => {
        acc[link.href] = matchActive(link.href, currentPath);
        return acc;
      }, {}),
    [currentPath]
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-ui border border-slate-200 bg-surface text-xl font-semibold text-accent shadow-card">
            🎣
          </div>
          <div>
            <p className="text-lg font-semibold text-text">fishing-spot-finder</p>
            <p className="text-sm text-slate-500">Track the perfect cast every day</p>
          </div>
        </Link>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-ui border border-slate-200 text-text transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">Menu</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            {isOpen ? (
              <path d="M6 6l12 12M18 6l-12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        <nav className="hidden md:flex md:items-center md:gap-2" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-ui px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                activeMap[link.href]
                  ? 'bg-accent text-white shadow-card'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-surface md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-3 text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  activeMap[link.href]
                    ? 'bg-accent text-white shadow-card'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
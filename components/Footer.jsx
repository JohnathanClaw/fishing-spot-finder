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

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg text-[color:var(--text)] border-t border-[color:var(--border)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr,1fr,1fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              fishing-spot-finder
            </p>
            <p className="text-lg font-semibold">
              Track water conditions and crowd-free launches across your favorite fisheries.
            </p>
            <p className="text-base leading-relaxed text-[color:#475569]">
              fishing-spot-finder blends angler reports, live weather, and trail intel so you can plan smarter weekends on the water.
            </p>
            <div className="rounded-lg border border-[color:var(--border)] bg-surface p-5 shadow-card">
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:#475569]">
                Contact the field team
              </p>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="font-medium">Email:</dt>
                  <dd>
                    <a
                      href="mailto:team@fishing-spot-finder.com"
                      className="text-accent transition hover:text-[color:#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      team@fishing-spot-finder.com
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="font-medium">Phone:</dt>
                  <dd>
                    <a
                      href="tel:+14068273144"
                      className="text-accent transition hover:text-[color:#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      +1 (406) 827-3144
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="font-medium">Dispatch Hours:</dt>
                  <dd>Daily, 05:00–22:00 MT</dd>
                </div>
              </dl>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:#475569]">
              Navigation
            </p>
            <nav aria-label="Footer primary navigation" className="mt-4">
              <ul className="space-y-2 text-base">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-[44px] items-center rounded-md px-1 text-[color:var(--text)] transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:#475569]">
              Explore More
            </p>
            <nav aria-label="Footer secondary navigation" className="mt-4">
              <ul className="space-y-2 text-base">
                {navLinks.slice(4).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-[44px] items-center rounded-md px-1 text-[color:var(--text)] transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-[color:var(--border)] pt-6 text-sm text-[color:#475569] md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} fishing-spot-finder. Built for anglers navigating rivers, lakes, and alpine waters.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/reports"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--border)] px-4 py-2 text-[color:var(--text)] transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Latest Field Logs
            </Link>
            <Link
              href="/account/settings"
              className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-4 py-2 text-white transition hover:bg-[color:#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Manage Alerts
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
'use client';

import { useEffect, useId } from 'react';
import Link from 'next/link';

const SpotPopup = ({
  isOpen = false,
  onClose = () => {},
  spot = {},
}) => {
  const labelId = useId();
  const descriptionId = useId();

  const {
    id,
    name = 'Unnamed Fishing Spot',
    waterType = 'Water type unknown',
    summary = 'Detailed information for this fishing location will appear as soon as scouts verify the latest reports.',
    bestTime = 'Not yet analyzed',
    rating,
    difficulty = 'Skill level pending',
    species = [],
    lastReport,
    coordinates,
    advisory,
  } = spot;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown, handleKeyDown');
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const detailsLink = id ? `/spots/${id}` : '/spots/[id]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
    >
      <div className="w-full max-w-lg rounded-ui border border-[var(--border)] bg-surface shadow-card">
        <div className="flex items-start justify-between border-b border-[var(--border)] px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              fishing-spot-finder
            </p>
            <h2
              id={labelId}
              className="mt-1 font-semibold text-xl text-[var(--text)]"
            >
              {name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {coordinates
                ? `Lat ${coordinates.lat.toFixed(3)}, Lon ${coordinates.lng.toFixed(3)}`
                : 'Coordinates pending verification'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-sm font-medium text-[var(--text)] transition hover:border-[var(--border)] hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:scale-95"
            aria-label="Close spot preview"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 px-6 py-5" id={descriptionId}>
          <p className="text-sm leading-relaxed text-[var(--text)]">
            {summary}
          </p>

          <div className="grid gap-4 rounded-ui border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
            <InfoRow label="Water Type" value={waterType} />
            <InfoRow
              label="Prime Window"
              value={bestTime}
            />
            <InfoRow
              label="Difficulty"
              value={difficulty}
            />
            <InfoRow
              label="Community Rating"
              value={
                typeof rating === 'number'
                  ? `${rating.toFixed(1)} / 5`
                  : 'Awaiting first rating'
              }
            />
            <InfoRow
              label="Recent Species"
              value={
                species.length > 0
                  ? species.join(', ')
                  : 'No catch data supplied yet'
              }
            />
            <InfoRow
              label="Last Report"
              value={
                lastReport
                  ? new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).format(new Date(lastReport))
                  : 'Report pending'
              }
            />
          </div>

          {advisory && (
            <div className="rounded-ui border border-warning/30 bg-amber-50 px-4 py-3 text-sm text-warning">
              {advisory}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-[var(--border)] px-6 py-4">
          <Link
            href={detailsLink}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-ui border border-transparent bg-[var(--accent)] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:scale-95"
          >
            View Full Details
          </Link>
          <Link
            href="/map"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-ui border border-[var(--border)] bg-surface px-4 py-2 text-center text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:scale-95"
          >
            Open in Map View
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-ui border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:scale-95"
          >
            Dismiss Preview
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm text-[var(--text)]">
    <span className="font-medium text-muted-foreground">{label}</span>
    <span className="text-right">{value}</span>
  </div>
);

export default SpotPopup;
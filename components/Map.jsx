import { useEffect, useMemo, useState } from 'react';

const defaultBounds = {
  north: 49,
  south: 24,
  west: -125,
  east: -66,
};

const defaultSpots = [
  {
    id: 'driftwood-bay',
    name: 'Driftwood Bay Jetty',
    lat: 44.985,
    lng: -124.012,
    conditions: 'Light chop with steady west breeze',
    species: ['Coho Salmon', 'Rockfish'],
    biteWindow: '06:15 - 09:30',
    waterTemp: 56,
    clarity: '8 ft visibility',
    reportTime: 'Updated 12 min ago',
    confidence: 'high',
  },
  {
    id: 'cedar-lake',
    name: 'Cedar Lake North Cove',
    lat: 47.255,
    lng: -91.481,
    conditions: 'Glass calm surface, scattered lily cover',
    species: ['Smallmouth Bass', 'Walleye'],
    biteWindow: '05:40 - 07:50',
    waterTemp: 63,
    clarity: '5 ft visibility',
    reportTime: 'Updated 25 min ago',
    confidence: 'medium',
  },
  {
    id: 'sunset-reservoir',
    name: 'Sunset Reservoir Pier',
    lat: 37.72,
    lng: -122.49,
    conditions: 'Incoming tide with moderate current',
    species: ['Striped Bass', 'Halibut'],
    biteWindow: '07:00 - 10:10',
    waterTemp: 58,
    clarity: '6 ft visibility',
    reportTime: 'Updated 5 min ago',
    confidence: 'high',
  },
  {
    id: 'fox-river',
    name: 'Fox River Bend',
    lat: 42.33,
    lng: -88.3,
    conditions: 'Slow drift, stained water',
    species: ['Channel Catfish', 'Northern Pike'],
    biteWindow: '08:20 - 11:00',
    waterTemp: 65,
    clarity: '3 ft visibility',
    reportTime: 'Updated 41 min ago',
    confidence: 'low',
  },
];

const confidenceStyles = {
  high: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-red-50 text-red-700 border-red-200',
};

function Map({
  title = 'Live hotspot intel',
  description = 'Monitor bite-ready fishing spots curated by the fishing-spot-finder community and real-time field reports.',
  spots = defaultSpots,
  bounds = defaultBounds,
  initialFocusSpotId,
  onMarkerClick,
}) {
  const [activeSpotId, setActiveSpotId] = useState(
    initialFocusSpotId ?? spots[0]?.id ?? null
  );

  useEffect(() => {
    if (initialFocusSpotId) {
      setActiveSpotId(initialFocusSpotId);
    }
  }, [initialFocusSpotId]);

  const mappedSpots = useMemo(() => {
    const clamp = (value) => Math.min(96, Math.max(4, value));
    const lngRange = bounds.east - bounds.west;
    const latRange = bounds.north - bounds.south;

    return spots.map((spot) => {
      const x = ((spot.lng - bounds.west) / lngRange) * 100;
      const y = (1 - (spot.lat - bounds.south) / latRange) * 100;
      return {
        ...spot,
        position: {
          x: clamp(x),
          y: clamp(y),
        },
      };
    });
  }, [spots, bounds]);

  const activeSpot =
    mappedSpots.find((spot) => spot.id === activeSpotId) ?? mappedSpots[0];

  const handleMarkerSelect = (spot) => {
    setActiveSpotId(spot.id);
    onMarkerClick?.(spot);
  };

  return (
    <section
      aria-labelledby="map-heading"
      className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-card"
    >
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          fishing-spot-finder · map intelligence
        </p>
        <h2
          id="map-heading"
          className="text-2xl font-semibold text-[var(--text)] sm:text-3xl"
        >
          {title}
        </h2>
        <p className="max-w-[70ch] text-base text-slate-600">{description}</p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <div className="space-y-4">
          <div
            role="img"
            aria-label="Interactive map of fishing spots"
            className="relative min-h-[24rem] w-full overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-slate-100"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{
                backgroundImage:
                  'linear-gradient(0deg, rgba(226,232,240,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.6) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-6 rounded-[var(--radius)] border border-white/70 shadow-card"
            />
            {mappedSpots.map((spot) => {
              const isActive = spot.id === activeSpot?.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => handleMarkerSelect(spot)}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-left text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                    isActive
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-card'
                      : 'border-[var(--border)] bg-white text-[var(--text)] hover:-translate-y-1 focus-visible:-translate-y-1'
                  }`}
                  style={{
                    left: `${spot.position.x}%`,
                    top: `${spot.position.y}%`,
                    minWidth: '3.5rem',
                  }}
                >
                  <span className="block text-[0.75rem]">{spot.name}</span>
                  <span
                    className={`mt-0.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium ${
                      spot.confidence === 'high'
                        ? 'border-white/30 text-white/90'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {spot.biteWindow}
                  </span>
                </button>
              );
            })}
            <div className="absolute left-4 top-4 flex flex-col gap-1 rounded-[var(--radius)] bg-white/90 p-3 text-xs text-slate-600 shadow-card">
              <p className="font-semibold text-[var(--text)]">
                Bite strength scale
              </p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span>High activity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span>Slow bite</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10 text-sm font-bold text-[var(--accent)]">
                {mappedSpots.length}
              </span>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">
                  Active locations
                </p>
                <p className="text-sm text-slate-600">
                  Streamed directly from fishing-spot-finder scouts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Catch-ready spots refreshed every 5 minutes
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-card">
          {activeSpot ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                    Focused spot
                  </p>
                  <h3 className="text-xl font-semibold text-[var(--text)]">
                    {activeSpot.name}
                  </h3>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${confidenceStyles[activeSpot.confidence]}`}
                >
                  {activeSpot.confidence === 'high'
                    ? 'High confidence'
                    : activeSpot.confidence === 'medium'
                    ? 'Moderate confidence'
                    : 'Low confidence'}
                </span>
              </div>
              <dl className="grid gap-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-[var(--radius)] border border-[var(--border)] px-3 py-2">
                  <dt className="font-medium text-[var(--text)]">
                    Bite window
                  </dt>
                  <dd className="text-sm">{activeSpot.biteWindow}</dd>
                </div>
                <div className="flex items-center justify-between rounded-[var(--radius)] border border-[var(--border)] px-3 py-2">
                  <dt className="font-medium text-[var(--text)]">
                    Water temp
                  </dt>
                  <dd className="text-sm">{activeSpot.waterTemp}&deg;F</dd>
                </div>
                <div className="flex items-center justify-between rounded-[var(--radius)] border border-[var(--border)] px-3 py-2">
                  <dt className="font-medium text-[var(--text)]">Clarity</dt>
                  <dd className="text-sm">{activeSpot.clarity}</dd>
                </div>
                <div className="rounded-[var(--radius)] border border-[var(--border)] px-3 py-2">
                  <dt className="font-medium text-[var(--text)]">Conditions</dt>
                  <dd className="mt-1 text-sm leading-relaxed">
                    {activeSpot.conditions}
                  </dd>
                </div>
              </dl>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Target species
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeSpot.species.map((species) => (
                    <span
                      key={species}
                      className="rounded-full border border-[var(--border)] bg-slate-50 px-3 py-1 text-xs font-medium text-[var(--text)]"
                    >
                      {species}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500">{activeSpot.reportTime}</p>
            </>
          ) : (
            <p className="text-sm text-slate-600">
              Select a marker to view precise bite data.
            </p>
          )}

          <div className="border-t border-[var(--border)] pt-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              All tracked spots
            </h4>
            <ul className="mt-3 space-y-3">
              {mappedSpots.map((spot) => {
                const isActive = spot.id === activeSpot?.id;
                return (
                  <li
                    key={spot.id}
                    className={`flex items-center justify-between rounded-[var(--radius)] border px-3 py-2 text-sm transition ${
                      isActive
                        ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                        : 'border-[var(--border)] bg-white'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-[var(--text)]">
                        {spot.name}
                      </p>
                      <p className="text-xs text-slate-600">
                        {spot.biteWindow} · {spot.species.join(', ')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkerSelect(spot)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                        isActive
                          ? 'bg-[var(--accent)] text-white shadow-card'
                          : 'border border-[var(--border)] text-[var(--accent)] hover:bg-[var(--accent)]/10'
                      }`}
                      aria-pressed={isActive}
                    >
                      Focus
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Map;
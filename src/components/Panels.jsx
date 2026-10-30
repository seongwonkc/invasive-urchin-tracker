import { AnimatePresence, motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Counter from "./Counter";
import { tropicaSpeciesUrl } from "../data";
import { TREND_YEARS } from "../gbif";

const number = new Intl.NumberFormat("en-US");

export function Card({ title, kicker, action, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-ink-700/70 bg-ink-900/80 p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] backdrop-blur sm:p-5 ${className}`}
    >
      {(title || kicker || action) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {kicker && (
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
                {kicker}
              </p>
            )}
            {title && (
              <h2 className="font-display text-lg font-semibold text-foam">{title}</h2>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function SpeciesDossier({ species }) {
  return (
    <Card kicker="Species dossier" className="overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={species.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h2 className="font-display text-2xl font-semibold leading-tight text-foam">
              {species.commonName}
            </h2>
            {species.koreanName && (
              <span className="text-lg text-urchin-300">{species.koreanName}</span>
            )}
          </div>
          <p className="mt-1 text-sm italic text-mist">{species.scientificName}</p>

          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
            {[species.managementType, species.regionHint, species.rangeLabel].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-ink-600 px-2.5 py-1 text-foam/80"
                >
                  {tag}
                </span>
              )
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foam/90">{species.story}</p>

          <div className="mt-4 rounded-xl border border-kelp-500/30 bg-kelp-500/10 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-kelp-300">
              Field action
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foam/90">
              {species.activismAction}
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-uni-500/30 bg-uni-500/10 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-uni-300">
              Safety &amp; rules
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foam/90">{species.safety}</p>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <a
              className="text-xs font-medium text-urchin-300 underline-offset-4 hover:underline"
              href={species.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Source: {species.sourceName} ↗
            </a>
            <a
              className="group inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-uni-500 px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-uni-400"
              href={tropicaSpeciesUrl(species.id)}
              target="_blank"
              rel="noreferrer"
            >
              Cook it in TROPICA
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

function TrendTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-xs text-foam">
      <div className="font-semibold">
        {point.year}
        {point.label.endsWith("*") ? " (so far)" : ""}
      </div>
      <div>{number.format(point.records)} records</div>
    </div>
  );
}

export function EvidencePanel({ stats, loading, error, regionLabel, isKorea }) {
  const total = stats?.total || 0;
  const basisTotal = (stats?.basis || []).reduce((sum, item) => sum + item.count, 0);
  const basisColors = ["#a78bfa", "#5ccf8e", "#ff9a2e", "#7dd3fc", "#f472b6", "#9fb0cc"];

  return (
    <Card kicker={`GBIF evidence · ${regionLabel}`} title="What the records say">
      {error ? (
        <p className="text-sm text-uni-300">Could not load GBIF counts: {error.message}</p>
      ) : (
        <div className={loading ? "animate-pulse opacity-60" : ""}>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Total records" value={total} />
            <Stat
              label={isKorea ? "Years with records" : "Countries"}
              value={
                isKorea
                  ? (stats?.trend || []).filter((item) => item.records > 0).length
                  : stats?.countryCount || 0
              }
              suffix={isKorea ? ` / ${TREND_YEARS}` : ""}
            />
          </div>

          <div className="mt-4 h-40">
            <ResponsiveContainer>
              <AreaChart data={stats?.trend || []} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1b2d50" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#9fb0cc" }}
                  axisLine={{ stroke: "#2a3f66" }}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={14}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#9fb0cc" }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip content={<TrendTooltip />} cursor={{ stroke: "#ff9a2e", strokeDasharray: "3 3" }} />
                <Area
                  type="monotone"
                  dataKey="records"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fill="url(#trend-fill)"
                  animationDuration={900}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-mist">
            Records per year over the last {TREND_YEARS} years (* = year to date).
            More records can mean more divers and apps, not more urchins: this
            tracks reporting effort as much as abundance.
          </p>

          {!isKorea && stats?.countries?.length > 0 && (
            <div className="mt-4 space-y-1.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                Top countries
              </p>
              {stats.countries.map((country, index) => (
                <div key={country.code} className="grid grid-cols-[1fr_auto] items-center gap-2 text-xs">
                  <div className="relative h-6 overflow-hidden rounded-md bg-ink-800">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-urchin-500/40"
                      initial={{ width: 0 }}
                      animate={{ width: `${(country.count / stats.countries[0].count) * 100}%` }}
                      transition={{ duration: 0.7, delay: index * 0.06 }}
                    />
                    <span className="relative z-10 flex h-full items-center px-2 text-foam/90">
                      {country.name}
                    </span>
                  </div>
                  <span className="font-mono text-foam/80">{number.format(country.count)}</span>
                </div>
              ))}
            </div>
          )}

          {basisTotal > 0 && (
            <div className="mt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                Record type
              </p>
              <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-ink-800">
                {stats.basis.map((item, index) => (
                  <motion.div
                    key={item.id}
                    title={`${item.label}: ${number.format(item.count)}`}
                    style={{ backgroundColor: basisColors[index % basisColors.length] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / basisTotal) * 100}%` }}
                    transition={{ duration: 0.7 }}
                  />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-foam/80">
                {stats.basis.slice(0, 4).map((item, index) => (
                  <span key={item.id} className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: basisColors[index % basisColors.length] }}
                    />
                    {item.label} {Math.round((item.count / basisTotal) * 100)}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value, suffix = "" }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-950/60 px-3 py-2.5">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist">{label}</div>
      <div className="mt-0.5 font-display text-2xl font-semibold text-foam">
        <Counter value={value} />
        {suffix && <span className="text-sm text-mist">{suffix}</span>}
      </div>
    </div>
  );
}

export function PointPanel({ point, result, loading, error, species, onClear }) {
  if (!point) {
    return (
      <Card kicker="Map inspector" title="Tap the map">
        <p className="text-sm leading-relaxed text-mist">
          Tap anywhere on the map to pull the GBIF records for{" "}
          <span className="text-foam">{species.shortName}</span> inside the
          dashed box around that spot. The box shrinks as you zoom in.
        </p>
      </Card>
    );
  }

  const { box } = point;
  const gbifLink = `https://www.gbif.org/occurrence/search?taxon_key=${species.taxonKey}&decimal_latitude=${box.south.toFixed(3)},${box.north.toFixed(3)}&decimal_longitude=${box.west.toFixed(3)},${box.east.toFixed(3)}`;

  return (
    <Card
      kicker="Map inspector"
      title={`${point.lat.toFixed(2)}°, ${point.lng.toFixed(2)}°`}
      action={
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-ink-600 px-2.5 py-1 text-xs text-mist hover:border-mist hover:text-foam"
        >
          Clear
        </button>
      }
    >
      {error ? (
        <p className="text-sm text-uni-300">Lookup failed: {error.message}</p>
      ) : loading || !result ? (
        <div className="space-y-2">
          {[0, 1, 2].map((row) => (
            <div key={row} className="h-8 animate-pulse rounded-lg bg-ink-800" />
          ))}
        </div>
      ) : (
        <div>
          <p className="text-sm text-foam/90">
            <span className="font-display text-2xl font-semibold text-uni-400">
              <Counter value={result.count} />
            </span>{" "}
            {species.shortName} records in this box
          </p>
          {result.records.length > 0 ? (
            <ul className="mt-3 divide-y divide-ink-700 text-xs">
              {result.records.map((record) => (
                <li key={record.key} className="py-2">
                  <a
                    className="flex items-start justify-between gap-3 hover:text-urchin-300"
                    href={`https://www.gbif.org/occurrence/${record.key}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="text-foam/90">{record.place || "Location not given"}</span>
                    <span className="shrink-0 font-mono text-mist">{record.date || "n.d."}</span>
                  </a>
                  <span className="text-[11px] text-mist">{record.basis}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-mist">
              No records here. Zoom out or try a spot inside a colored hexagon.
            </p>
          )}
          {result.count > 0 && (
            <a
              className="mt-3 inline-block text-xs font-medium text-urchin-300 underline-offset-4 hover:underline"
              href={gbifLink}
              target="_blank"
              rel="noreferrer"
            >
              Open all {number.format(result.count)} on GBIF ↗
            </a>
          )}
        </div>
      )}
    </Card>
  );
}

export function PhotoStrip({ photos, loading, error, species }) {
  return (
    <Card
      kicker="From the field"
      title={`Recent photos of ${species.shortName}`}
      action={
        <span className="hidden text-[11px] text-mist sm:block">
          Photos by GBIF contributors, used under their licenses
        </span>
      }
    >
      {error ? (
        <p className="text-sm text-uni-300">Could not load photos: {error.message}</p>
      ) : loading ? (
        <div className="flex gap-3 overflow-hidden">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-56 w-44 shrink-0 animate-pulse rounded-xl bg-ink-800" />
          ))}
        </div>
      ) : photos?.length ? (
        <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
          {photos.map((photo, index) => (
            <motion.a
              key={photo.key}
              href={photo.href}
              target="_blank"
              rel="noreferrer"
              className="group w-44 shrink-0 snap-start overflow-hidden rounded-xl border border-ink-700 bg-ink-950"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index, 8) * 0.05 }}
            >
              <div className="h-40 overflow-hidden bg-ink-800">
                <img
                  src={photo.src}
                  alt={`${species.commonName} observation${photo.place ? ` in ${photo.place}` : ""}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-0.5 p-2.5 text-[11px] leading-snug">
                <div className="truncate text-foam/90">{photo.place || "Location not given"}</div>
                <div className="font-mono text-mist">{photo.date}</div>
                <div className="truncate text-mist">
                  © {photo.creator} · {photo.license}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-mist">No openly licensed photos found for this view.</p>
      )}
    </Card>
  );
}

export function ActionLog({ entries }) {
  return (
    <Card kicker="Project history" title="Student action log">
      <ol className="relative ml-2 border-l border-ink-600">
        {entries.map((entry, index) => (
          <motion.li
            key={`${entry.date}-${entry.title}`}
            className="relative pb-5 pl-5 last:pb-0"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.08 }}
          >
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-kelp-400 ring-4 ring-ink-900" />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-kelp-300">
              {entry.date}
            </p>
            <p className="mt-0.5 font-semibold text-foam">{entry.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-mist">{entry.text}</p>
          </motion.li>
        ))}
      </ol>
    </Card>
  );
}

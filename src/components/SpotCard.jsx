import { AnimatePresence, motion } from "motion/react";

import { tropicaSpeciesUrl } from "../data";
import { CHECKED, STATUS } from "../spots";

const FIELDS = [
  ["licence", "Licence"],
  ["limits", "Limit"],
  ["season", "Season"],
  ["gear", "Gear"],
  ["offLimits", "Off-limits"],
  ["notes", "Good to know"],
];

export function StatusBadge({ status, className = "" }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${s.ring} ${s.text} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default function SpotCard({ spot, rule, species }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900/80 backdrop-blur">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={spot.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="p-5"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">{rule.place}</p>
          <h2 className="mt-1 font-display text-2xl font-semibold leading-tight">{spot.name}</h2>
          <p className="mt-1 text-sm text-foam/80">
            {species.commonName}
            {species.koreanName && <span className="ml-1.5 text-urchin-300">{species.koreanName}</span>}
            <span className="ml-1.5 italic text-mist">{species.scientificName}</span>
          </p>

          <div className="mt-4">
            <StatusBadge status={rule.status} />
            <p className="mt-2 text-[15px] font-medium leading-snug text-foam">{rule.headline}</p>
          </div>

          <div className="mt-4 rounded-xl border border-ink-700/70 bg-ink-950/60 p-3.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-uni-300">Why it's a bloom</p>
            <p className="mt-1.5 text-sm leading-relaxed text-foam/85">{spot.why}</p>
            <a href={spot.source.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-urchin-300 hover:underline">
              {spot.source.name} ↗
            </a>
          </div>

          <dl className="mt-4 divide-y divide-ink-700/70 border-y border-ink-700/70">
            {FIELDS.filter(([key]) => rule[key]).map(([key, label]) => (
              <div key={key} className="grid grid-cols-[92px_1fr] gap-3 py-2.5">
                <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mist">{label}</dt>
                <dd className="text-sm leading-relaxed text-foam/90">{rule[key]}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={rule.official.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foam px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-white"
            >
              Official rules ↗
            </a>
            <a
              href={tropicaSpeciesUrl(species.id)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-uni-500/60 px-4 py-2 text-sm font-semibold text-uni-300 transition hover:bg-uni-500 hover:text-ink-950"
            >
              Cook it in TROPICA →
            </a>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-mist">
            From {rule.official.name}, checked {CHECKED}. Rules change, so read the official page
            the day you go.
          </p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

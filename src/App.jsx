import { useCallback, useMemo, useRef, useState } from "react";
import { MotionConfig, motion } from "motion/react";

import Counter from "./components/Counter";
import { ActionLog, PhotoStrip } from "./components/Panels";
import SpotCard from "./components/SpotCard";
import SpotMap from "./components/SpotMap";
import UrchinMark from "./components/UrchinMark";
import { ACTION_LOG, SPECIES, TROPICA_URL } from "./data";
import { densityTileUrl, fetchPhotos } from "./gbif";
import { CHECKED, RULES, SPOTS, STATUS } from "./spots";
import { useAsync } from "./useAsync";

const SPECIES_BY_ID = Object.fromEntries(SPECIES.map((species) => [species.id, species]));
const RULE_BY_ID = Object.fromEntries(RULES.map((rule) => [rule.id, rule]));

const FILTERS = [
  { id: "all", label: "Everything" },
  { id: "urchin", label: "Urchins" },
  { id: "invasive", label: "Invasives" },
];

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const CHECKLIST = [
  ["Read the official page the day you go", "Seasons, limits and emergency closures change. The rules on this site are a summary, not the law."],
  ["Carry your licence", "Where a licence is required, it has to be on you while you harvest."],
  ["Know the no-take zones", "Marine protected areas, parks and private or village fishing grounds can be closed even when the species is open."],
  ["Respect the spines", "Urchin spines puncture skin and lionfish spines are venomous. Wear thick gloves and use a tool."],
  ["Never move a live invader", "Transporting live invasive fish or crabs spreads them. Some places require you to kill them on the spot."],
];

function initialSpotId() {
  try {
    const requested = new URLSearchParams(window.location.search).get("species");
    const match = requested && SPOTS.find((spot) => spot.speciesId === requested);
    if (match) return match.id;
  } catch {
    // Fall through to the first spot.
  }
  return SPOTS[0].id;
}

function syncSpeciesParam(id) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("species", id);
    window.history.replaceState(null, "", url);
  } catch {
    // URL sync is a convenience only.
  }
}

function App() {
  const [spotId, setSpotId] = useState(initialSpotId);
  const [filter, setFilter] = useState("all");
  const [showRecords, setShowRecords] = useState(false);
  const mapRef = useRef(null);

  const spot = SPOTS.find((item) => item.id === spotId);
  const rule = RULE_BY_ID[spot.rule];
  const species = SPECIES_BY_ID[spot.speciesId];

  const visible = useMemo(
    () => SPOTS.filter((item) => filter === "all" || SPECIES_BY_ID[item.speciesId].group === filter),
    [filter]
  );
  const statusFor = useCallback((item) => RULE_BY_ID[item.rule].status, []);
  const counts = useMemo(() => {
    const out = { go: 0, licence: 0, no: 0, check: 0 };
    for (const item of SPOTS) out[statusFor(item)] += 1;
    return out;
  }, [statusFor]);

  const photos = useAsync(`photos:${species.taxonKey}`, (signal) => fetchPhotos(species.taxonKey, {}, signal));

  function selectSpot(id, scroll = false) {
    const next = SPOTS.find((item) => item.id === id);
    setSpotId(id);
    syncSpeciesParam(next.speciesId);
    if (scroll) mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function changeFilter(id) {
    setFilter(id);
    const current = SPECIES_BY_ID[spot.speciesId].group;
    if (id !== "all" && current !== id) {
      const first = SPOTS.find((item) => SPECIES_BY_ID[item.speciesId].group === id);
      if (first) selectSpot(first.id);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-foam">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.28),transparent_60%),radial-gradient(ellipse_at_top_right,rgba(255,154,46,0.12),transparent_55%)]" />

        <header className="relative">
          <motion.div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6" variants={stagger} initial="hidden" animate="show">
            <motion.nav variants={rise} className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <UrchinMark className="h-8 w-8" />
                <span className="font-display text-lg font-semibold">Urchin Tracker</span>
              </div>
              <a
                href={TROPICA_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-uni-500/60 bg-uni-500/10 px-4 py-2 text-sm font-semibold text-uni-300 transition hover:bg-uni-500 hover:text-ink-950"
              >
                TROPICA recipe book
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </motion.nav>

            <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <motion.h1 variants={rise} className="font-display text-5xl font-bold leading-[0.92] tracking-tight sm:text-7xl">
                  Find the bloom.
                  <br />
                  Check the rules.
                  <br />
                  <span className="text-uni-400">Go get 'em.</span>
                </motion.h1>
                <motion.p variants={rise} className="mt-6 max-w-xl text-base leading-relaxed text-foam/80 sm:text-lg">
                  Urchin barrens and invasive hotspots, each with the rules for taking them: licence,
                  limits, gear and the places that are off-limits. Pick a spot, read the rules, then
                  cook what you bring home.
                </motion.p>
              </div>

              <motion.dl variants={stagger} className="grid grid-cols-2 gap-2.5">
                {Object.entries(STATUS).map(([key, s]) => (
                  <motion.div key={key} variants={rise} className="rounded-2xl border border-ink-700/80 bg-ink-900/70 px-4 py-3 backdrop-blur">
                    <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-mist">
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </dt>
                    <dd className={`mt-1 font-display text-3xl font-semibold ${s.text}`}>
                      <Counter value={counts[key]} />
                    </dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </motion.div>
        </header>

        <main className="relative mx-auto max-w-7xl space-y-5 px-4 pb-16 sm:px-6">
          <div ref={mapRef} className="grid scroll-mt-4 gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
            <section className="relative h-[460px] overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900 sm:h-[640px]">
              <SpotMap
                spots={visible}
                selectedId={spotId}
                statusFor={statusFor}
                densityUrl={showRecords ? densityTileUrl(species.taxonKey, {}) : null}
                onSelect={(id) => selectSpot(id)}
              />
              <div className="pointer-events-none absolute left-3 right-3 top-3 z-[500] flex flex-wrap items-start justify-between gap-2">
                <div className="pointer-events-auto">
                  <Segmented options={FILTERS} value={filter} onChange={changeFilter} ariaLabel="Show" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowRecords((v) => !v)}
                  aria-pressed={showRecords}
                  className={`pointer-events-auto rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur transition ${
                    showRecords ? "border-uni-400 bg-uni-500/20 text-uni-300" : "border-ink-700 bg-ink-950/80 text-mist hover:text-foam"
                  }`}
                >
                  {showRecords ? "Hide" : "Show"} GBIF records for {species.shortName}
                </button>
              </div>
              <div className="pointer-events-none absolute bottom-8 left-3 z-[500] space-y-1 rounded-xl border border-ink-700 bg-ink-950/85 px-3 py-2 text-[11px] text-mist backdrop-blur">
                {Object.entries(STATUS).map(([key, s]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </div>
                ))}
              </div>
            </section>

            <aside className="min-w-0 lg:sticky lg:top-4 lg:self-start">
              <SpotCard spot={spot} rule={rule} species={species} />
            </aside>
          </div>

          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold">All spots</h2>
              <p className="text-xs text-mist">{visible.length} shown</p>
            </div>
            <motion.ul layout className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((item) => {
                const r = RULE_BY_ID[item.rule];
                const sp = SPECIES_BY_ID[item.speciesId];
                const active = item.id === spotId;
                return (
                  <motion.li layout key={item.id}>
                    <button
                      type="button"
                      onClick={() => selectSpot(item.id, true)}
                      aria-pressed={active}
                      className={`group h-full w-full rounded-xl border p-3.5 text-left transition-colors ${
                        active ? "border-urchin-400 bg-urchin-500/10" : "border-ink-700 bg-ink-900/60 hover:border-ink-600"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist">{r.place}</span>
                        <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS[r.status].dot}`} aria-label={STATUS[r.status].label} />
                      </div>
                      <p className="mt-1 font-display text-lg font-semibold leading-tight">{item.name}</p>
                      <p className="mt-0.5 text-xs text-foam/70">
                        {sp.koreanName || sp.commonName}
                      </p>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-mist">{r.headline}</p>
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          </section>

          <PhotoStrip photos={photos.data} loading={photos.loading} error={photos.error} species={species} />

          <section className="rounded-2xl border border-ink-700/70 bg-ink-900/70 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-uni-300">Before you go</p>
                <h2 className="mt-1 font-display text-2xl font-semibold">Five things, every time</h2>
              </div>
            </div>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {CHECKLIST.map(([title, text], i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="rounded-xl border border-ink-700/70 bg-ink-950/50 p-3.5"
                >
                  <span className="font-mono text-xs text-uni-300">0{i + 1}</span>
                  <p className="mt-1 text-sm font-semibold leading-snug">{title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-mist">{text}</p>
                </motion.li>
              ))}
            </ol>
          </section>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section className="flex flex-col justify-between overflow-hidden rounded-2xl border border-uni-500/40 bg-gradient-to-br from-uni-500/20 via-ink-900 to-urchin-600/20 p-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-uni-300">From the water to the plate</p>
                <h2 className="mt-1 font-display text-3xl font-semibold leading-tight">Got your limit? Now cook it.</h2>
                <p className="mt-3 text-sm leading-relaxed text-foam/80">
                  Every species on this map has recipes in TROPICA, from uni toast to lionfish tacos,
                  with notes on cleaning and safety.
                </p>
              </div>
              <a
                href={TROPICA_URL}
                target="_blank"
                rel="noreferrer"
                className="group mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-uni-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-uni-400"
              >
                Open the recipe book
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </section>
            <ActionLog entries={ACTION_LOG} />
          </div>

          <footer className="border-t border-ink-700 pt-5 text-xs leading-relaxed text-mist">
            Rules on this site are short summaries of official pages, checked {CHECKED}. They are not
            legal advice and can change at any time; the linked official page always wins. Hotspots
            mark documented urchin barrens and invasive populations, not guaranteed catches. Optional
            occurrence layer from{" "}
            <a className="text-urchin-300 hover:underline" href="https://www.gbif.org" target="_blank" rel="noreferrer">
              GBIF.org
            </a>
            ; photos belong to their credited creators.
          </footer>
        </main>
      </div>
    </MotionConfig>
  );
}

function Segmented({ options, value, onChange, ariaLabel }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="relative inline-flex rounded-full border border-ink-700 bg-ink-950/85 p-1 backdrop-blur">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              active ? "text-ink-950" : "text-mist hover:text-foam"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${ariaLabel}`}
                className="absolute inset-0 rounded-full bg-foam"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default App;

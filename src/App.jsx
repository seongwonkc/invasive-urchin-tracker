import { useMemo, useRef, useState } from "react";
import { MotionConfig, motion } from "motion/react";

import Counter from "./components/Counter";
import FieldLog from "./components/FieldLog";
import MapView from "./components/MapView";
import {
  ActionLog,
  EvidencePanel,
  PhotoStrip,
  PointPanel,
  SpeciesDossier,
} from "./components/Panels";
import UrchinMark from "./components/UrchinMark";
import { ACTION_LOG, GROUPS, REGIONS, SPECIES, TROPICA_URL } from "./data";
import { loadLog, normalizeEntry, saveLog, summarize } from "./fieldLog";
import {
  bboxForZoom,
  densityTileUrl,
  fetchCount,
  fetchPhotos,
  fetchRecordsInBox,
  fetchSpeciesStats,
  windowYears,
} from "./gbif";
import { useAsync } from "./useAsync";

const SPECIES_BY_ID = Object.fromEntries(SPECIES.map((species) => [species.id, species]));

const WINDOWS = [
  { id: "all", label: "All years" },
  { id: "recent", label: "Last 5 years" },
];

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function today() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 10);
}

function initialSpeciesId() {
  try {
    const requested = new URLSearchParams(window.location.search).get("species");
    if (requested && SPECIES_BY_ID[requested]) return requested;
  } catch {
    // Fall through to the default species.
  }
  return "purple-urchin";
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

function emptyDraft(speciesId) {
  return { date: today(), site: "", speciesId, count: "", depthM: "", lat: "", lng: "", notes: "" };
}

function App() {
  const [speciesId, setSpeciesId] = useState(initialSpeciesId);
  const [group, setGroup] = useState(() => SPECIES_BY_ID[speciesId].group);
  const [regionId, setRegionId] = useState("world");
  const [windowId, setWindowId] = useState("all");
  const [point, setPoint] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [entries, setEntries] = useState(loadLog);
  const [storageOk, setStorageOk] = useState(true);
  const [draft, setDraft] = useState(() => emptyDraft(speciesId));
  const mapRef = useRef(null);
  const logRef = useRef(null);

  const species = SPECIES_BY_ID[speciesId];
  const region = REGIONS[regionId];
  const country = region.country;
  const yearRange = windowYears(windowId);
  const isKorea = regionId === "korea";

  const counts = useAsync(`counts:${country || "all"}`, async (signal) => {
    const values = await Promise.all(
      SPECIES.map((item) => fetchCount(item.taxonKey, { country }, signal).catch(() => null))
    );
    return Object.fromEntries(SPECIES.map((item, index) => [item.id, values[index]]));
  });

  const stats = useAsync(`stats:${species.taxonKey}:${country || "all"}`, (signal) =>
    fetchSpeciesStats(species.taxonKey, { country }, signal)
  );

  const photos = useAsync(`photos:${species.taxonKey}:${country || "all"}`, (signal) =>
    fetchPhotos(species.taxonKey, { country }, signal)
  );

  const pointKey = point
    ? `point:${species.taxonKey}:${windowId}:${point.lat.toFixed(4)}:${point.lng.toFixed(4)}:${point.zoom}`
    : null;
  const pointResult = useAsync(pointKey, (signal) =>
    fetchRecordsInBox(species.taxonKey, point.box, { yearRange }, signal)
  );

  const tileUrl = densityTileUrl(species.taxonKey, { yearRange });
  const groupSpecies = SPECIES.filter((item) => item.group === group);
  const urchinTotal = SPECIES.filter((item) => item.group === "urchin").reduce(
    (sum, item) => sum + (counts.data?.[item.id] || 0),
    0
  );
  const logSummary = summarize(entries);
  const draftPoint =
    draft.lat !== "" && draft.lng !== "" && Number.isFinite(Number(draft.lat)) && Number.isFinite(Number(draft.lng))
      ? { lat: Number(draft.lat), lng: Number(draft.lng) }
      : null;

  const mapEntries = useMemo(
    () => entries.filter((entry) => Number.isFinite(entry.lat) && Number.isFinite(entry.lng)),
    [entries]
  );

  function persist(next) {
    setEntries(next);
    setStorageOk(saveLog(next));
  }

  function selectSpecies(id) {
    setSpeciesId(id);
    syncSpeciesParam(id);
    setPoint(null);
    setDraft((current) => (current.site || current.lat ? current : { ...current, speciesId: id }));
  }

  function selectGroup(id) {
    setGroup(id);
    const first = SPECIES.find((item) => item.group === id);
    if (first && SPECIES_BY_ID[speciesId].group !== id) selectSpecies(first.id);
  }

  function handleMapClick({ lat, lng, zoom }) {
    if (placing) {
      setDraft((current) => ({ ...current, lat: lat.toFixed(5), lng: lng.toFixed(5) }));
      setPlacing(false);
      logRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setPoint({ lat, lng, zoom, box: bboxForZoom(lat, lng, zoom) });
  }

  function togglePlace() {
    const next = !placing;
    setPlacing(next);
    if (next) mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-foam">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.28),transparent_60%),radial-gradient(ellipse_at_top_right,rgba(255,154,46,0.12),transparent_55%)]" />

        <header className="relative">
          <motion.div
            className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.nav variants={rise} className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-mist">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-kelp-400" />
                Student citizen science · live GBIF data
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

            <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <motion.div variants={rise} className="flex items-center gap-4">
                  <UrchinMark className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />
                  <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
                    Urchin
                    <br />
                    <span className="text-uni-400">Tracker</span>
                  </h1>
                </motion.div>
                <motion.p variants={rise} className="mt-5 max-w-xl text-base leading-relaxed text-foam/80 sm:text-lg">
                  Where sea urchins pile up, kelp and seaweed forests can turn into
                  bare rock. This map pulls every public GBIF record for the urchins
                  behind those barrens, from California to Korea's East Sea, and
                  lets you log what you see on your own dives.
                </motion.p>
              </div>

              <motion.dl variants={stagger} className="grid grid-cols-2 gap-2.5">
                <HeroStat label={`GBIF urchin records · ${region.label}`} loading={counts.loading}>
                  <Counter value={urchinTotal} />
                </HeroStat>
                <HeroStat label="Urchin species tracked">
                  <Counter value={SPECIES.filter((item) => item.group === "urchin").length} />
                </HeroStat>
                <HeroStat label="Your logged sightings">
                  <Counter value={logSummary.sightings} />
                </HeroStat>
                <HeroStat label="Your logged sites">
                  <Counter value={logSummary.sites} />
                </HeroStat>
              </motion.dl>
            </div>
          </motion.div>
        </header>

        <main className="relative mx-auto max-w-7xl space-y-5 px-4 pb-16 sm:px-6">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="rounded-2xl border border-ink-700/70 bg-ink-900/70 p-3 backdrop-blur sm:p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Segmented
                options={GROUPS}
                value={group}
                onChange={selectGroup}
                ariaLabel="Species group"
              />
              <Segmented
                options={Object.values(REGIONS)}
                value={regionId}
                onChange={(id) => {
                  setRegionId(id);
                  setPoint(null);
                }}
                ariaLabel="Region"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {groupSpecies.map((item) => (
                <SpeciesChip
                  key={item.id}
                  species={item}
                  count={counts.data?.[item.id]}
                  loading={counts.loading}
                  selected={item.id === speciesId}
                  onSelect={() => selectSpecies(item.id)}
                />
              ))}
            </div>
          </motion.section>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0 space-y-5">
              <section
                ref={mapRef}
                className="relative h-[460px] overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900 sm:h-[600px]"
              >
                <MapView
                  tileUrl={tileUrl}
                  regionId={regionId}
                  mode={placing ? "place" : "inspect"}
                  box={point?.box}
                  fieldEntries={mapEntries}
                  draftPoint={draftPoint}
                  speciesById={SPECIES_BY_ID}
                  onMapClick={handleMapClick}
                />
                <div className="pointer-events-none absolute left-3 right-3 top-3 z-[500] flex flex-wrap items-start justify-between gap-2">
                  <div className="pointer-events-auto rounded-xl border border-ink-700 bg-ink-950/85 px-3 py-2 backdrop-blur">
                    <p className="font-display text-sm font-semibold">
                      {species.commonName}
                      {species.koreanName && (
                        <span className="ml-1.5 text-urchin-300">{species.koreanName}</span>
                      )}
                    </p>
                    <p className="text-[11px] text-mist">
                      {placing ? "Click the map to place your sighting" : "Tap the map to inspect records"}
                    </p>
                  </div>
                  <div className="pointer-events-auto">
                    <Segmented options={WINDOWS} value={windowId} onChange={setWindowId} ariaLabel="Time window" small />
                  </div>
                </div>
                <div className="pointer-events-none absolute bottom-12 left-3 z-[500] sm:bottom-8 rounded-xl border border-ink-700 bg-ink-950/85 px-3 py-2 text-[11px] text-mist backdrop-blur">
                  <div className="mb-1 flex items-center gap-2">
                    <span>fewer</span>
                    <span className="h-2 w-24 rounded-full bg-gradient-to-r from-[#ffff00] via-[#ff9900] to-[#ff2200]" />
                    <span>more records</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-kelp-400" />
                    your sightings
                  </div>
                </div>
              </section>

              <PhotoStrip
                photos={photos.data}
                loading={photos.loading}
                error={photos.error}
                species={species}
              />
            </div>

            <aside className="min-w-0 space-y-5">
              <SpeciesDossier species={species} />
              <PointPanel
                point={point}
                result={pointResult.data}
                loading={pointResult.loading}
                error={pointResult.error}
                species={species}
                onClear={() => setPoint(null)}
              />
              <EvidencePanel
                stats={stats.data}
                loading={stats.loading}
                error={stats.error}
                regionLabel={region.label}
                isKorea={isKorea}
              />
            </aside>
          </div>

          <div ref={logRef} className="scroll-mt-4">
            <FieldLog
              entries={entries}
              draft={draft}
              onDraftChange={setDraft}
              onSubmit={() => {
                persist([...entries, normalizeEntry(draft)]);
                setDraft(emptyDraft(draft.speciesId));
              }}
              onDelete={(id) => persist(entries.filter((entry) => entry.id !== id))}
              onImport={(imported) => persist([...entries, ...imported])}
              species={SPECIES}
              speciesById={SPECIES_BY_ID}
              placing={placing}
              onTogglePlace={togglePlace}
              storageOk={storageOk}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <ActionLog entries={ACTION_LOG} />
            <section className="flex flex-col justify-between overflow-hidden rounded-2xl border border-uni-500/40 bg-gradient-to-br from-uni-500/20 via-ink-900 to-urchin-600/20 p-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-uni-300">
                  From map to plate
                </p>
                <h2 className="mt-1 font-display text-3xl font-semibold leading-tight">
                  Every species here has a recipe in TROPICA.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foam/80">
                  The tracker shows where the pressure is. TROPICA is the cookbook
                  that turns overabundant urchins and invasive fish into dinner,
                  with sourcing and safety notes for each dish.
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
          </div>

          <footer className="border-t border-ink-700 pt-5 text-xs leading-relaxed text-mist">
            This is a public-data prototype, not an official monitoring system.
            GBIF records can include sampling bias, duplicate survey effort, and
            uneven regional coverage. Always follow local harvest, transport,
            possession, and fish/shellfish consumption rules. Occurrence data and
            density tiles from{" "}
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

function HeroStat({ label, loading, children }) {
  return (
    <motion.div
      variants={rise}
      className="rounded-2xl border border-ink-700/80 bg-ink-900/70 px-4 py-3 backdrop-blur"
    >
      <dt className="font-mono text-[10px] uppercase leading-tight tracking-[0.16em] text-mist">{label}</dt>
      <dd className={`mt-1 font-display text-2xl font-semibold sm:text-3xl ${loading ? "animate-pulse opacity-60" : ""}`}>
        {children}
      </dd>
    </motion.div>
  );
}

function Segmented({ options, value, onChange, ariaLabel, small = false }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="relative inline-flex rounded-full border border-ink-700 bg-ink-950/80 p-1 backdrop-blur"
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={`relative rounded-full font-medium transition-colors ${
              small ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs sm:text-sm"
            } ${active ? "text-ink-950" : "text-mist hover:text-foam"}`}
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

function SpeciesChip({ species, count, loading, selected, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      aria-pressed={selected}
      className={`relative min-w-[170px] shrink-0 rounded-xl border px-3 py-2.5 text-left transition-colors ${
        selected
          ? "border-urchin-400 bg-urchin-500/15"
          : "border-ink-700 bg-ink-950/50 hover:border-ink-600"
      }`}
    >
      <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-mist">
        {species.category}
      </span>
      <span className="mt-0.5 block text-sm font-semibold text-foam">
        {species.koreanName || species.shortName}
      </span>
      <span className="block truncate text-[11px] italic text-mist">{species.scientificName}</span>
      <span className="mt-1 block font-mono text-xs text-urchin-300">
        {loading ? "…" : count == null ? "n/a" : `${new Intl.NumberFormat("en-US").format(count)} records`}
      </span>
      {selected && (
        <motion.span
          layoutId="chip-glow"
          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-urchin-400 to-uni-400"
        />
      )}
    </motion.button>
  );
}

export default App;

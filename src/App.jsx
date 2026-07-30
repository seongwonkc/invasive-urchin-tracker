import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import MapComponent from "./MapComponent";
import {
  ACTION_LOG,
  CAMPAIGN_METRICS,
  SPECIES,
  computeGridCells,
  computeYearlyEvidence,
  fetchAllSpeciesOccurrences,
} from "./api";

const CATEGORY_ALL = "All";

function riskSummaryToChart(summary) {
  if (!summary) return [];

  return [
    { name: "High", value: summary.highCount },
    { name: "Medium", value: summary.medCount },
    { name: "Low", value: summary.lowCount },
  ];
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function sampleLocation(sample) {
  return [sample.locality, sample.stateProvince, sample.country, sample.year]
    .filter(Boolean)
    .join(" / ");
}

function App() {
  const [speciesData, setSpeciesData] = useState({});
  const [failures, setFailures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState("lionfish");
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL);
  const [selectedCell, setSelectedCell] = useState(null);
  const [recipeSpeciesId, setRecipeSpeciesId] = useState("lionfish");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setFailures([]);

      try {
        const result = await fetchAllSpeciesOccurrences();

        if (!isMounted) return;

        setSpeciesData(result.data);
        setFailures(result.failures);

        const firstSpeciesWithData = SPECIES.find(
          (species) => result.data[species.id]?.length
        );

        if (firstSpeciesWithData) {
          setSelectedSpeciesId((current) =>
            result.data[current]?.length ? current : firstSpeciesWithData.id
          );
          setRecipeSpeciesId((current) =>
            result.data[current]?.length ? current : firstSpeciesWithData.id
          );
        }
      } catch (error) {
        if (isMounted) {
          setSpeciesData({});
          setFailures([
            {
              speciesId: "all",
              commonName: "GBIF",
              message: error.message || "Could not load occurrence data",
            },
          ]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => [CATEGORY_ALL, ...new Set(SPECIES.map((species) => species.category))],
    []
  );

  const selectedSpecies =
    SPECIES.find((species) => species.id === selectedSpeciesId) || SPECIES[0];

  const recipeSpecies =
    SPECIES.find((species) => species.id === recipeSpeciesId) || selectedSpecies;

  const filteredSpecies = useMemo(
    () =>
      activeCategory === CATEGORY_ALL
        ? SPECIES
        : SPECIES.filter((species) => species.category === activeCategory),
    [activeCategory]
  );

  const gridData = useMemo(
    () =>
      computeGridCells(
        speciesData[selectedSpeciesId] || [],
        1,
        selectedSpecies.thresholds
      ),
    [selectedSpecies, selectedSpeciesId, speciesData]
  );

  const riskChartData = useMemo(
    () => riskSummaryToChart(gridData.summary),
    [gridData.summary]
  );

  const yearlyEvidence = useMemo(
    () =>
      computeYearlyEvidence(
        speciesData[selectedSpeciesId] || [],
        1,
        selectedSpecies.thresholds
      ),
    [selectedSpecies, selectedSpeciesId, speciesData]
  );

  const topCells = gridData.cells.slice(0, 5);
  const allRecords = SPECIES.reduce(
    (sum, species) => sum + (speciesData[species.id]?.length || 0),
    0
  );
  const loadedSpecies = SPECIES.filter(
    (species) => (speciesData[species.id] || []).length > 0
  ).length;
  const highRiskPercent =
    gridData.summary.cellCount > 0
      ? Math.round((gridData.summary.highCount / gridData.summary.cellCount) * 100)
      : 0;

  function selectSpecies(speciesId) {
    setSelectedSpeciesId(speciesId);
    setRecipeSpeciesId(speciesId);
    setSelectedCell(null);
  }

  return (
    <div className="min-h-screen bg-[#10100e] text-stone-100">
      <header className="border-b border-stone-800 bg-[#10100e]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 lg:grid-cols-[1.4fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Student-led citizen science
            </p>
            <h1 className="mt-2 max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Invasivore Atlas
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-stone-300">
              A high-school activism dashboard that maps edible invasive or
              overabundant species, turns public biodiversity data into action
              targets, and gives volunteers a recipe they can open in one click.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                className="border border-emerald-300 bg-emerald-300 px-4 py-2 text-sm font-semibold text-neutral-950"
                onClick={() => setRecipeSpeciesId(selectedSpeciesId)}
              >
                Open current recipe
              </button>
              <a
                className="border border-stone-600 px-4 py-2 text-sm font-semibold text-stone-200 hover:border-stone-400"
                href={selectedSpecies.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Read source
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CAMPAIGN_METRICS.map((metric) => (
              <HeroMetric
                key={metric.label}
                label={metric.label}
                value={metric.value}
              />
            ))}
            <HeroMetric label="GBIF records loaded" value={formatNumber(allRecords)} />
            <HeroMetric
              label="Species with live data"
              value={`${loadedSpecies}/${SPECIES.length}`}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5">
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.85fr)]">
          <div className="space-y-5">
            <Panel title="Choose a Target Species">
              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`border px-3 py-1.5 text-xs font-semibold transition ${
                      activeCategory === category
                        ? "border-emerald-300 bg-emerald-300 text-neutral-950"
                        : "border-stone-700 bg-neutral-950 text-stone-300 hover:border-stone-500"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {filteredSpecies.map((species) => (
                  <SpeciesCard
                    key={species.id}
                    species={species}
                    count={speciesData[species.id]?.length || 0}
                    loading={loading}
                    selected={selectedSpeciesId === species.id}
                    onSelect={() => selectSpecies(species.id)}
                    onRecipe={() => setRecipeSpeciesId(species.id)}
                  />
                ))}
              </div>
            </Panel>

            {failures.length > 0 && (
              <div className="border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                Some GBIF requests failed. Available species are still shown.
                <span className="ml-2 text-amber-200/80">
                  {failures.map((failure) => failure.commonName).join(", ")}
                </span>
              </div>
            )}

            <div className="min-h-[560px]">
              {loading ? (
                <LoadingPanel />
              ) : (
                <MapComponent
                  gridData={gridData}
                  selectedSpecies={selectedSpecies}
                  onCellClick={setSelectedCell}
                />
              )}
            </div>

            <Panel title="Student Action Log">
              <div className="grid gap-3 md:grid-cols-2">
                {ACTION_LOG.map((entry) => (
                  <LogItem
                    key={`${entry.date}-${entry.title}`}
                    date={entry.date}
                    title={entry.title}
                    body={entry.text}
                  />
                ))}
              </div>
            </Panel>
          </div>

          <aside className="space-y-5">
            <RecipePanel species={recipeSpecies} />

            <Panel title="Current Map Evidence">
              <div className="grid grid-cols-2 gap-2">
                <MetricCard
                  label="Scientific name"
                  value={selectedSpecies.scientificName}
                />
                <MetricCard label="Region" value={selectedSpecies.regionHint} />
                <MetricCard
                  label="Records"
                  value={formatNumber(gridData.summary.totalRecords)}
                />
                <MetricCard
                  label="High-density cells"
                  value={`${gridData.summary.highCount} (${highRiskPercent}%)`}
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-stone-400">
                {selectedSpecies.story}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-emerald-200">
                Student action: {selectedSpecies.activismAction}
              </p>
              <a
                className="mt-3 inline-block text-xs font-semibold text-cyan-300 underline-offset-4 hover:underline"
                href={selectedSpecies.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Source: {selectedSpecies.sourceName}
              </a>
            </Panel>

            <Panel title="Risk Distribution">
              <p className="mb-3 text-xs leading-relaxed text-stone-400">
                Density scoring is species-specific. High starts at{" "}
                {selectedSpecies.thresholds.high}+ records per 1-degree cell;
                medium starts at {selectedSpecies.thresholds.medium}+.
              </p>
              <div className="h-40">
                <ResponsiveContainer>
                  <BarChart data={riskChartData} margin={{ top: 4, right: 8 }}>
                    <CartesianGrid stroke="#292524" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#a8a29e" }}
                      axisLine={{ stroke: "#44403c" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "#a8a29e" }}
                      axisLine={{ stroke: "#44403c" }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "rgba(52, 211, 153, 0.08)" }}
                      contentStyle={{
                        backgroundColor: "#0c0a09",
                        border: "1px solid #44403c",
                        borderRadius: 0,
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar
                      dataKey="value"
                      name="Grid cells"
                      fill="#34d399"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="One-Year Evidence">
              <p className="mb-3 text-xs leading-relaxed text-stone-400">
                The last two complete years are compared fairly; the current
                year is shown as season-to-date.
              </p>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <MetricCard
                  label={`${yearlyEvidence.previous.year} records`}
                  value={formatNumber(yearlyEvidence.previous.records)}
                />
                <MetricCard
                  label={`${yearlyEvidence.latestComplete.year} records`}
                  value={formatNumber(yearlyEvidence.latestComplete.records)}
                />
                <MetricCard
                  label="Change"
                  value={
                    yearlyEvidence.recordDeltaPercent === null
                      ? "New baseline"
                      : `${yearlyEvidence.recordDelta >= 0 ? "+" : ""}${formatNumber(
                          yearlyEvidence.recordDelta
                        )} (${yearlyEvidence.recordDeltaPercent}%)`
                  }
                />
                <MetricCard
                  label={`${yearlyEvidence.current.year} YTD`}
                  value={`${formatNumber(yearlyEvidence.current.records)} records`}
                />
              </div>
              <div className="h-32">
                <ResponsiveContainer>
                  <BarChart data={yearlyEvidence.years} margin={{ top: 4, right: 8 }}>
                    <CartesianGrid stroke="#292524" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#a8a29e" }}
                      axisLine={{ stroke: "#44403c" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "#a8a29e" }}
                      axisLine={{ stroke: "#44403c" }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "rgba(16, 185, 129, 0.08)" }}
                      contentStyle={{
                        backgroundColor: "#0c0a09",
                        border: "1px solid #44403c",
                        borderRadius: 0,
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="records"
                      name="Records"
                      fill="#67e8f9"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Selected Cell">
              {selectedCell ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Risk</span>
                    <RiskPill risk={selectedCell.risk} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Reports</span>
                    <span className="font-semibold">
                      {formatNumber(selectedCell.count)}
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 text-xs uppercase tracking-wider text-stone-500">
                      Example records
                    </div>
                    <div className="space-y-1 text-xs text-stone-300">
                      {selectedCell.samples.map((sample) => (
                        <div key={sample.key || sampleLocation(sample)}>
                          {sampleLocation(sample) || "Unknown location"}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-400">
                  Select a map marker to inspect records from that grid cell.
                </p>
              )}
            </Panel>

            <Panel title="Top Hotspots">
              {topCells.length ? (
                <div className="space-y-2">
                  {topCells.map((cell, index) => (
                    <div
                      key={cell.id}
                      className="grid grid-cols-[24px_1fr_auto] items-center gap-2 border-b border-stone-800 pb-2 text-xs last:border-b-0 last:pb-0"
                    >
                      <span className="text-stone-500">{index + 1}</span>
                      <span className="text-stone-300">
                        {cell.lat.toFixed(1)}, {cell.lng.toFixed(1)}
                      </span>
                      <span className="font-semibold text-stone-100">
                        {formatNumber(cell.count)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-400">
                  No coordinate records found for this species in the current
                  GBIF window.
                </p>
              )}
            </Panel>
          </aside>
        </section>
      </main>
    </div>
  );
}

function HeroMetric({ label, value }) {
  return (
    <div className="border border-stone-800 bg-stone-950 px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function SpeciesCard({ species, count, loading, selected, onSelect, onRecipe }) {
  return (
    <article
      className={`border p-4 transition ${
        selected
          ? "border-emerald-300 bg-emerald-300/10"
          : "border-stone-800 bg-neutral-950 hover:border-stone-600"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            {species.category}
          </div>
          <h3 className="mt-1 text-base font-semibold text-stone-100">
            {species.commonName}
          </h3>
          <p className="mt-1 text-xs italic text-stone-500">
            {species.scientificName}
          </p>
        </div>
        <div className="text-right text-xs text-stone-400">
          <span className="block font-semibold text-stone-100">
            {loading ? "..." : formatNumber(count)}
          </span>
          records
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-300">
        {species.story}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-stone-300">
        <span className="border border-stone-700 px-2 py-1">
          {species.managementType}
        </span>
        <span className="border border-stone-700 px-2 py-1">
          {species.regionHint}
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className={`flex-1 border px-3 py-2 text-xs font-semibold ${
            selected
              ? "border-emerald-300 bg-emerald-300 text-neutral-950"
              : "border-stone-600 text-stone-200 hover:border-stone-400"
          }`}
          onClick={onSelect}
        >
          Map species
        </button>
        <button
          className="flex-1 border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-200 hover:border-cyan-300"
          onClick={onRecipe}
        >
          Recipe
        </button>
      </div>
      <a
        className="mt-3 inline-block text-xs font-semibold text-stone-400 underline-offset-4 hover:text-cyan-200 hover:underline"
        href={species.sourceUrl}
        target="_blank"
        rel="noreferrer"
      >
        Source: {species.sourceName}
      </a>
    </article>
  );
}

function RecipePanel({ species }) {
  const { recipe } = species;

  return (
    <section className="border border-emerald-300 bg-emerald-300 text-neutral-950">
      <div className="border-b border-neutral-950/25 px-4 py-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em]">
          One-click recipe
        </div>
        <h2 className="mt-1 text-xl font-semibold">{recipe.title}</h2>
        <p className="mt-1 text-sm">
          {species.commonName} - {recipe.flavor}
        </p>
      </div>
      <div className="grid grid-cols-3 border-b border-neutral-950/25 text-center text-xs font-semibold">
        <div className="border-r border-neutral-950/25 p-3">
          <span className="block text-[10px] uppercase tracking-wider opacity-70">
            Time
          </span>
          {recipe.time}
        </div>
        <div className="border-r border-neutral-950/25 p-3">
          <span className="block text-[10px] uppercase tracking-wider opacity-70">
            Skill
          </span>
          {recipe.skill}
        </div>
        <div className="p-3">
          <span className="block text-[10px] uppercase tracking-wider opacity-70">
            Yield
          </span>
          {recipe.yield}
        </div>
      </div>
      <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-1">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Ingredients
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>- {ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider">Steps</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
      <div className="border-t border-neutral-950/25 p-4 text-sm">
        <span className="font-bold">Safety note: </span>
        {species.safety}
      </div>
    </section>
  );
}

function LoadingPanel() {
  return (
    <div className="flex h-full min-h-[560px] items-center justify-center border border-stone-800 bg-stone-950 text-sm text-stone-400">
      <span className="mr-3 h-4 w-4 animate-spin border-2 border-emerald-300 border-t-transparent" />
      Fetching occurrence records from GBIF
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="border border-stone-800 bg-stone-950 p-4">
      <h2 className="mb-3 text-sm font-semibold text-stone-100">{title}</h2>
      {children}
    </section>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="border border-stone-800 bg-neutral-950 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
        {label}
      </div>
      <div className="truncate text-xs font-semibold text-stone-100">
        {value ?? "--"}
      </div>
    </div>
  );
}

function RiskPill({ risk }) {
  const className =
    risk === "High"
      ? "border-orange-400/50 bg-orange-500/15 text-orange-200"
      : risk === "Medium"
        ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-200"
        : "border-cyan-400/50 bg-cyan-500/15 text-cyan-200";

  return (
    <span className={`border px-2 py-1 text-xs font-semibold ${className}`}>
      {risk}
    </span>
  );
}

function LogItem({ date, title, body }) {
  return (
    <div className="border border-stone-800 bg-neutral-950 p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
        {date}
      </div>
      <div className="mt-1 text-sm font-semibold text-stone-100">{title}</div>
      <p className="mt-1 text-xs leading-relaxed text-stone-400">{body}</p>
    </div>
  );
}

export default App;

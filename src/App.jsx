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
  SPECIES,
  computeGridCells,
  computeYearlyEvidence,
  fetchAllSpeciesOccurrences,
} from "./api";

const INVASIVENESS_THRESHOLDS = {
  high: 30,
  medium: 10,
};

const CULINARY_PROFILES = {
  purple: {
    uniGrade: "Premium",
    flavor: "Sweet, buttery, clean brine",
    texture: "Custardy",
    harvestUse:
      "Targeted harvest can help reduce grazing pressure in established urchin barrens.",
    dishes: ["Uni toast", "Uni pasta", "Scallop crudo"],
  },
  longspined: {
    uniGrade: "High if handled quickly",
    flavor: "Rich ocean umami",
    texture: "Firm, creamy when fresh",
    harvestUse:
      "Removal is most useful where barrens are expanding into remnant kelp habitat.",
    dishes: ["Uni butter", "Miso beurre blanc", "Chawanmushi"],
  },
  green: {
    uniGrade: "Variable",
    flavor: "Briny, slightly nutty",
    texture: "Delicate",
    harvestUse:
      "Stable restaurant demand can make targeted removals more economically realistic.",
    dishes: ["Uni oysters", "Potato leek soup", "Nordic uni toast"],
  },
};

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
  const [selectedSpeciesId, setSelectedSpeciesId] = useState("purple");
  const [selectedCell, setSelectedCell] = useState(null);

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

  const selectedSpecies =
    SPECIES.find((species) => species.id === selectedSpeciesId) || SPECIES[0];

  const gridData = useMemo(
    () =>
      computeGridCells(
        speciesData[selectedSpeciesId] || [],
        1,
        INVASIVENESS_THRESHOLDS
      ),
    [speciesData, selectedSpeciesId]
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
        INVASIVENESS_THRESHOLDS
      ),
    [speciesData, selectedSpeciesId]
  );

  const culinaryProfile = CULINARY_PROFILES[selectedSpeciesId];
  const topCells = gridData.cells.slice(0, 5);
  const allRecords = SPECIES.reduce(
    (sum, species) => sum + (speciesData[species.id]?.length || 0),
    0
  );
  const highRiskPercent =
    gridData.summary.cellCount > 0
      ? Math.round((gridData.summary.highCount / gridData.summary.cellCount) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-100">
      <header className="border-b border-stone-800 bg-neutral-950/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
              Student biodiversity prototype
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Invasive Sea Urchin Tracker
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-stone-400">
              Live GBIF occurrence records, density scoring, and harvest-minded
              restoration notes for problem urchin populations.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                loading
                  ? "animate-pulse bg-amber-300"
                  : failures.length
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
            />
            {loading
              ? "Loading GBIF"
              : failures.length
              ? "GBIF partial data"
              : "GBIF live"}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)] md:gap-5 md:py-6">
        <section className="flex min-h-[720px] flex-col gap-4">
          <div className="border border-stone-800 bg-stone-950 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-stone-100">
                  Species Focus
                </h2>
                <p className="text-xs text-stone-400">
                  Last five years of coordinate-backed occurrence records.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SPECIES.map((species) => {
                  const count = speciesData[species.id]?.length || 0;
                  const isSelected = selectedSpeciesId === species.id;

                  return (
                    <button
                      key={species.id}
                      onClick={() => {
                        setSelectedSpeciesId(species.id);
                        setSelectedCell(null);
                      }}
                      className={`border px-3 py-2 text-left text-xs transition ${
                        isSelected
                          ? "border-cyan-300 bg-cyan-300 text-neutral-950"
                          : "border-stone-700 bg-neutral-950 text-stone-300 hover:border-stone-500"
                      }`}
                    >
                      <span className="block font-semibold">
                        {species.commonName}
                      </span>
                      <span
                        className={`block ${
                          isSelected ? "text-neutral-700" : "text-stone-500"
                        }`}
                      >
                        {loading ? "loading" : `${formatNumber(count)} records`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <MetricCard
                label="Scientific Name"
                value={selectedSpecies.scientificName}
              />
              <MetricCard label="Hotspot" value={selectedSpecies.regionHint} />
              <MetricCard
                label="Records"
                value={formatNumber(gridData.summary.totalRecords)}
              />
              <MetricCard
                label="High-Risk Cells"
                value={`${gridData.summary.highCount} (${highRiskPercent}%)`}
              />
            </div>
          </div>

          {failures.length > 0 && (
            <div className="border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Some GBIF requests failed. Available species are still shown.
              <span className="ml-2 text-amber-200/80">
                {failures.map((failure) => failure.commonName).join(", ")}
              </span>
            </div>
          )}

          <div className="min-h-[520px] flex-1">
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
        </section>

        <aside className="flex flex-col gap-4">
          <Panel title="Risk Distribution">
            <p className="mb-3 text-xs leading-relaxed text-stone-400">
              Cell risk is based on report density in a 1-degree grid: high at{" "}
              {INVASIVENESS_THRESHOLDS.high}+ records, medium at{" "}
              {INVASIVENESS_THRESHOLDS.medium}+.
            </p>
            <div className="h-44">
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
                    cursor={{ fill: "rgba(103, 232, 249, 0.08)" }}
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
                    Example Records
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

          <Panel title="One-Year Evidence">
            <p className="mb-3 text-xs leading-relaxed text-stone-400">
              Comparing the last two complete years gives the project a fair
              year-over-year signal. The current year is shown separately as
              season-to-date data.
            </p>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <MetricCard
                label={`${yearlyEvidence.previous.year} Records`}
                value={formatNumber(yearlyEvidence.previous.records)}
              />
              <MetricCard
                label={`${yearlyEvidence.latestComplete.year} Records`}
                value={formatNumber(yearlyEvidence.latestComplete.records)}
              />
              <MetricCard
                label="Record Change"
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
            <div className="h-36">
              <ResponsiveContainer>
                <BarChart
                  data={yearlyEvidence.years}
                  margin={{ top: 4, right: 8, left: 0 }}
                >
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
                    fill="#34d399"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Project Improvement Log">
            <div className="space-y-3 text-sm">
              <LogItem
                date="Year 0"
                title="Map-only prototype"
                body="The original version visualized recent GBIF records, but it did not preserve a clear year-over-year story."
              />
              <LogItem
                date="Year 1"
                title="Evidence dashboard"
                body="The tracker now compares complete-year records, shows current-season data separately, and links density scoring to selected map cells."
              />
              <LogItem
                date="Now"
                title="Maintainable student project"
                body="Dependencies are current, the audit is clean, and the README explains how to run and evaluate the project."
              />
            </div>
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

          <Panel title="Harvest Notes">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <MetricCard label="Uni Grade" value={culinaryProfile.uniGrade} />
              <MetricCard label="Flavor" value={culinaryProfile.flavor} />
              <MetricCard label="Texture" value={culinaryProfile.texture} />
              <MetricCard label="Range" value={selectedSpecies.rangeLabel} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-300">
              {selectedSpecies.story}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-400">
              {culinaryProfile.harvestUse}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {culinaryProfile.dishes.map((dish) => (
                <span
                  key={dish}
                  className="border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200"
                >
                  {dish}
                </span>
              ))}
            </div>
          </Panel>

          <Panel title="Dataset Snapshot">
            <div className="grid grid-cols-2 gap-2">
              <MetricCard label="All Records" value={formatNumber(allRecords)} />
              <MetricCard
                label="Species Loaded"
                value={`${SPECIES.length - failures.length}/${SPECIES.length}`}
              />
            </div>
          </Panel>
        </aside>
      </main>
    </div>
  );
}

function LoadingPanel() {
  return (
    <div className="flex h-full min-h-[520px] items-center justify-center border border-stone-800 bg-stone-950 text-sm text-stone-400">
      <span className="mr-3 h-4 w-4 animate-spin border-2 border-cyan-300 border-t-transparent" />
      Fetching occurrence records from GBIF
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="border border-stone-800 bg-stone-950 p-4">
      <h2 className="mb-2 text-sm font-semibold text-stone-100">{title}</h2>
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
    <div className="border-b border-stone-800 pb-3 last:border-b-0 last:pb-0">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
        {date}
      </div>
      <div className="mt-1 text-sm font-semibold text-stone-100">{title}</div>
      <p className="mt-1 text-xs leading-relaxed text-stone-400">{body}</p>
    </div>
  );
}

export default App;

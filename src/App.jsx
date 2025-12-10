// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

import MapComponent from "./MapComponent";
import {
  SPECIES,
  fetchAllSpeciesOccurrences,
  computeGridCells,
} from "./api";

// Hard-coded culinary profiles for the “Eat It” panel
const CULINARY_PROFILES = {
  purple: {
    uniGrade: "Premium",
    flavor: "Sweet, buttery, clean brine",
    texture: "Custardy, melts on the tongue",
    notes:
      "Infamous kelp-forest bulldozer along the US West Coast. Harvest pressure here is basically habitat restoration with chopsticks.",
    suggestedDishes: [
      "Uni-topped scallop crudo",
      "Creamy uni pasta with lemon zest",
      "Uni over rice with shiso and pickled ginger",
    ],
    sustainabilityTip:
      "Partner with local dive programs and kelp-restoration projects to prioritize harvest in high-risk barrens.",
  },
  longspined: {
    uniGrade: "High (if handled quickly)",
    flavor: "Rich, slightly metallic, strong ocean umami",
    texture: "Firm lobes, creamy when very fresh",
    notes:
      "Expanding from mainland Australia down into Tasmania, chewing through kelp like it’s a salad bar with no closing time.",
    suggestedDishes: [
      "Charcoal-grilled sourdough with long-spined uni butter",
      "Uni folded into miso beurre blanc over white fish",
      "Tasmanian uni chawanmushi (savory custard)",
    ],
    sustainabilityTip:
      "Focus harvest on urchin barrens where kelp canopy has already collapsed; coordinate with local fisheries managers.",
  },
  green: {
    uniGrade: "Variable but often good",
    flavor: "Briny, slightly nutty, classic North Atlantic profile",
    texture: "Delicate lobes, can be grainier if older",
    notes:
      "Overgrazing kelp beds in parts of the North Atlantic and Arctic-ish coasts. Also: surprisingly delicious when someone else cracks the shell for you.",
    suggestedDishes: [
      "Green urchin butter baked over oysters",
      "Potato–leek soup finished with a spoon of uni",
      "Nordic-style uni toast with dill and lemon",
    ],
    sustainabilityTip:
      "Work with small-scale fisheries and chefs to build stable demand so divers can justify targeted removals.",
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

const INVASIVENESS_THRESHOLDS = {
  high: 30, // “High Risk” cell if >= 30 reports in last 5 years
  medium: 10,
};

function App() {
  const [speciesData, setSpeciesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState("purple");
  const [error, setError] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchAllSpeciesOccurrences();
        if (!isMounted) return;
        setSpeciesData(data);
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setError(
            "Failed to fetch GBIF data. Check your network connection or CORS settings."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedSpecies = SPECIES.find((s) => s.id === selectedSpeciesId);

  const gridData = useMemo(() => {
    const occurrences = speciesData[selectedSpeciesId] || [];
    return computeGridCells(occurrences, 1, INVASIVENESS_THRESHOLDS);
  }, [speciesData, selectedSpeciesId]);

  const riskChartData = useMemo(
    () => riskSummaryToChart(gridData?.summary),
    [gridData]
  );

  const culinaryProfile = CULINARY_PROFILES[selectedSpeciesId];

  const highRiskPercent =
    gridData && gridData.summary.cellCount > 0
      ? (
          (gridData.summary.highCount / gridData.summary.cellCount) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top nav / title */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Invasive Sea Urchin Tracker
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Real-time biodiversity data + invasiveness scoring + culinary
              countermeasures.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            GBIF live data
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 mx-auto max-w-7xl px-4 py-4 md:py-6 grid gap-4 md:gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        {/* Left: Map + species controls */}
        <section className="flex flex-col gap-3 md:gap-4">
          {/* Species selector + stats */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 md:p-4 shadow-lg shadow-slate-950/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Species focus
                </h2>
                <p className="text-xs text-slate-400">
                  Choose a urchin to visualize density and invasiveness.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SPECIES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSpeciesId(s.id);
                      setSelectedCell(null);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      selectedSpeciesId === s.id
                        ? "bg-slate-100 text-slate-900 border-slate-100"
                        : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {s.commonName}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <MetricCard
                label="Scientific name"
                value={selectedSpecies?.scientificName}
              />
              <MetricCard
                label="Region hotspot"
                value={selectedSpecies?.regionHint}
              />
              <MetricCard
                label="Records (last 5y)"
                value={gridData?.summary.totalRecords ?? 0}
              />
              <MetricCard
                label="High-risk cells"
                value={`${gridData?.summary.highCount ?? 0} (${highRiskPercent}%)`}
              />
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 min-h-[380px] md:min-h-[520px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-t-transparent border-sky-400 animate-spin" />
                  Fetching GBIF occurrences…
                </div>
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center text-center text-sm text-red-400">
                {error}
              </div>
            ) : (
              <MapComponent
                gridData={gridData}
                selectedSpecies={selectedSpecies}
                onCellClick={setSelectedCell}
              />
            )}
          </div>
        </section>

        {/* Right: Analytics + Eat It panel */}
        <section className="flex flex-col gap-3 md:gap-4">
          {/* Risk distribution chart */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 md:p-4">
            <h2 className="text-sm font-semibold mb-1.5">
              Invasiveness score
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              We flag a grid cell as{" "}
              <span className="text-orange-400">High Risk</span> when the
              density of reports in the last 5 years exceeds{" "}
              <span className="font-semibold">
                {INVASIVENESS_THRESHOLDS.high}
              </span>
              . Medium risk kicks in at{" "}
              <span className="font-semibold">
                {INVASIVENESS_THRESHOLDS.medium}
              </span>
              .
            </p>

            <div className="h-40">
              <ResponsiveContainer>
                <BarChart data={riskChartData} margin={{ top: 4, right: 8 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#334155" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#334155" }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1e293b",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "11px",
                      color: "#cbd5f5",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    name="Cells"
                    fill="#38bdf8"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {selectedCell && (
              <div className="mt-3 border-t border-slate-800 pt-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Selected cell</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      selectedCell.risk === "High"
                        ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                        : selectedCell.risk === "Medium"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    }`}
                  >
                    {selectedCell.risk} risk
                  </span>
                </div>
                <div className="mt-1 text-slate-300">
                  Reports:{" "}
                  <span className="font-semibold">
                    {selectedCell.count}
                  </span>
                </div>
                {selectedCell.samples?.length > 0 && (
                  <div className="mt-1 text-slate-400">
                    Example record:{" "}
                    <span className="font-mono text-[11px]">
                      {selectedCell.samples[0].country || "Unknown country"}{" "}
                      {selectedCell.samples[0].stateProvince &&
                        `· ${selectedCell.samples[0].stateProvince}`}{" "}
                      {selectedCell.samples[0].year &&
                        `· ${selectedCell.samples[0].year}`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Eat It panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 md:p-4 flex-1 flex flex-col">
            <h2 className="text-sm font-semibold mb-1.5 flex items-center gap-2">
              Eat It: Culinary Control Panel
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                Climate-positive gluttony
              </span>
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Use gastronomy as a management tool: target high-risk regions,
              pay divers fairly, and turn barrens back into kelp forests.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <MetricCard
                label="Uni grade"
                value={culinaryProfile?.uniGrade}
              />
              <MetricCard
                label="Flavor profile"
                value={culinaryProfile?.flavor}
              />
              <MetricCard
                label="Texture"
                value={culinaryProfile?.texture}
              />
              <MetricCard
                label="Best for"
                value={selectedSpecies?.regionHint}
              />
            </div>

            <div className="mb-3">
              <h3 className="text-xs font-semibold text-slate-200 mb-1">
                Chef’s notes
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {culinaryProfile?.notes}
              </p>
            </div>

            <div className="mb-3">
              <h3 className="text-xs font-semibold text-slate-200 mb-1">
                Recommended dishes
              </h3>
              <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5">
                {culinaryProfile?.suggestedDishes?.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold">Sustainability tip: </span>
              {culinaryProfile?.sustainabilityTip}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Small reusable metric card
function MetricCard({ label, value }) {
  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="text-xs font-semibold text-slate-100 truncate">
        {value ?? "—"}
      </div>
    </div>
  );
}

export default App;

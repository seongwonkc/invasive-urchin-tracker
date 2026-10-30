import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Card } from "./Panels";
import { downloadCsv, fromCsv, summarize } from "../fieldLog";

const inputClass =
  "w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-foam placeholder:text-mist/60 focus:border-urchin-400 focus:outline-none focus:ring-2 focus:ring-urchin-400/30";

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function FieldLog({
  entries,
  draft,
  onDraftChange,
  onSubmit,
  onDelete,
  onImport,
  species,
  speciesById,
  placing,
  onTogglePlace,
  storageOk,
}) {
  const fileInput = useRef(null);
  const [message, setMessage] = useState(null);
  const summary = summarize(entries);
  const canSave = draft.lat !== "" && draft.lng !== "" && draft.site.trim() !== "";

  function update(field) {
    return (event) => onDraftChange({ ...draft, [field]: event.target.value });
  }

  function locateMe() {
    if (!navigator.geolocation) {
      setMessage({ tone: "warn", text: "This browser cannot share its location." });
      return;
    }
    setMessage({ tone: "info", text: "Finding your location…" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onDraftChange({
          ...draft,
          lat: position.coords.latitude.toFixed(5),
          lng: position.coords.longitude.toFixed(5),
        });
        setMessage({ tone: "ok", text: "Location added." });
      },
      (error) => setMessage({ tone: "warn", text: `Location unavailable: ${error.message}` }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSave) {
      setMessage({ tone: "warn", text: "Add a site name and a location first." });
      return;
    }
    onSubmit();
    setMessage({ tone: "ok", text: "Sighting saved." });
  }

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const { entries: imported, skipped } = fromCsv(await file.text());
      onImport(imported);
      setMessage({
        tone: "ok",
        text: `Imported ${imported.length} sighting${imported.length === 1 ? "" : "s"}${
          skipped ? `, skipped ${skipped} without coordinates` : ""
        }.`,
      });
    } catch (error) {
      setMessage({ tone: "warn", text: error.message });
    }
  }

  const sorted = [...entries].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const toneClass = {
    ok: "text-kelp-300",
    warn: "text-uni-300",
    info: "text-mist",
  };

  return (
    <Card
      kicker="Field log"
      title="Log a sighting"
      action={
        <span className="rounded-full bg-uni-500/15 px-3 py-1 text-xs text-uni-300">
          {summary.sightings} sighting{summary.sightings === 1 ? "" : "s"} across {summary.sites}{" "}
          site{summary.sites === 1 ? "" : "s"}
        </span>
      }
    >
      <p className="mb-4 rounded-lg border border-ink-600 bg-ink-950/60 px-3 py-2 text-xs leading-relaxed text-mist">
        Saved in this browser only. Nothing is uploaded. Export a CSV to back it
        up or move it to another device.
        {!storageOk && (
          <span className="block text-uni-300">
            This browser is blocking storage, so sightings will disappear when the page closes.
          </span>
        )}
      </p>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <input type="date" className={inputClass} value={draft.date} onChange={update("date")} required />
          </Field>
          <Field label="Species">
            <select className={inputClass} value={draft.speciesId} onChange={update("speciesId")}>
              {species.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.koreanName ? `${item.koreanName} · ${item.scientificName}` : item.commonName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Site name" className="col-span-2">
            <input
              className={inputClass}
              placeholder="e.g. north breakwater, 5 m ledge"
              value={draft.site}
              onChange={update("site")}
            />
          </Field>
          <Field label="Count seen">
            <input type="number" min="0" inputMode="numeric" className={inputClass} value={draft.count} onChange={update("count")} />
          </Field>
          <Field label="Depth (m)">
            <input type="number" min="0" step="0.1" inputMode="decimal" className={inputClass} value={draft.depthM} onChange={update("depthM")} />
          </Field>
          <Field label="Latitude">
            <input type="number" step="any" className={inputClass} value={draft.lat} onChange={update("lat")} />
          </Field>
          <Field label="Longitude">
            <input type="number" step="any" className={inputClass} value={draft.lng} onChange={update("lng")} />
          </Field>
          <div className="col-span-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onTogglePlace}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                placing
                  ? "border-uni-400 bg-uni-500 text-ink-950"
                  : "border-ink-600 text-foam hover:border-uni-400"
              }`}
            >
              {placing ? "Click the map now…" : "Pick on map"}
            </button>
            <button
              type="button"
              onClick={locateMe}
              className="rounded-full border border-ink-600 px-3 py-1.5 text-xs font-medium text-foam hover:border-uni-400"
            >
              Use my location
            </button>
          </div>
          <Field label="Notes" className="col-span-2">
            <textarea
              rows={2}
              className={inputClass}
              placeholder="Seaweed cover, test size, barren or forest…"
              value={draft.notes}
              onChange={update("notes")}
            />
          </Field>
          <div className="col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-uni-500 px-5 py-2 text-sm font-semibold text-ink-950 transition hover:bg-uni-400 disabled:opacity-50"
            >
              Save sighting
            </button>
            {message && (
              <span role="status" className={`text-xs ${toneClass[message.tone]}`}>
                {message.text}
              </span>
            )}
          </div>
        </form>

        <div className="flex min-w-0 flex-col">
          <div className="mb-2 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!entries.length}
              onClick={() => downloadCsv(entries)}
              className="rounded-full border border-ink-600 px-3 py-1.5 text-xs font-medium text-foam hover:border-kelp-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="rounded-full border border-ink-600 px-3 py-1.5 text-xs font-medium text-foam hover:border-kelp-400"
            >
              Import CSV
            </button>
            <input ref={fileInput} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
          </div>

          {sorted.length ? (
            <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {sorted.map((entry) => (
                  <motion.li
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="rounded-xl border border-ink-700 bg-ink-950/60 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foam">{entry.site || "Unnamed site"}</p>
                        <p className="text-xs text-mist">
                          {speciesById[entry.speciesId]?.shortName || "Species not set"}
                          {entry.count !== "" && ` · ${entry.count} seen`}
                          {entry.depthM !== "" && ` · ${entry.depthM} m`}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="font-mono text-[11px] text-mist">{entry.date}</span>
                        <button
                          type="button"
                          onClick={() => onDelete(entry.id)}
                          aria-label={`Delete sighting at ${entry.site || "unnamed site"}`}
                          className="rounded-full px-1.5 text-mist hover:bg-ink-800 hover:text-uni-300"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    {entry.notes && <p className="mt-1.5 text-xs leading-relaxed text-foam/80">{entry.notes}</p>}
                    <p className="mt-1 font-mono text-[10px] text-mist/80">
                      {entry.lat.toFixed(4)}, {entry.lng.toFixed(4)}
                    </p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-ink-600 p-6 text-center text-sm text-mist">
              No sightings yet. Saved sightings show up here and as green dots on the map.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

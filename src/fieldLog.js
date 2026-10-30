// src/fieldLog.js
// The field log lives in this browser's localStorage only.

const STORAGE_KEY = "urchin-tracker.field-log.v1";

export const FIELDS = ["date", "site", "speciesId", "count", "depthM", "lat", "lng", "notes"];

export function loadLog() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isValidEntry) : [];
  } catch {
    return [];
  }
}

export function saveLog(entries) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

function isValidEntry(entry) {
  return (
    entry &&
    typeof entry === "object" &&
    Number.isFinite(Number(entry.lat)) &&
    Number.isFinite(Number(entry.lng))
  );
}

export function normalizeEntry(entry) {
  return {
    id: entry.id || makeId(),
    date: String(entry.date || "").slice(0, 10),
    site: String(entry.site || "").trim(),
    speciesId: String(entry.speciesId || ""),
    count: entry.count === "" || entry.count == null ? "" : Number(entry.count),
    depthM: entry.depthM === "" || entry.depthM == null ? "" : Number(entry.depthM),
    lat: Number(Number(entry.lat).toFixed(5)),
    lng: Number(Number(entry.lng).toFixed(5)),
    notes: String(entry.notes || "").trim(),
  };
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function summarize(entries) {
  const sites = new Set(
    entries.map((entry) => entry.site.toLowerCase()).filter(Boolean)
  );
  return { sightings: entries.length, sites: sites.size };
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(entries) {
  const lines = [FIELDS.join(",")];
  entries.forEach((entry) => {
    lines.push(FIELDS.map((field) => csvCell(entry[field])).join(","));
  });
  return lines.join("\r\n");
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((value) => value.trim() !== ""));
}

export function fromCsv(text) {
  const rows = parseCsvRows(text.replace(/^\uFEFF/, ""));
  if (rows.length < 2) return { entries: [], skipped: 0 };

  const header = rows[0].map((name) => name.trim());
  const missing = ["lat", "lng"].filter((field) => !header.includes(field));
  if (missing.length) {
    throw new Error(`CSV is missing column(s): ${missing.join(", ")}`);
  }

  let skipped = 0;
  const entries = [];
  rows.slice(1).forEach((values) => {
    const record = {};
    header.forEach((name, index) => {
      record[name] = values[index] ?? "";
    });
    if (record.lat === "" || record.lng === "" || !isValidEntry(record)) {
      skipped += 1;
      return;
    }
    entries.push(normalizeEntry({ ...record, id: undefined }));
  });
  return { entries, skipped };
}

export function downloadCsv(entries) {
  const blob = new Blob(["\uFEFF" + toCsv(entries)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `urchin-field-log-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

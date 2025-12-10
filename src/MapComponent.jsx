// src/MapComponent.jsx
import React from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ gridData, selectedSpecies, onCellClick }) => {
  const cells = gridData?.cells || [];

  const points = cells.map((cell) => ({
    id: cell.id,
    lat: cell.lat,
    lng: cell.lng,
    intensity: cell.count,
    risk: cell.risk,
  }));

  const maxIntensity =
    points.length > 0 ? Math.max(...points.map((p) => p.intensity)) : 1;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/70"
        minZoom={2}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* “Poor-man’s heatmap”: circles sized & colored by intensity */}
        {points.map((p) => {
          const normalized = p.intensity / maxIntensity;

          const color =
            p.risk === "High"
              ? "#f97316" // orange
              : p.risk === "Medium"
              ? "#22c55e" // green
              : "#38bdf8"; // blue

          const radius = 3 + normalized * 9;
          const fillOpacity = 0.25 + normalized * 0.6;

          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity,
                weight: 0.5,
              }}
              eventHandlers={{
                click: () => {
                  const cell = cells.find((c) => c.id === p.id);
                  if (onCellClick && cell) onCellClick(cell);
                },
              }}
            >
              <Tooltip direction="top" sticky>
                <div>
                  <div className="font-semibold">
                    {selectedSpecies?.commonName}
                  </div>
                  <div>Reports: {p.intensity}</div>
                  <div>Risk: {p.risk}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {points.length === 0 && (
        <div className="mt-2 text-xs text-slate-400">
          No recent GBIF reports found for{" "}
          <span className="font-semibold">
            {selectedSpecies?.scientificName}
          </span>{" "}
          in the last 5 years.
        </div>
      )}
    </div>
  );
};

export default MapComponent;

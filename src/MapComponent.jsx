import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function markerColor(risk) {
  if (risk === "High") return "#fb923c";
  if (risk === "Medium") return "#34d399";
  return "#67e8f9";
}

const MapComponent = ({ gridData, selectedSpecies, onCellClick }) => {
  const cells = gridData?.cells || [];
  const maxCount = cells.length
    ? Math.max(...cells.map((cell) => cell.count))
    : 1;

  return (
    <div className="h-full min-h-[520px] w-full border border-stone-800 bg-stone-950">
      <MapContainer
        center={[18, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={9}
        className="h-full min-h-[520px] w-full bg-stone-950"
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cells.map((cell) => {
          const normalized = cell.count / maxCount;
          const color = markerColor(cell.risk);
          const radius = 4 + normalized * 12;

          return (
            <CircleMarker
              key={cell.id}
              center={[cell.lat, cell.lng]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.25 + normalized * 0.55,
                opacity: 0.9,
                weight: 1,
              }}
              eventHandlers={{
                click: () => {
                  onCellClick?.(cell);
                },
              }}
            >
              <Tooltip direction="top" sticky>
                <div>
                  <div className="font-semibold">
                    {selectedSpecies?.commonName}
                  </div>
                  <div>Reports: {cell.count}</div>
                  <div>Risk: {cell.risk}</div>
                  <div>
                    Cell: {cell.lat.toFixed(1)}, {cell.lng.toFixed(1)}
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {cells.length === 0 && (
        <div className="border-t border-stone-800 px-4 py-3 text-xs text-stone-400">
          No recent coordinate-backed GBIF records found for{" "}
          <span className="font-semibold text-stone-200">
            {selectedSpecies?.scientificName}
          </span>
          .
        </div>
      )}
    </div>
  );
};

export default MapComponent;

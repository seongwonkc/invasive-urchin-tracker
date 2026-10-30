import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";

const BASEMAP_ATTRIBUTION =
  'Basemap &copy; <a href="https://www.esri.com">Esri</a>, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
// GBIF answers 204 for empty tiles; without a fallback Leaflet keeps the
// stretched lower-zoom tile on screen in that spot.
const EMPTY_TILE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const GBIF_ATTRIBUTION = 'Occurrences &copy; <a href="https://www.gbif.org">GBIF</a>';
const WORLD = [
  [-50, -150],
  [65, 160],
];

function spotIcon(status, selected) {
  return L.divIcon({
    className: "",
    html: `<span class="spot spot-${status}${selected ? " is-selected" : ""}"><span class="spot-ring"></span><span class="spot-ring spot-ring-2"></span><span class="spot-dot"></span></span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function FlyTo({ spot }) {
  const map = useMap();
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!spot) {
      if (reduce) map.fitBounds(WORLD);
      else map.flyToBounds(WORLD, { duration: 1.2 });
      return;
    }
    const target = [spot.lat, spot.lng];
    if (reduce) map.setView(target, spot.zoom);
    else map.flyTo(target, spot.zoom, { duration: 1.4 });
  }, [map, spot]);
  return null;
}

// Wheel zoom stays off until the map is clicked, so scrolling the page past
// the map never zooms it by accident.
function WheelGuard() {
  const map = useMap();
  useEffect(() => {
    const enable = () => map.scrollWheelZoom.enable();
    const disable = () => map.scrollWheelZoom.disable();
    map.on("click", enable);
    map.on("mouseout", disable);
    return () => {
      map.off("click", enable);
      map.off("mouseout", disable);
    };
  }, [map]);
  return null;
}

export default function SpotMap({ spots, selectedId, statusFor, densityUrl, onSelect }) {
  const selected = spots.find((spot) => spot.id === selectedId) || null;
  const icons = useMemo(
    () => Object.fromEntries(spots.map((spot) => [spot.id, spotIcon(statusFor(spot), spot.id === selectedId)])),
    [spots, selectedId, statusFor]
  );

  return (
    <MapContainer bounds={WORLD} minZoom={2} maxZoom={13} worldCopyJump scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution={BASEMAP_ATTRIBUTION}
        url={`${ESRI}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`}
        maxNativeZoom={16}
        className="basemap"
      />
      {densityUrl && (
        <TileLayer key={densityUrl} url={densityUrl} attribution={GBIF_ATTRIBUTION} errorTileUrl={EMPTY_TILE} opacity={0.7} zIndex={2} />
      )}
      <TileLayer url={`${ESRI}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`} maxNativeZoom={16} zIndex={3} />

      <FlyTo spot={selected} />
      <WheelGuard />

      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={icons[spot.id]}
          zIndexOffset={spot.id === selectedId ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(spot.id) }}
          keyboard
          title={spot.name}
        >
          <Tooltip direction="top" offset={[0, -14]}>
            <span className="text-xs font-semibold">{spot.name}</span>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}

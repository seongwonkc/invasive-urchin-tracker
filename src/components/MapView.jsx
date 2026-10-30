import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Rectangle,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { REGIONS } from "../data";

const BASEMAP_ATTRIBUTION =
  'Basemap &copy; <a href="https://www.esri.com">Esri</a>, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
// GBIF answers 204 for empty tiles; without a fallback Leaflet keeps the
// stretched lower-zoom tile on screen in that spot.
const EMPTY_TILE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const GBIF_ATTRIBUTION = 'Occurrences &copy; <a href="https://www.gbif.org">GBIF</a>';

function RegionFitter({ regionId }) {
  const map = useMap();

  useEffect(() => {
    const region = REGIONS[regionId];
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) map.fitBounds(region.bounds);
    else map.flyToBounds(region.bounds, { duration: 1.2 });
  }, [map, regionId]);

  return null;
}

function ClickCatcher({ onMapClick }) {
  // Wheel zoom stays off until the map is clicked, so scrolling the page
  // past the map never zooms it by accident.
  const map = useMapEvents({
    mouseout() {
      map.scrollWheelZoom.disable();
    },
    click(event) {
      map.scrollWheelZoom.enable();
      const point = event.latlng.wrap();
      onMapClick({ lat: point.lat, lng: point.lng, zoom: map.getZoom() });
    },
  });
  return null;
}

export default function MapView({
  tileUrl,
  regionId,
  mode,
  box,
  fieldEntries,
  draftPoint,
  speciesById,
  onMapClick,
}) {
  return (
    <MapContainer
      bounds={REGIONS.world.bounds}
      minZoom={1}
      maxZoom={13}
      worldCopyJump
      scrollWheelZoom={false}
      className={`h-full w-full ${mode === "place" ? "map-placing" : ""}`}
    >
      <TileLayer
        attribution={BASEMAP_ATTRIBUTION}
        url={`${ESRI}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`}
        maxNativeZoom={16}
        className="basemap"
      />
      <TileLayer
        key={tileUrl}
        url={tileUrl}
        attribution={GBIF_ATTRIBUTION}
        errorTileUrl={EMPTY_TILE}
        opacity={0.88}
        zIndex={2}
      />
      <TileLayer
        url={`${ESRI}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`}
        maxNativeZoom={16}
        zIndex={3}
      />

      <RegionFitter regionId={regionId} />
      <ClickCatcher onMapClick={onMapClick} />

      {box && (
        <Rectangle
          bounds={[
            [box.south, box.west],
            [box.north, box.east],
          ]}
          pathOptions={{
            color: "#ff9a2e",
            weight: 1.5,
            dashArray: "4 4",
            fillColor: "#ff9a2e",
            fillOpacity: 0.08,
          }}
        />
      )}

      {fieldEntries.map((entry) => (
        <CircleMarker
          key={entry.id}
          center={[entry.lat, entry.lng]}
          radius={7}
          pathOptions={{
            color: "#ffffff",
            weight: 2,
            fillColor: "#5ccf8e",
            fillOpacity: 1,
          }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            <div className="text-xs">
              <div className="font-semibold">{entry.site || "Unnamed site"}</div>
              <div>
                {speciesById[entry.speciesId]?.shortName || "Species not set"}
                {entry.count !== "" ? ` · ${entry.count} seen` : ""}
              </div>
              <div className="opacity-70">{entry.date}</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}

      {draftPoint && (
        <CircleMarker
          center={[draftPoint.lat, draftPoint.lng]}
          radius={9}
          pathOptions={{
            color: "#5ccf8e",
            weight: 2,
            dashArray: "3 3",
            fillColor: "#5ccf8e",
            fillOpacity: 0.25,
          }}
        />
      )}
    </MapContainer>
  );
}

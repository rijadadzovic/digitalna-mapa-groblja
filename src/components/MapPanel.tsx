import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Grave } from "../types";
import { Link } from "react-router-dom";

function FlyTo({ target }: { target?: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 18), { duration: 0.8 });
  }, [target, map]);
  return null;
}

type Props = {
  graves: Grave[];
  selected?: Grave;
  onSelect: (g: Grave) => void;
};

export default function MapPanel({ graves, selected, onSelect }: Props) {
  // Default centar: Sarajevo (promijeni na tvoje groblje kad budeš znao koordinate)
  const defaultCenter = useMemo(() => ({ lat: 43.8563, lng: 18.4131 }), []);

  return (
    <div className="panel mapWrap">
      <h2>Mapa</h2>
      <div className="muted">OpenStreetMap (open source) · Zum i klik na marker</div>

      <div className="map" style={{ marginTop: 10 }}>
        <MapContainer
          center={[defaultCenter.lat, defaultCenter.lng]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyTo target={selected ? { lat: selected.lat, lng: selected.lng } : undefined} />

          {graves
            .filter((g) => Number.isFinite(g.lat) && Number.isFinite(g.lng))
            .map((g) => (
              <Marker
                key={g.id}
                position={[g.lat, g.lng]}
                eventHandlers={{
                  click: () => onSelect(g)
                }}
              >
                <Popup>
                  <div style={{ minWidth: 220 }}>
                    <b>{g.fullName}</b>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      {g.birthDate ? `Rođ.: ${g.birthDate}` : ""}{g.birthDate && g.deathDate ? " · " : ""}{g.deathDate ? `Smrt: ${g.deathDate}` : ""}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                      {[g.section && `Parcela ${g.section}`, g.row && `Red ${g.row}`, g.plotNumber && `Broj ${g.plotNumber}`]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Link className="btn primary" to={`/grob/${g.id}`}>Detalji</Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}

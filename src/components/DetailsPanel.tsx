import React from "react";
import type { Grave } from "../types";
import { Link } from "react-router-dom";

export default function DetailsPanel({ grave }: { grave?: Grave }) {
  if (!grave) {
    return (
      <div className="panel">
        <h2>Detalji</h2>
        <div className="muted">Klikni marker ili odaberi osobu sa liste.</div>
      </div>
    );
  }

  const loc = [grave.section && `Parcela ${grave.section}`, grave.row && `Red ${grave.row}`, grave.plotNumber && `Broj ${grave.plotNumber}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="panel">
      <h2>Detalji</h2>
      <div className="card">
        <b>{grave.fullName || `${grave.firstName} ${grave.lastName}`}</b>
        <div className="meta">{grave.birthDate ? `Rođ.: ${grave.birthDate}` : "—"}{grave.deathDate ? ` · Smrt: ${grave.deathDate}` : ""}</div>
        <div className="meta">{loc || "Lokacija: —"}</div>
        {grave.notes ? <div style={{ marginTop: 8 }}>{grave.notes}</div> : null}
        <div className="meta" style={{ marginTop: 10 }}>
          <Link className="btn primary" to={`/grob/${grave.id}`}>Otvori link groba</Link>
        </div>
      </div>
      <div className="muted" style={{ marginTop: 8 }}>
        Koordinate: {grave.lat.toFixed(6)}, {grave.lng.toFixed(6)}
      </div>
    </div>
  );
}

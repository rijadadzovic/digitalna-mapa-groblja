import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Grave } from "../types";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import MapPanel from "../components/MapPanel";
import DetailsPanel from "../components/DetailsPanel";

export default function GravePage() {
  const { id } = useParams();
  const [grave, setGrave] = useState<Grave | undefined>();
  const [all, setAll] = useState<Grave[]>([]);

  useEffect(() => {
    if (!id) return;
    const ref = doc(db, "graves", id);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) { setGrave(undefined); return; }
      setGrave({ id: snap.id, ...(snap.data() as any) });
      setAll([{ id: snap.id, ...(snap.data() as any) }]);
    });
    return () => unsub();
  }, [id]);

  return (
    <main className="container">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="panel">
          <h2>Grob</h2>
          <div className="muted">Direktan link (QR kod) za jedan grob.</div>
          <div style={{ marginTop: 10 }}>
            <Link className="btn" to="/">← Nazad na mapu</Link>
          </div>
        </div>
        <DetailsPanel grave={grave} />
      </div>

      <MapPanel graves={all} selected={grave} onSelect={() => {}} />
    </main>
  );
}

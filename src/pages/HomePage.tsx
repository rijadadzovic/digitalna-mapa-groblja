import React, { useEffect, useState } from "react";
import type { Grave } from "../types";
import { subscribeGraves } from "../data/graves";
import SearchPanel from "../components/SearchPanel";
import MapPanel from "../components/MapPanel";
import DetailsPanel from "../components/DetailsPanel";

export default function HomePage() {
  const [graves, setGraves] = useState<Grave[]>([]);
  const [selected, setSelected] = useState<Grave | undefined>(undefined);

  useEffect(() => {
    const unsub = subscribeGraves((items) => setGraves(items));
    return () => unsub();
  }, []);

  return (
    <main className="container">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <SearchPanel graves={graves} selectedId={selected?.id} onSelect={(g) => setSelected(g)} />
        <DetailsPanel grave={selected} />
      </div>
      <MapPanel graves={graves} selected={selected} onSelect={(g) => setSelected(g)} />
    </main>
  );
}

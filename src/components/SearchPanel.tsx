import React, { useMemo, useState } from "react";
import type { Grave } from "../types";

type Props = {
  graves: Grave[];
  selectedId?: string;
  onSelect: (g: Grave) => void;
};

export default function SearchPanel({ graves, selectedId, onSelect }: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return graves;
    // Pretraga po imenu, prezimenu, parceli, redu, broju
    return graves.filter((g) => {
      const hay = [
        g.fullName,
        g.firstName,
        g.lastName,
        g.section ?? "",
        g.row ?? "",
        g.plotNumber ?? ""
      ].join(" ").toLowerCase();
      return hay.includes(term);
    });
  }, [q, graves]);

  return (
    <div className="panel">
      <h2>Pretraga</h2>
      <input
        className="input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Unesi ime, prezime, parcela, red, broj…"
      />
      <div className="muted" style={{ marginTop: 8 }}>
        Prikazano: {filtered.length} / {graves.length}
      </div>

      <div className="list">
        {filtered.slice(0, 200).map((g) => (
          <button
            key={g.id}
            className="card"
            style={{
              textAlign: "left",
              cursor: "pointer",
              outline: "none",
              borderColor: g.id === selectedId ? "rgba(94,234,212,0.55)" : undefined
            }}
            onClick={() => onSelect(g)}
            title="Prikaži na mapi"
          >
            <b>{g.fullName || `${g.firstName} ${g.lastName}`}</b>
            <div className="meta">
              {g.birthDate ? `Rođ.: ${g.birthDate}` : ""}{g.birthDate && g.deathDate ? " · " : ""}{g.deathDate ? `Smrt: ${g.deathDate}` : ""}
            </div>
            <div className="meta">
              {[g.section && `Parcela ${g.section}`, g.row && `Red ${g.row}`, g.plotNumber && `Broj ${g.plotNumber}`]
                .filter(Boolean)
                .join(" · ") || "—"}
            </div>
          </button>
        ))}
        {filtered.length > 200 ? (
          <div className="muted">Za brzinu prikazujem prvih 200 rezultata.</div>
        ) : null}
      </div>
    </div>
  );
}

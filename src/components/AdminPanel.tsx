import React, { useMemo, useState } from "react";
import type { Grave } from "../types";
import { createGrave, removeGrave, updateGrave } from "../data/graves";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

type Props = {
  graves: Grave[];
};

function LocationPicker({
  value,
  onChange
}: {
  value: { lat: number; lng: number };
  onChange: (v: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return <Marker position={[value.lat, value.lng]} draggable={true} eventHandlers={{
    dragend: (e) => {
      const m = e.target;
      const p = m.getLatLng();
      onChange({ lat: p.lat, lng: p.lng });
    }
  }} />;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  birthDate: "",
  deathDate: "",
  section: "",
  row: "",
  plotNumber: "",
  notes: ""
};

export default function AdminPanel({ graves }: Props) {
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<string>("");
  const selected = useMemo(() => graves.find((g) => g.id === selectedId), [graves, selectedId]);

  // Default lokacija (Sarajevo) - promijeni na centar groblja kad budeš znao koordinate
  const [loc, setLoc] = useState<{ lat: number; lng: number }>({ lat: 43.8563, lng: 18.4131 });

  const [form, setForm] = useState({ ...emptyForm });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function loadFromSelected() {
    if (!selected) return;
    setForm({
      firstName: selected.firstName ?? "",
      lastName: selected.lastName ?? "",
      birthDate: selected.birthDate ?? "",
      deathDate: selected.deathDate ?? "",
      section: selected.section ?? "",
      row: selected.row ?? "",
      plotNumber: selected.plotNumber ?? "",
      notes: selected.notes ?? ""
    });
    setLoc({ lat: selected.lat, lng: selected.lng });
  }

  return (
    <div className="container">
      <div className="panel">
        <h2>Admin unos</h2>
        <div className="muted">Klik na mapu postavlja lokaciju markera. Marker je i draggable.</div>

        <div className="row" style={{ marginTop: 10 }}>
          <button className={"btn " + (mode === "create" ? "primary" : "")} onClick={() => { setMode("create"); setSelectedId(""); setForm({ ...emptyForm }); setMsg(null); setErr(null); }}>
            Novi unos
          </button>
          <button className={"btn " + (mode === "edit" ? "primary" : "")} onClick={() => { setMode("edit"); setMsg(null); setErr(null); }}>
            Uredi postojeći
          </button>
        </div>

        {mode === "edit" ? (
          <div style={{ marginTop: 10 }}>
            <label className="muted">Odaberi grob</label>
            <select className="input" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              <option value="">— Odaberi —</option>
              {graves.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.fullName} ({g.section ?? "-"} / {g.row ?? "-"} / {g.plotNumber ?? "-"})
                </option>
              ))}
            </select>
            <div style={{ marginTop: 10 }}>
              <button className="btn" disabled={!selected} onClick={loadFromSelected}>
                Učitaj podatke
              </button>
              <button
                className="btn danger"
                style={{ marginLeft: 10 }}
                disabled={!selected || busy}
                onClick={async () => {
                  if (!selected) return;
                  if (!confirm("Obrisati ovaj zapis?")) return;
                  setBusy(true); setErr(null); setMsg(null);
                  try {
                    await removeGrave(selected.id);
                    setMsg("Obrisano.");
                    setSelectedId("");
                  } catch (e: any) {
                    setErr(e?.message ?? "Greška pri brisanju.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Obriši
              </button>
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 12 }}>
          <div className="row">
            <div>
              <label className="muted">Ime</label>
              <input className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="muted">Prezime</label>
              <input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <div>
              <label className="muted">Datum rođenja</label>
              <input className="input" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} placeholder="npr. 09.01.1950" />
            </div>
            <div>
              <label className="muted">Datum smrti</label>
              <input className="input" value={form.deathDate} onChange={(e) => setForm({ ...form, deathDate: e.target.value })} placeholder="npr. 10.02.2020" />
            </div>
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <div>
              <label className="muted">Parcela</label>
              <input className="input" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
            </div>
            <div>
              <label className="muted">Red</label>
              <input className="input" value={form.row} onChange={(e) => setForm({ ...form, row: e.target.value })} />
            </div>
            <div>
              <label className="muted">Broj</label>
              <input className="input" value={form.plotNumber} onChange={(e) => setForm({ ...form, plotNumber: e.target.value })} />
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <label className="muted">Napomena</label>
            <textarea className="input" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <div>
              <label className="muted">Lat</label>
              <input className="input" value={loc.lat} onChange={(e) => setLoc({ ...loc, lat: Number(e.target.value) })} />
            </div>
            <div>
              <label className="muted">Lng</label>
              <input className="input" value={loc.lng} onChange={(e) => setLoc({ ...loc, lng: Number(e.target.value) })} />
            </div>
          </div>

          {err ? <div style={{ marginTop: 10, color: "var(--danger)" }}>{err}</div> : null}
          {msg ? <div style={{ marginTop: 10, color: "var(--accent)" }}>{msg}</div> : null}

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn primary"
              disabled={busy}
              onClick={async () => {
                setErr(null); setMsg(null);
                const firstName = form.firstName.trim();
                const lastName = form.lastName.trim();
                if (!firstName || !lastName) { setErr("Ime i prezime su obavezni."); return; }
                if (!Number.isFinite(loc.lat) || !Number.isFinite(loc.lng)) { setErr("Koordinate nisu validne."); return; }

                setBusy(true);
                try {
                  if (mode === "create") {
                    await createGrave({
                      firstName, lastName,
                      fullName: `${firstName} ${lastName}`.trim(),
                      birthDate: form.birthDate.trim() || undefined,
                      deathDate: form.deathDate.trim() || undefined,
                      section: form.section.trim() || undefined,
                      row: form.row.trim() || undefined,
                      plotNumber: form.plotNumber.trim() || undefined,
                      notes: form.notes.trim() || undefined,
                      lat: loc.lat,
                      lng: loc.lng
                    } as any);
                    setMsg("Sačuvano (novi unos).");
                    setForm({ ...emptyForm });
                  } else {
                    if (!selected) { setErr("Odaberi zapis za uređivanje."); return; }
                    await updateGrave(selected.id, {
                      firstName, lastName,
                      fullName: `${firstName} ${lastName}`.trim(),
                      birthDate: form.birthDate.trim() || undefined,
                      deathDate: form.deathDate.trim() || undefined,
                      section: form.section.trim() || undefined,
                      row: form.row.trim() || undefined,
                      plotNumber: form.plotNumber.trim() || undefined,
                      notes: form.notes.trim() || undefined,
                      lat: loc.lat,
                      lng: loc.lng
                    } as any);
                    setMsg("Sačuvano (izmjene).");
                  }
                } catch (e: any) {
                  setErr(e?.message ?? "Greška pri snimanju.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              Sačuvaj
            </button>

            <button className="btn" onClick={() => { setForm({ ...emptyForm }); setMsg(null); setErr(null); }}>
              Očisti formu
            </button>
          </div>

          <div className="muted" style={{ marginTop: 10 }}>
            Savjet: prvo zumiraj do groblja, pa klikni na tačnu lokaciju groba.
          </div>
        </div>
      </div>

      <div className="panel mapWrap">
        <h2>Mapa za odabir lokacije</h2>
        <div className="muted">Klik na mapu postavlja marker. Povuci marker za fino podešavanje.</div>

        <div className="map" style={{ marginTop: 10 }}>
          <MapContainer center={[loc.lat, loc.lng]} zoom={17} style={{ width: "100%", height: "100%" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker value={loc} onChange={setLoc} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

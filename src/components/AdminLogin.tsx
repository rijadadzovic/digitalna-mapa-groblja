import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, ADMIN_EMAIL } from "../firebase";

export default function AdminLogin() {
  const [email, setEmail] = useState(ADMIN_EMAIL || "");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="panel" style={{ maxWidth: 520, margin: "14px auto" }}>
      <h2>Admin prijava</h2>
      <div className="muted">Prijava je preko Firebase Authentication (email + lozinka).</div>

      <div style={{ marginTop: 12 }}>
        <label className="muted">Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
      </div>

      <div style={{ marginTop: 10 }}>
        <label className="muted">Lozinka</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </div>

      {err ? <div style={{ marginTop: 10, color: "var(--danger)" }}>{err}</div> : null}

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <button
          className="btn primary"
          disabled={busy}
          onClick={async () => {
            setErr(null);
            setBusy(true);
            try {
              await signInWithEmailAndPassword(auth, email.trim(), password);
            } catch (e: any) {
              setErr(e?.message ?? "Greška pri prijavi.");
            } finally {
              setBusy(false);
            }
          }}
        >
          Prijavi se
        </button>
      </div>

      <div className="muted" style={{ marginTop: 12 }}>
        Napomena: Firestore Rules moraju dozvoliti pisanje samo adminu (pogledaj README).
      </div>
    </div>
  );
}

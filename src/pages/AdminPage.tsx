import React, { useEffect, useState } from "react";
import { useAuthUser } from "../hooks/useAuthUser";
import AdminLogin from "../components/AdminLogin";
import AdminPanel from "../components/AdminPanel";
import type { Grave } from "../types";
import { subscribeGraves } from "../data/graves";
import { ADMIN_EMAIL } from "../firebase";

export default function AdminPage() {
  const { user, loading } = useAuthUser();
  const isAdmin =
    !!user && (!!ADMIN_EMAIL ? user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() : false);

  const [graves, setGraves] = useState<Grave[]>([]);
  useEffect(() => {
    const unsub = subscribeGraves((items) => setGraves(items));
    return () => unsub();
  }, []);

  if (loading) return <div className="panel" style={{ maxWidth: 520, margin: "14px auto" }}>Učitavanje…</div>;

  if (!user) return <AdminLogin />;

  if (!isAdmin) {
    return (
      <div className="panel" style={{ maxWidth: 640, margin: "14px auto" }}>
        <h2>Nemaš admin prava</h2>
        <div className="muted">
          Prijavljen si kao: <b>{user.email}</b> — ali admin email je ograničen preko <code>.env</code> i Firestore Rules.
        </div>
        <div className="muted" style={{ marginTop: 10 }}>
          Ako želiš više admina: u Firestore Rules dodaj više email adresa (ili implementiraj custom claims).
        </div>
      </div>
    );
  }

  return <AdminPanel graves={graves} />;
}

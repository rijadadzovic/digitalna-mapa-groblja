import React from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GravePage from "./pages/GravePage";
import AdminPage from "./pages/AdminPage";
import { useAuthUser } from "./hooks/useAuthUser";
import { ADMIN_EMAIL } from "./firebase";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import Footer from "./components/Footer";

export default function App() {
  const { user, loading } = useAuthUser();
  const navigate = useNavigate();

  const isAdmin =
    !!user && (!!ADMIN_EMAIL ? user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() : false);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <b>Digitalna mapa groblja</b>
            <span>Pretraga imena + mapa (OpenStreetMap)</span>
          </div>

          <div className="navbtns">
            <Link className="btn" to="/">Mapa</Link>
            <Link className="btn" to="/admin">Admin</Link>
            {!loading && user ? (
              <button
                className="btn danger"
                onClick={async () => {
                  await signOut(auth);
                  navigate("/");
                }}
                title="Odjava"
              >
                Odjava
              </button>
            ) : null}
            {!loading && user && !isAdmin ? (
              <span className="muted" title="Prijavljen, ali nije admin">Prijavljen</span>
            ) : null}
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/grob/:id" element={<GravePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

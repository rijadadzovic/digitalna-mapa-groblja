import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <img src="/rijad.jpg" alt="Rijad Adžović" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
      <span>Aplikaciju izradio Rijad Adžović</span>
    </footer>
  );
}

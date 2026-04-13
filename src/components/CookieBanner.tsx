"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner only if user hasn't accepted yet
    // Using a simple state flag — cookies consent is stored in-memory per session
    // since we don't set our own cookies, we just inform about third-party ones
    const accepted = sessionStorage.getItem("cookies_accepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    sessionStorage.setItem("cookies_accepted", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-[#0a0a1a]/95 border-t border-white/10 backdrop-blur-md">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-white/60 text-[10px] leading-relaxed flex-1">
          Este sitio web utiliza cookies de terceros (Spotify) para ofrecer contenido multimedia integrado.
          Si continúas navegando, consideraremos que aceptas su uso.{" "}
          <a
            href="https://www.spotify.com/legal/cookies-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EAB3CB] hover:text-[#f5c7db] underline"
          >
            Más información
          </a>
        </p>
        <button
          onClick={handleAccept}
          className="shrink-0 px-4 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/80 text-[10px] font-medium border border-white/15 transition-all"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

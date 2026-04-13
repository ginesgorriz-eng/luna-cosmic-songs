export default function CookieBanner() {
  return (
    <div className="w-full z-50 py-2 px-3 bg-[#0a0a1a]/95 border-t border-white/10">
      <p className="max-w-3xl mx-auto text-white/40 text-[9px] leading-relaxed text-center">
        Este sitio web utiliza cookies de terceros (Spotify) para ofrecer contenido multimedia integrado.
        Si continúas navegando, consideraremos que aceptas su uso.{" "}
        <a
          href="https://www.spotify.com/legal/cookies-policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#EAB3CB]/60 hover:text-[#EAB3CB] underline"
        >
          Más información
        </a>
      </p>
    </div>
  );
}

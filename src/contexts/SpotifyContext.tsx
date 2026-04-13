"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SpotifyContextType {
  spotifyUnlocked: boolean;
}

const SpotifyContext = createContext<SpotifyContextType>({ spotifyUnlocked: false });

export function useSpotify() {
  return useContext(SpotifyContext);
}

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Detect user interaction with Spotify iframe
  const handleUnlock = useCallback(() => {
    if (!unlocked) {
      setUnlocked(true);
    }
  }, [unlocked]);

  useEffect(() => {
    const handleBlur = () => {
      if (iframeRef.current && document.activeElement === iframeRef.current) {
        handleUnlock();
      }
    };

    window.addEventListener("blur", handleBlur);

    const interval = setInterval(() => {
      if (iframeRef.current && document.activeElement === iframeRef.current) {
        handleUnlock();
      }
    }, 1000);

    return () => {
      window.removeEventListener("blur", handleBlur);
      clearInterval(interval);
    };
  }, [handleUnlock]);

  const isHomePage = pathname === "/";

  return (
    <SpotifyContext.Provider value={{ spotifyUnlocked: unlocked }}>
      {/* Spotify iframe — ALWAYS mounted so music persists across pages */}
      <div
        style={
          isHomePage
            ? {
                position: "fixed",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 50,
                width: "min(400px, calc(100% - 32px))",
              }
            : {
                position: "fixed",
                left: "-9999px",
                top: "-9999px",
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "none",
              }
        }
      >
        {isHomePage && (
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "12px",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, textAlign: "center", marginBottom: 8 }}>
              Escucha CL34N. Dale al play para poder jugar
            </p>
            {unlocked && (
              <p style={{ color: "#22c55e", fontSize: 13, fontWeight: 600, textAlign: "center", marginBottom: 8 }}>
                ✓ Spotify conectado — ¡Adelante!
              </p>
            )}
          </div>
        )}
        <iframe
          ref={iframeRef}
          style={{
            borderRadius: 12,
            width: "100%",
            maxWidth: 400,
            margin: "0 auto",
            display: "block",
          }}
          src="https://open.spotify.com/embed/album/4mGvnfMaCkGXo1LHWjiOmD?utm_source=generator&theme=0"
          height={152}
          frameBorder={0}
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
      {children}
    </SpotifyContext.Provider>
  );
}

"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SpotifyContextType {
  spotifyUnlocked: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

const SpotifyContext = createContext<SpotifyContextType>({
  spotifyUnlocked: false,
  iframeRef: { current: null },
});

export function useSpotify() {
  return useContext(SpotifyContext);
}

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    <SpotifyContext.Provider value={{ spotifyUnlocked: unlocked, iframeRef }}>
      {/* Iframe always mounted — hidden off-screen when NOT on home page */}
      {!isHomePage && (
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: "-9999px",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <iframe
            ref={iframeRef}
            style={{ borderRadius: 12, width: 400 }}
            src="https://open.spotify.com/embed/album/4mGvnfMaCkGXo1LHWjiOmD?utm_source=generator&theme=0"
            height={152}
            frameBorder={0}
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
      {children}
    </SpotifyContext.Provider>
  );
}

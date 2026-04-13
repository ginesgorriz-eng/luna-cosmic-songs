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

  // Detect when user interacts with the Spotify iframe
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
      {/* SINGLE iframe — always rendered, never destroyed, never moved in DOM.
          On home: visible at a fixed position matching the page layout.
          On other pages: hidden off-screen via CSS only. */}
      <div
        style={
          isHomePage
            ? {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                marginTop: 30,
                width: 400,
                zIndex: 50,
                pointerEvents: "auto",
              }
            : {
                position: "fixed",
                left: "-9999px",
                top: "-9999px",
                width: 1,
                height: 1,
                overflow: "hidden",
                pointerEvents: "none",
              }
        }
      >
        <iframe
          ref={iframeRef}
          style={{ borderRadius: 12, width: "100%", display: "block" }}
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

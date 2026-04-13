"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

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
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const handleUnlock = useCallback(() => {
    if (!unlocked) setUnlocked(true);
  }, [unlocked]);

  // Listen for Spotify interaction
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

  // Watch for portal target on home page
  useEffect(() => {
    const check = () => {
      const el = document.getElementById("spotify-portal-target");
      setPortalTarget(el);
    };
    check();
    // Re-check after navigation (DOM may not be ready immediately)
    const timer = setTimeout(check, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  const isHomePage = pathname === "/";

  const iframeElement = (
    <iframe
      ref={iframeRef as React.RefObject<HTMLIFrameElement>}
      style={{ borderRadius: 12, width: "100%", maxWidth: 400, margin: "0 auto", display: "block" }}
      src="https://open.spotify.com/embed/album/4mGvnfMaCkGXo1LHWjiOmD?utm_source=generator&theme=0"
      height={152}
      frameBorder={0}
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );

  return (
    <SpotifyContext.Provider value={{ spotifyUnlocked: unlocked, iframeRef }}>
      {/* If home page has a portal target, render iframe there (visible, inline).
          Otherwise render it off-screen to keep Spotify session alive. */}
      {isHomePage && portalTarget
        ? createPortal(iframeElement, portalTarget)
        : (
          <div style={{ position: "fixed", left: -9999, top: -9999, width: 1, height: 1, overflow: "hidden", pointerEvents: "none", visibility: "hidden" as const }}>
            {iframeElement}
          </div>
        )
      }
      {children}
    </SpotifyContext.Provider>
  );
}

"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
// createPortal removed — iframe now moved via DOM manipulation to prevent unmount

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
  const containerRef = useRef<HTMLDivElement>(null);

  // Move the persistent iframe container into the portal target on home,
  // or back to its hidden host on other pages — using DOM manipulation
  // so React never unmounts/recreates the iframe element.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isHomePage && portalTarget) {
      // Move container into the visible portal target
      container.style.position = "static";
      container.style.left = "auto";
      container.style.top = "auto";
      container.style.width = "100%";
      container.style.height = "auto";
      container.style.overflow = "visible";
      container.style.pointerEvents = "auto";
      container.style.visibility = "visible";
      if (container.parentElement !== portalTarget) {
        portalTarget.appendChild(container);
      }
    } else {
      // Move container back to the hidden host and hide it
      const hiddenHost = document.getElementById("spotify-hidden-host");
      if (hiddenHost && container.parentElement !== hiddenHost) {
        hiddenHost.appendChild(container);
      }
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "1px";
      container.style.height = "1px";
      container.style.overflow = "hidden";
      container.style.pointerEvents = "none";
      container.style.visibility = "hidden";
    }
  }, [isHomePage, portalTarget]);

  return (
    <SpotifyContext.Provider value={{ spotifyUnlocked: unlocked, iframeRef }}>
      {/* Hidden host — the iframe container lives here when not on home */}
      <div id="spotify-hidden-host" style={{ position: "fixed", left: -9999, top: -9999, width: 1, height: 1, overflow: "hidden", pointerEvents: "none" }}>
        <div ref={containerRef}>
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
        </div>
      </div>
      {children}
    </SpotifyContext.Provider>
  );
}

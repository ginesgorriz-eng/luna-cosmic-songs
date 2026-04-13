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
  const containerRef = useRef<HTMLDivElement>(null);

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

  const isHomePage = pathname === "/";

  // Position the iframe container:
  // - On home: overlay it exactly on top of #spotify-portal-target using coordinates
  // - On other pages: hide off-screen
  // The iframe NEVER moves in the DOM — only its CSS changes.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!isHomePage) {
      // Hide off-screen but keep alive
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "1px";
      container.style.height = "1px";
      container.style.overflow = "hidden";
      container.style.pointerEvents = "none";
      container.style.opacity = "0";
      container.style.zIndex = "-1";
      return;
    }

    // On home, position over the portal target
    const positionOverTarget = () => {
      const target = document.getElementById("spotify-portal-target");
      if (!target || !container) return;
      const rect = target.getBoundingClientRect();
      container.style.position = "fixed";
      container.style.left = rect.left + "px";
      container.style.top = (rect.top + window.scrollY) + "px";
      container.style.width = rect.width + "px";
      container.style.height = rect.height + "px";
      container.style.overflow = "visible";
      container.style.pointerEvents = "auto";
      container.style.opacity = "1";
      container.style.zIndex = "10";
    };

    // Position immediately and re-check on resize/scroll
    const timer = setTimeout(positionOverTarget, 50);
    const timer2 = setTimeout(positionOverTarget, 200);
    const timer3 = setTimeout(positionOverTarget, 500);
    window.addEventListener("resize", positionOverTarget);
    window.addEventListener("scroll", positionOverTarget);
    const interval = setInterval(positionOverTarget, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", positionOverTarget);
      window.removeEventListener("scroll", positionOverTarget);
      clearInterval(interval);
    };
  }, [isHomePage, pathname]);

  return (
    <SpotifyContext.Provider value={{ spotifyUnlocked: unlocked, iframeRef }}>
      {/* Iframe container — NEVER moves in DOM, only CSS changes */}
      <div
        ref={containerRef}
        style={{ position: "fixed", left: -9999, top: -9999, width: 1, height: 1, overflow: "hidden", pointerEvents: "none", opacity: 0, zIndex: -1, transition: "opacity 0.3s" }}
      >
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
      {children}
    </SpotifyContext.Provider>
  );
}

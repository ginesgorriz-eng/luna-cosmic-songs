"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SpotifyContextType {
  spotifyUnlocked: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  isMobile: boolean;
  manualUnlock: () => void;
}

const SpotifyContext = createContext<SpotifyContextType>({
  spotifyUnlocked: false,
  iframeRef: { current: null },
  isMobile: false,
  manualUnlock: () => {},
});

export function useSpotify() {
  return useContext(SpotifyContext);
}

// ─── APPROACH #5: NEVER MOVE THE IFRAME ───
// The iframe container ALWAYS stays as a direct child of document.body.
// On home page: position: fixed overlaying #spotify-portal-target visually.
// On other pages: hidden off-screen (audio keeps playing).
// CRITICAL: appendChild between parents causes browsers to reload iframes.
// That's why approaches 2 & 4 failed. We must NEVER call appendChild on the
// container after initial creation.

const CONTAINER_ID = "spotify-persistent-container";

function getOrCreateContainer(): HTMLDivElement {
  let el = document.getElementById(CONTAINER_ID) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = CONTAINER_ID;
    // Start hidden but rendered at real player size inside viewport.
    // Mobile browsers throttle/pause tiny or off-screen iframes.
    // 300×80 keeps the iframe "visible" to the browser engine.
    Object.assign(el.style, {
      position: "fixed", bottom: "0px", left: "0px",
      width: "300px", height: "80px", overflow: "hidden",
      pointerEvents: "none", zIndex: "-1", opacity: "0.01",
    });
    document.body.appendChild(el);
  }
  return el;
}

// Hide container WITHOUT moving it off-screen or shrinking it.
// Mobile browsers pause media in tiny/off-screen iframes.
// 300×80 at near-zero opacity keeps audio alive on iOS/Android.
function hideContainer(el: HTMLDivElement) {
  Object.assign(el.style, {
    position: "fixed", bottom: "0px", left: "0px",
    width: "300px", height: "80px", overflow: "hidden",
    pointerEvents: "none", zIndex: "-1", opacity: "0.01",
    // Remove top that may linger from positionOverTarget
    top: "auto", right: "auto",
  });
}

// Position container visually over the target element using position:fixed
// NEVER moves it in the DOM — just changes CSS
function positionOverTarget(container: HTMLDivElement, target: HTMLElement) {
  const rect = target.getBoundingClientRect();
  Object.assign(container.style, {
    position: "fixed",
    // rect already gives viewport-relative coords, perfect for fixed positioning
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${Math.max(rect.height, 152)}px`,
    overflow: "hidden",
    pointerEvents: "auto",
    zIndex: "50",
    opacity: "1",
    // Clear bottom/right from hideContainer
    bottom: "auto", right: "auto",
  });
}

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Detect mobile on mount (client-side only)
  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);

  const handleUnlock = useCallback(() => {
    if (!unlocked) setUnlocked(true);
  }, [unlocked]);

  // Manual unlock for mobile users who opened Spotify externally
  const manualUnlock = useCallback(() => {
    setUnlocked(true);
  }, []);

  // Create the iframe ONCE in the persistent container (outside React)
  // This effect runs only once. The container + iframe live forever in document.body.
  useEffect(() => {
    const container = getOrCreateContainer();
    if (!container.querySelector("iframe")) {
      const iframe = document.createElement("iframe");
      iframe.style.borderRadius = "12px";
      iframe.style.width = "100%";
      iframe.style.maxWidth = "400px";
      iframe.style.margin = "0 auto";
      iframe.style.display = "block";
      iframe.src = "https://open.spotify.com/embed/album/4mGvnfMaCkGXo1LHWjiOmD?utm_source=generator&theme=0";
      iframe.height = "152";
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;
      iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      // No lazy loading — mobile browsers throttle/suspend lazy iframes
      // that appear non-visible, causing audio skips every 10-20s.
      container.appendChild(iframe);
      (iframeRef as React.MutableRefObject<HTMLIFrameElement>).current = iframe;
    } else {
      (iframeRef as React.MutableRefObject<HTMLIFrameElement>).current =
        container.querySelector("iframe") as HTMLIFrameElement;
    }
  }, []);

  // Listen for Spotify interaction (blur + polling)
  useEffect(() => {
    const handleBlur = () => {
      const iframe = iframeRef.current;
      if (iframe && document.activeElement === iframe) {
        handleUnlock();
      }
    };
    window.addEventListener("blur", handleBlur);
    const interval = setInterval(() => {
      const iframe = iframeRef.current;
      if (iframe && document.activeElement === iframe) {
        handleUnlock();
      }
    }, 1000);
    return () => {
      window.removeEventListener("blur", handleBlur);
      clearInterval(interval);
    };
  }, [handleUnlock]);

  const isHomePage = pathname === "/";

  // On home: CSS-position container over #spotify-portal-target (visible, clickable)
  // On other pages: hide off-screen (audio keeps playing, iframe untouched in DOM)
  // CRITICAL: we NEVER appendChild/move the container — only change CSS properties
  useEffect(() => {
    const container = getOrCreateContainer();

    if (!isHomePage) {
      hideContainer(container);
      return;
    }

    // On home, position the container over the portal target
    let cancelled = false;
    let rafId: number | null = null;

    const align = () => {
      if (cancelled) return;
      const target = document.getElementById("spotify-portal-target");
      if (target) {
        positionOverTarget(container, target);
      }
    };

    // Align on initial render (multiple attempts as DOM settles)
    align();
    const t1 = setTimeout(align, 50);
    const t2 = setTimeout(align, 200);
    const t3 = setTimeout(align, 500);

    // Re-align on scroll/resize so it stays visually in place
    const onScrollOrResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(align);
    };
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      // Just hide via CSS — NEVER move in DOM
      hideContainer(container);
    };
  }, [isHomePage, pathname]);

  return (
    <SpotifyContext.Provider value={{ spotifyUnlocked: unlocked, iframeRef, isMobile, manualUnlock }}>
      {children}
    </SpotifyContext.Provider>
  );
}

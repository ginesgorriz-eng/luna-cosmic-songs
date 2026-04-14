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

// Persistent container ID — lives in document.body, outside React's control
const CONTAINER_ID = "spotify-persistent-container";

function getOrCreateContainer(): HTMLDivElement {
  let el = document.getElementById(CONTAINER_ID) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = CONTAINER_ID;
    // Start hidden off-screen
    Object.assign(el.style, {
      position: "fixed", left: "-9999px", top: "-9999px",
      width: "1px", height: "1px", overflow: "hidden",
      pointerEvents: "none", zIndex: "-1",
    });
    document.body.appendChild(el);
  }
  return el;
}

function hideContainer(el: HTMLDivElement) {
  Object.assign(el.style, {
    position: "fixed", left: "-9999px", top: "-9999px",
    width: "1px", height: "1px", overflow: "hidden",
    pointerEvents: "none", zIndex: "-1",
  });
}

function showContainerInTarget(container: HTMLDivElement, target: HTMLElement) {
  // Place container inside the portal target so it flows naturally
  Object.assign(container.style, {
    position: "static", left: "auto", top: "auto",
    width: "100%", height: "auto", overflow: "visible",
    pointerEvents: "auto", zIndex: "auto",
  });
  if (container.parentElement !== target) {
    target.appendChild(container);
  }
}

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleUnlock = useCallback(() => {
    if (!unlocked) setUnlocked(true);
  }, [unlocked]);

  // Create the iframe once in the persistent container (outside React)
  useEffect(() => {
    const container = getOrCreateContainer();
    // Only create iframe if it doesn't exist yet
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
      iframe.loading = "lazy";
      container.appendChild(iframe);
      // Store ref
      (iframeRef as React.MutableRefObject<HTMLIFrameElement>).current = iframe;
    } else {
      (iframeRef as React.MutableRefObject<HTMLIFrameElement>).current =
        container.querySelector("iframe") as HTMLIFrameElement;
    }
  }, []);

  // Listen for Spotify interaction
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

  // On home: move container into #spotify-portal-target (visible, interactive)
  // On other pages: move it back to body hidden (keeps audio alive)
  // CRITICAL: cleanup moves it back BEFORE React destroys the portal target
  useEffect(() => {
    const container = getOrCreateContainer();

    if (!isHomePage) {
      hideContainer(container);
      // Move back to body if currently inside a page element
      if (container.parentElement !== document.body) {
        document.body.appendChild(container);
      }
      return;
    }

    // On home, wait for portal target to appear then move container there
    let cancelled = false;
    const tryMove = () => {
      if (cancelled) return;
      const target = document.getElementById("spotify-portal-target");
      if (target) {
        showContainerInTarget(container, target);
      }
    };
    // Try multiple times as the DOM renders
    tryMove();
    const t1 = setTimeout(tryMove, 50);
    const t2 = setTimeout(tryMove, 150);
    const t3 = setTimeout(tryMove, 400);

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      // CRITICAL: move container back to body BEFORE React unmounts the page
      // (which would destroy the portal target and take our container with it)
      hideContainer(container);
      document.body.appendChild(container);
    };
  }, [isHomePage, pathname]);

  return (
    <SpotifyContext.Provider value={{ spotifyUnlocked: unlocked, iframeRef }}>
      {children}
    </SpotifyContext.Provider>
  );
}

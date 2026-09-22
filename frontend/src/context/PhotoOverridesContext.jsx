import { createContext, useContext, useEffect, useState } from "react";

const PhotoOverridesContext = createContext(null);

export function PhotoOverridesProvider({ children }) {
  const [overrides, setOverrides] = useState({});

  useEffect(() => {
    let cancelled = false;

    fetch("/api/photos")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data?.overrides) setOverrides(data.overrides);
      })
      .catch(() => {
        // Fails open: overrides just stays {}, every photo slot keeps
        // showing its shipped default — never a broken/blank image.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <PhotoOverridesContext.Provider value={{ overrides }}>{children}</PhotoOverridesContext.Provider>;
}

export function usePhotoOverrides() {
  const ctx = useContext(PhotoOverridesContext);
  if (!ctx) throw new Error("usePhotoOverrides must be used within PhotoOverridesProvider");
  return ctx;
}

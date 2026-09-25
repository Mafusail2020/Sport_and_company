import { createContext, useContext, useEffect, useState } from "react";

const PartnerLogosContext = createContext(null);

export function PartnerLogosProvider({ children }) {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/partners")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data && Array.isArray(data.logos)) setLogos(data.logos);
      })
      .catch(() => {
        // Fails open: stays [], every slot shows the "лого" placeholder —
        // same as "no real partner logos uploaded yet."
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <PartnerLogosContext.Provider value={{ logos }}>{children}</PartnerLogosContext.Provider>;
}

export function usePartnerLogos() {
  const ctx = useContext(PartnerLogosContext);
  if (!ctx) throw new Error("usePartnerLogos must be used within PartnerLogosProvider");
  return ctx;
}

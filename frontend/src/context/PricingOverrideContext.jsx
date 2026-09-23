import { createContext, useContext, useEffect, useState } from "react";

const PricingOverrideContext = createContext(null);

export function PricingOverrideProvider({ children }) {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/pricing")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data && Array.isArray(data.packages)) setPackages(data.packages);
      })
      .catch(() => {
        // Fails open: stays [], same as "no packages configured yet" —
        // Pricing unmounts, Header hides the "Послуги" nav link.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <PricingOverrideContext.Provider value={{ packages }}>{children}</PricingOverrideContext.Provider>;
}

export function usePricingOverride() {
  const ctx = useContext(PricingOverrideContext);
  if (!ctx) throw new Error("usePricingOverride must be used within PricingOverrideProvider");
  return ctx;
}

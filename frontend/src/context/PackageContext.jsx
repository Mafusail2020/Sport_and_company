import { createContext, useContext, useState } from "react";

const PackageContext = createContext(null);

export function PackageProvider({ children }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  return (
    <PackageContext.Provider value={{ selectedPackage, setSelectedPackage }}>
      {children}
    </PackageContext.Provider>
  );
}

export function usePackageSelection() {
  const ctx = useContext(PackageContext);
  if (!ctx) throw new Error("usePackageSelection must be used within PackageProvider");
  return ctx;
}

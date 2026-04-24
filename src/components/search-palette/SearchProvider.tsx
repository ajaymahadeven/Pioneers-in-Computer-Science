"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { SearchPalette } from "@/components/search-palette/SearchPalette";

const SearchContext = createContext<{ open: () => void }>({
  open: () => void 0,
});

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SearchContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <SearchPalette open={isOpen} onClose={() => setIsOpen(false)} />
    </SearchContext.Provider>
  );
}

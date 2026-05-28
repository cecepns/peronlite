import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const STORAGE_KEY = "peronline-sidebar-expanded";

const SidebarLayoutContext = createContext(null);

function readStoredExpanded() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "0";
  } catch {
    return true;
  }
}

export function SidebarLayoutProvider({ children }) {
  const { user } = useAuth();
  const hasSidebar = Boolean(user && user.role !== "buyer");
  const [expanded, setExpanded] = useState(readStoredExpanded);

  const toggle = useCallback(() => setExpanded((v) => !v), []);

  useEffect(() => {
    if (!hasSidebar) return;
    try {
      localStorage.setItem(STORAGE_KEY, expanded ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [expanded, hasSidebar]);

  const value = useMemo(
    () => ({
      hasSidebar,
      expanded,
      toggle,
      asideClass: expanded ? "lg:w-56" : "lg:w-[4.5rem]",
      mainMarginClass: expanded ? "lg:ml-56" : "lg:ml-[4.5rem]"
    }),
    [hasSidebar, expanded, toggle]
  );

  return <SidebarLayoutContext.Provider value={value}>{children}</SidebarLayoutContext.Provider>;
}

export function useSidebarLayout() {
  const ctx = useContext(SidebarLayoutContext);
  if (!ctx) {
    throw new Error("useSidebarLayout must be used within SidebarLayoutProvider");
  }
  return ctx;
}

import { createContext, useContext, useState, ReactNode } from "react";

type PanelTab = "layers" | "styles" | "traits";

interface PanelContextType {
  activeTab: PanelTab;
  setActiveTab: (tab: PanelTab) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<PanelTab>("layers");

  return (
    <PanelContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </PanelContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePanel() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("usePanel must be used within PanelProvider");
  }
  return context;
}


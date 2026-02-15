import { createContext, useContext, useState, type ReactNode } from "react";

interface KeyboardContextValue {
  keyPressed: string | null;
  pressKey: (key: string) => void;
  resetKey: () => void;
}

const KeyboardContext = createContext<KeyboardContextValue | null>(null);

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [keyPressed, setKeyPressed] = useState<string | null>(null);

  const pressKey = (key: string) => setKeyPressed(key);
  const resetKey = () => setKeyPressed(null);

  return (
    <KeyboardContext.Provider value={{ keyPressed, pressKey, resetKey }}>
      {children}
    </KeyboardContext.Provider>
  );
}

export const useKeyboard = (): KeyboardContextValue => {
  const ctx = useContext(KeyboardContext);
  if (!ctx) throw new Error("useKeyboard must be used within KeyboardProvider");
  return ctx;
};

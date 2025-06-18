import { createContext, useContext, useState } from "react";

const KeyboardContext = createContext();

export const KeyboardProvider = ({ children }) => {
  const [keyPressed, setKeyPressed] = useState(null);

  const pressKey = (key) => {
    setKeyPressed(key);
  };

  const resetKey = () => {
    setKeyPressed(null);
  };

  return (
    <KeyboardContext.Provider value={{ keyPressed, pressKey, resetKey }}>
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => useContext(KeyboardContext);

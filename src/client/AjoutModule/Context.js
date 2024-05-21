// Context.js
import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export function GlobalProvider({ children }) {
  const [anneeUniver, setAnneeUniver] = useState("");

  // Le reste de votre logique

  return (
    <GlobalContext.Provider value={{ anneeUniver, setAnneeUniver }}>
      {children}
    </GlobalContext.Provider>
  );
}
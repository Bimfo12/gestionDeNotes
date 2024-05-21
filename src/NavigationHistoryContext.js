import { createContext, useContext } from 'react';
import app, { firestore } from './firebase'; // Assurez-vous d'importer firestore correctement
// import { getFirestore, collection, query, orderBy, onSnapshot } from "./firebase/firestore";

export const NavigationHistoryContext = createContext();

// const db = getFirestore(app);
// collection(db, 'navigationHistory');


export const NavigationHistoryProvider = ({ children }) => {
  const updateNavigationHistory = (path) => {
    const navigationRef = firestore.collection('navigationHistory'); // Utilisation correcte de firestore
    navigationRef.add({
      path: path,
      timestamp: app.firestore.FieldValue.serverTimestamp(), // Utilisation de app.firestore
    });
  };

  return (
    <NavigationHistoryContext.Provider value={{ updateNavigationHistory }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};

export const useNavigationHistory = () => useContext(NavigationHistoryContext);

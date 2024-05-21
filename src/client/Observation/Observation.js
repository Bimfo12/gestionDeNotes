import { useEffect, useState } from 'react';
import { firestore } from '../../firebase';

firestore.collection('navigationHistory')

const Observation = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore.collection('navigationHistory')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const historyData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(historyData);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* Affichez ici l'historique de navigation */}
      {history.map(entry => (
        <div key={entry.id}>{entry.path} - {new Date(entry.timestamp.seconds * 1000).toLocaleString()}</div>
      ))}
    </div>
  );
};

export default Observation;
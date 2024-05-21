import React, { useState, useEffect } from 'react';

const Historique = () => {
  const [transactions, setTransactions] = useState([]);
  const address = '0xe0a2106a1589a131B85226511C870B6A6F541c68';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Remplacez 'YOUR_API_KEY' par votre clé API Etherscan
        const apiKey = '9V2YWK271G29S13EIETXMGGU3ZSU2I1W1V';
        const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${'9V2YWK271G29S13EIETXMGGU3ZSU2I1W1V'}`);

        const data = await response.json();
        if (data.status === '1') {
          setTransactions(data.result);
        } else {
          console.error('Erreur lors de la récupération des transactions :', data.message);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions :', error);
      }
    };

    fetchTransactions();
  }, [address]);

  return (
    <div>
      <h2>Historique des transactions pour l'adresse {address}</h2>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.hash}>
            <p>Hash: {transaction.hash}</p>
            <p>From: {transaction.from}</p>
            <p>To: {transaction.to}</p>
            <p>Value: {transaction.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Historique;

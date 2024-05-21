import React, { useState } from "react";
import { ethers } from "ethers";
import InscriptionEtConnexion from '../../artifacts/contracts/GestionDeNotes.sol/GestionDeNotes.json';
import './inscription.css';
import { Link,useNavigate } from "react-router-dom";

// const InscriptionAddress ='0x5FbDB2315678afecb367f032d93F642f64180aa3';
const InscriptionAddress = '0xebc951Ecc30670488C2525a12108cb01B853b3F3';

function Inscription() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 // const [isProfessor, setIsProfessor] = useState(false);
  const [identifier, setIdentifier] = useState(""); // Champ pour l'identifiant
  const [requireError, setRequireError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  
  async function requestAccount() {
    await window.ethereum.request({method: 'eth_requestAccounts'});
  }

  const handleRegister = async () => {
    if(typeof window.ethereum !== 'undefined'){
      setLoading(true);
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);

      const passwordha = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password));
      
    try {
      const tx = await contract.sInscrire(
        ethers.utils.formatBytes32String(username),
        ethers.utils.formatBytes32String(email),  
        passwordha,
        ethers.utils.formatBytes32String(identifier), // Utiliser l'identifiant
       );
      await tx.wait();
      alert("Inscription réussie!");
      navigate("/");  
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("MetaMask")) {
        // Gérer les erreurs de MetaMask ici
        console.error("Erreur MetaMask:", error);
      } else if (error && error.data && error.data.message) {
        const reason = error.data.message.replace(
          "Error: VM Exception while processing transaction: reverted with reason string ",
          ""
        );
        setRequireError(reason);
      } else {
        setError('Erreur inattendue.');
      }
    }
  } else {
    console.log("Formatez l'extension MetaMask");
  }
  };

  return (
    <div id="cont">
      <div className="form">
      <h2>Inscription</h2>
      {requireError && <p style={{ color: 'red' }}>{requireError}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="log">
      {/* Champ pour l'identifiant */}
     
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
       <input
        type="text" 
        placeholder="Identifiant"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
     
      <button type="submit" onClick={handleRegister} disabled={loading}>
      {loading ? 'En cours...' : "S'inscrire"}
      </button>
      </div>
      <p>Si Vous avez déjà un compte</p>
        <nav className="inscri">
          <Link to="/" className="link">Connexion</Link>
        </nav>
        </div>
    </div>
  );
}

export default Inscription;

import React, { useState, useEffect  } from "react";
import { ethers } from "ethers";
//import jwt from "jsonwebtoken";
import './Connexion.css';
import InscriptionEtConnexion from '../../artifacts/contracts/GestionDeNotes.sol/GestionDeNotes.json';
import { Link, useNavigate } from 'react-router-dom';


// const InscriptionAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const InscriptionAddress = '0xebc951Ecc30670488C2525a12108cb01B853b3F3';

function Connexion({ setLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [personalInfo, setPersonalInfo] = useState(null); // Informations personnelles
  const [requireError, setRequireError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function requestAccount() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (err) { 
      console.log('erreur lor de la changement de compte methamasque:', err);
    }
  }


  async function getPersonalInfo() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.enable();
  
        const provider = new ethers.providers.Web3Provider(window.ethereum);
       // const accounts = await provider.listAccounts();
      //  const userAddress = accounts.length > 0 ? accounts[0] : null; // Define userAddress
  
       // console.log("User Address:", userAddress);
  
        const signer = provider.getSigner();
        const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);
  
        const info = await contract.getPersonalInfo();
       
  
        const age = ethers.utils.parseBytes32String(info[2]); 
  
        setPersonalInfo({
          name: ethers.utils.parseBytes32String(info[0]),
          firstName: ethers.utils.parseBytes32String(info[1]),
          age: age.toString(),
          ville: ethers.utils.parseBytes32String(info[3]),
          sexe: ethers.utils.parseBytes32String(info[4]),
          niveau: ethers.utils.parseBytes32String(info[5]),
          mention: ethers.utils.parseBytes32String(info[6]),
        });
  
      }
    } catch (err) { 
      console.log('erreur lor de la changement de compte methamasque:', err);
    }
  }



  async function seConnecter() {
    try {
      setLoading(true);
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);
      const passwordBytes32 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password));
      const emailBytes32 = ethers.utils.formatBytes32String(email);

   
      await contract.seConnecter(emailBytes32, passwordBytes32);

       // Obtenez le token d'authentification depuis le contrat
     // const userAddress = await signer.getAddress();
      const authToken = await contract.getAuthToken(); // Appel de la nouvelle fonction

      localStorage.setItem("authToken", authToken);

      const storedToken = localStorage.getItem("authToken");

      setLoggedIn(true);

      if (storedToken) {
        if (personalInfo) {
        // Rediriger vers la page de profil
          navigate("/Profile");
        }else{
          navigate("/InfoPersonnelles");
        }   
       
    } else {
      console.log('la token ne peux pas etre créer',authToken)
    }

    }catch (error) {
      if (error instanceof Error) {
      // Vérifiez d'abord s'il s'agit d'un type d'erreur typique.
      if (error.message && error.message.includes("MetaMask")) {
      // Ici, vous pouvez gérer des scénarios d'erreur connus de MetaMask.
      setError(error.message);
      } else if (error.data && error.data.message) {
      // Ici, vous gérez les erreurs de contrat. Nous attendons un objet data avec un message.
      const reason = error.data.message.replace("Error: VM Exception while processing transaction: reverted with reason string ",
      ""
      );
      setRequireError( " karaha ty izy",reason);
      } else {
      // Un piège à tout pour d'autres types d'erreurs.
      setError("Vérifiez votre compte Ethereum, s'il vous plaît");
      }
      } else {
      // Si l'erreur attrapée n'est pas une instance de Error, vous la gérez en conséquence.
      setError('Erreur inattendue.');
      }
              
    }
  }


  useEffect(() => {
    getPersonalInfo()
  },[personalInfo],[])

  return (
    <div id="contai">
      <div className="form">
        <h1>Connexion</h1>
        {requireError && <p style={{ color: 'red' }}>{requireError}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="login">
          <input type="text" placeholder="Email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
          <input type="password" placeholder="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
          <button type="button" onClick={seConnecter} disabled={loading}>
          {loading ? 'En cours...' : 'Se Connecter'}
          </button>
        </div>
        <p>Veuillez vous inscrire si vous n'avez pas encore un compte.</p>
        <nav className="inscri">
          <Link to="/Inscription" className="link">Inscription</Link>
        </nav>
      </div>
    </div>
  );
}

export default Connexion;

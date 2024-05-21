/** @jsxImportSource theme-ui */

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import InscriptionEtConnexion from '../../artifacts/contracts/GestionDeNotes.sol/GestionDeNotes.json';
import { useNavigate } from "react-router-dom";
import './InfoPersonnelles.css';
import Navbar from "../NavBar/Navbar";
// const InscriptionAddress ='0x5FbDB2315678afecb367f032d93F642f64180aa3';
const InscriptionAddress = '0xebc951Ecc30670488C2525a12108cb01B853b3F3';

function InfoPersonnelles() {
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [ville, setVille] = useState("");
  const [sexe, setSexe] = useState("");
  const [niveau, setNiveau] = useState(""); // Ajout du state pour le niveau
  const [mention, setMention] = useState(""); // Ajout du state pour le niveau
  const [userStatus, setUserStatus] = useState('');
  const [showButton, setShowButton] = useState(false);


  const navigate = useNavigate();

    const execution = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);
    const isProfessor = await contract.estProfesseur(signer.getAddress());

    setUserStatus(isProfessor ? 'Professeur' : 'Étudiant'); 
      setShowButton(isProfessor);
  }
   // console.log(isProfessor);
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

 

  const handleRegister = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);

      

      try {
        let tx;
        

        if (showButton) {
          // Si l'utilisateur est un professeur, ne pas remplir le champ niveau
          tx = await contract.setPersonalInfo(
            ethers.utils.formatBytes32String(name),
            ethers.utils.formatBytes32String(firstName),
            ethers.utils.formatBytes32String(age),
            ethers.utils.formatBytes32String(ville),
            ethers.utils.formatBytes32String(sexe),
            ethers.utils.formatBytes32String(''),
            ethers.utils.formatBytes32String('')
          );
        } else {
          // Si l'utilisateur n'est pas un professeur, remplir le champ niveau
          tx = await contract.setPersonalInfo(
            ethers.utils.formatBytes32String(name),
            ethers.utils.formatBytes32String(firstName),
            ethers.utils.formatBytes32String(age),
            ethers.utils.formatBytes32String(ville),
            ethers.utils.formatBytes32String(sexe),
            ethers.utils.formatBytes32String(niveau),
            ethers.utils.formatBytes32String(mention)

          );
        }

        await tx.wait();

        console.log(tx);

        alert("Information enregistrée");
        navigate("/Profile"); // Redirection vers la page d'accueil
      } catch (error) {
        console.error("Erreur lors de l'enregistrement des informations:", error);
      }
    }
  };
     

  useEffect(() => {
    async function fetchData() {
      await execution();
    }
    fetchData();
  }, []);
  return (
    <div >
       <Navbar/>
      
       <div id="contain">
       <div className="forme" sx={{bg:'navcolors', color:'lokonysoratra'}}>
      <h1 sx={{color:'text'}}>Information personnelles</h1>
      <div className="logine">
      
      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Prénom"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        type="text"
        placeholder="Adresse"
        value={ville}
        onChange={(e) => setVille(e.target.value)}
      />
      
    <select className="inf" value={sexe} onChange={(e) => setSexe(e.target.value)}>
        <option value="">Choisissez le sexe</option>
        <option value="homme">Homme</option>
        <option value="femme">Femme</option>
      </select>

      <br/>
      {showButton ? null : (
            // L'utilisateur n'est pas un professeur, afficher le champ niveau avec des options
            <select className="inf" value={niveau} onChange={(e) => setNiveau(e.target.value)}>
              <option value="">Choisissez votre Niveau</option>
              <option value="1 ère année">1 ère année</option>
              <option value="2 ème année">2 ème année</option>
              <option value="3 ème année">3 ème année</option>
              <option value="4 ème année">4 ème année</option>
              <option value="5 ème année">5 ème année</option>
            </select>
          )}

<br/>
      {showButton ? null : (
            // L'utilisateur n'est pas un professeur, afficher le champ niveau avec des options
            <select className="inf" value={mention} onChange={(e) => setMention(e.target.value)}>
            <option value="">Choisissez votre Mention</option>
            <option value="TCI">TCI</option>
            <option value="STIC">STIC</option>
            <option value="GE">GE</option>
            <option value="GM">GM</option>
            <option value="GC">GC</option>
          </select>
          )}
      <button type="submit" onClick={handleRegister}>Enregistré</button>
      </div>   
       </div>
    </div>
    </div>
  );
}

export default InfoPersonnelles;
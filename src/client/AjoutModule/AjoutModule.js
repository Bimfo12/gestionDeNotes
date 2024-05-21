/** @jsxImportSource theme-ui */

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from 'react-router-dom';
import InscriptionEtConnexion from '../../artifacts/contracts/GestionDeNotes.sol/GestionDeNotes.json';
import Navbar from "../NavBar/Navbar";
import './AjoutModule.css';

// const InscriptionAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const InscriptionAddress = '0xebc951Ecc30670488C2525a12108cb01B853b3F3';

function AjoutProfesseur() {
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedMention, setSelectedMention] = useState("");
  const [matiere, setMatiere] = useState("");
  const [anneeUniv, setAnneeUniv] = useState("");
  const [selectedProfesseur, setSelectedProfesseur] = useState(""); // Utilisé pour stocker l'ID du professeur sélectionné
  const [professeurs, setProfesseurs] = useState([]); // Stocke les noms et prénoms des professeurs
  const [allProfesseurs, setAllProfesseurs] = useState([]); // Stocke les noms et prénoms des professeurs

  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const niveauxOptions = [
    "1 ère année",
    "2 ème année",
    "3 ème année",
    "4 ème année",
    "5 ème année",
  ];

  const mentionsOptions = ["TCI", "STIC", "GET", "GE", "GM", "GC"];

  const handleNiveauChange = (event) => {
    setSelectedNiveau(event.target.value);
  };

  const handleMentionChange = (event) => {
    setSelectedMention(event.target.value);
  };

  const handleMatiereChange = (event) => {
    setMatiere(event.target.value);
  };

  const handleProfesseurChange = (event) => {
    setSelectedProfesseur(event.target.value); // Met à jour l'ID du professeur sélectionné
    console.log(selectedProfesseur);
  };

  const ajouterProfesseur = async () => {
    if (!selectedProfesseur || !selectedNiveau || !selectedMention || !matiere) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    
    // Convertir l'ID du professeur sélectionné en nombre
    const selectedProfesseurId = parseInt(selectedProfesseur);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);

      // Utiliser l'ID du professeur sélectionné pour obtenir le nom et le prénom
      const selectedProfesseurInfo = allProfesseurs[selectedProfesseurId];

      // Vérifier si l'ID du professeur est valide
      if (!selectedProfesseurInfo) {
        alert('Veuillez sélectionner un professeur valide.');
        return;
      }

      await contract.ajouterProfesseur(
        selectedProfesseurInfo.name,
        selectedProfesseurInfo.firstName,
        selectedNiveau,
        selectedMention,
        matiere,
        anneeUniv
      );

      // Réinitialiser les champs après l'ajout
      // setSelectedNiveau("");
      // setSelectedMention("");
      setMatiere("");
      // setSelectedProfesseur("");
    } catch (error) { 
      console.error('Erreur lors de l\'ajout du professeur:', error);
      alert('Une erreur s\'est produite lors de l\'ajout du professeur.');
    }
  };

/**************************************************************** */
async function getProfesseurs() {
     try {
       if (typeof window.ethereum !== 'undefined') {
         await window.ethereum.enable();
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();
         const contract = new ethers.Contract(InscriptionAddress,InscriptionEtConnexion.abi,signer);
         // Récupérez le nombre total de professeurs
         const profCount = await contract.profeCount();
         const professeursDetails = [];
         for (let i = 1; i <= profCount; i++) {
           const professeur = await contract.obtenirProfesseur(i);
           professeursDetails.push({
             nom: professeur[0],
             prenom: professeur[1],
             niveaux: professeur[2],
             mentions: professeur[3],
             matieres: professeur[4],
             anneeUnive : professeur[5],
           });
         }
         setProfesseurs(professeursDetails);
    
       }
     } catch (error) {
       console.error('Erreur lors de la récupération des professeurs :', error);
     }
   }
  


/*************************************************************** */



  useEffect(() => {

    if (!authToken) { 
      navigate("/");
    } else {
      navigate("/AjoutModule");
    }
    
    async function fetchData() {
      try {
        if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.enable();
    
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);
    
          // Appel au contrat pour obtenir les noms et prénoms des professeurs
          const [allNoms, allFirstNames] = await contract.getAllProfesseursNames();
    
          // Convertir les noms et prénoms de bytes32 en chaînes et stocker dans le state
          const names = allNoms.map(name => ethers.utils.parseBytes32String(name));
          const firstNames = allFirstNames.map(firstName => ethers.utils.parseBytes32String(firstName));
          const professeursDetails = names.map((name, index) => ({
            id: index,
            name,
            firstName: firstNames[index],
          }));
    
          setAllProfesseurs(professeursDetails);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des professeurs :', error);
      }
    }

    fetchData();
    getProfesseurs()

   
  }, []);

  return (
    <div>
      <div className="bar"> 
        <Navbar />
      </div>
      <div className="contenaireaj" >
        <h1>Ajouter un Professeur</h1>
        <div className="persone">
          {/* <div>{personalInfo ? personalInfo.name : 'N/A'} {personalInfo ? personalInfo.firstName : 'N/A'}</div> */}
        </div>
        <br/> 
     
      <div className="for" sx={{bg:'navcolors', color:'lokonysoratra'}}>
         <div > 
          <label sx={{color:'text'}}>Enseignant</label> <br/>
          <select value={selectedProfesseur} onChange={handleProfesseurChange}>
            <option value="">Sélectionnez un professeur</option>
            {allProfesseurs.map((professeur) => (
              <option key={professeur.id} value={professeur.id}>
                {professeur.name} {professeur.firstName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label sx={{color:'text'}}>Niveau:</label> <br/>
          <select value={selectedNiveau} onChange={handleNiveauChange}>
            <option value="">Choisissez un Niveau</option>
            {niveauxOptions.map((niveau) => (                                                         
              <option key={niveau} value={niveau}>
                {niveau}
              </option>
            ))}
          </select>
        </div>

        <br/>

        <div>
          <label sx={{color:'text'}}>Mention:</label> <br/>
          <select value={selectedMention} onChange={handleMentionChange}>
            <option value="">Choisissez une Mention</option>
            {mentionsOptions.map((mention) => (
              <option key={mention} value={mention}>
                {mention}
              </option>
            ))}
          </select>
        </div>
      
        <br/>
        <div>
          <label sx={{color:'text'}}>Matière:</label> <br/>
          <input className="matière" type="text" value={matiere} onChange={(event) => setMatiere(event.target.value)} />
        </div>
        <br/>
        <div>
          <label sx={{color:'text'}}>Année Universitaire:</label> <br/>
          <input className="matière" type="text" value={anneeUniv} onChange={(event) => setAnneeUniv(event.target.value)} />
        </div>
     
        <br/>
        <button onClick={ajouterProfesseur} className="button2">Ajouter</button>
      </div>
        {/* <div>
          <table className="tabl">
            <thead>
              <tr>   
                <th>Nom et Prenom</th>
                <th>niveau</th>
                <th>mention</th>
                <th>Matière</th>
                <th>Anneé Universitaire</th>
              </tr>
            </thead>
            <tbody>
              {professeurs.map((professeur, index) => (
                <tr key={index}>
                  <td>{professeur.nom} {professeur.prenom}</td>
                  <td>{professeur.niveaux}</td>
                  <td>{professeur.mentions}</td>
                  <td>{professeur.matieres}</td>
                  <td>{professeur.anneeUnive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </div>
  );
}

export default AjoutProfesseur;

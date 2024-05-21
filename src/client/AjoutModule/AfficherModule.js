/** @jsxImportSource theme-ui */

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from 'react-router-dom';
import InscriptionEtConnexion from '../../artifacts/contracts/GestionDeNotes.sol/GestionDeNotes.json';
import Navbar from "../NavBar/Navbar";
import './AjoutModule.css';
import { useGlobalContext  } from './Context'

import { useColorMode } from "theme-ui";

// const InscriptionAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const InscriptionAddress = '0xebc951Ecc30670488C2525a12108cb01B853b3F3';

function AjoutProfesseur() {

  const [professeurs, setProfesseurs] = useState([]); // Stocke les noms et prénoms des professeurs
  const [personalInfo, setPersonalInfo] = useState([]);
  const { setAnneeUniver } = useGlobalContext();
  const [anneeUniversit, setAnneeUniversit] = useState("");
  const [selectedMention, setSelectedMention] = useState("STIC");
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate(); 
  const [année, setAnnée] = useState("3 ème année"); // État initial vide 
  
  const [colorMode, setColorMode] = useColorMode(); 

  async function getPersonalInfo() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.enable();
  
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        const userAddress = accounts.length > 0 ? accounts[0] : null; // Define userAddress
  
        // console.log("User Address:", userAddress);
  
        const signer = provider.getSigner();
        const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);
  
        const info = await contract.getPersonalInfo();
        const isProfessor = await contract.estProfesseur(userAddress);
  
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
    
    } catch (error) {
      console.error('Error getting personal information from the contract:', error);
    }
  }

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

         setAnneeUniver(professeursDetails.length > 0 ? professeursDetails[0].anneeUnive : 'Inconnu');
        
    
       }
     } catch (error) {
       console.error('Erreur lors de la récupération des professeurs :', error);
     }
   }
   /*********************RECUPERER UN ANNEE POUR AFFICHER LE NOTE SELON L'ANNEE********************************* */
  // Fonction pour mettre à jour l'année
  const annéedetude = (annéeValue) => {
    setAnnée(annéeValue);
  };

  useEffect(() => {
   
    getProfesseurs();
    getPersonalInfo();

    if (!authToken) {
      navigate("/");
    } else {
      navigate("/AfficherModule");
    }
  }, []);



   function filterModule(professeurs, année, selectedMention, anneeUniversit) {
     return professeurs.filter(professeur => {
       const matchesYear = année ? professeur.niveaux === année : true; // match sur niveaux (année académique)
       const matchesMention = selectedMention ? professeur.mentions === selectedMention : true; // match sur la mention
       const matchesAnneeUniversit = anneeUniversit ? professeur.anneeUnive === anneeUniversit : true; // match sur l'année universitaire
       // Retourne les notes qui correspondent à tous les filtres sélectionnés
       return matchesYear && matchesMention && matchesAnneeUniversit;
     });
   }



  return (
    <div>
      <div className="bar"> 
        <Navbar />
      </div>
      <div className="contenaireaj">      
      <br/><br/><br/><br/>
        <h2 sx={{ color:'lokonysoratra'}}>Affichage de Matière</h2><br/>

        <div>
            <button
              value="1 ère année"
              onClick={() => annéedetude("1 ère année")}
              className={`boutonnete ${année === "1 ère année" ? "active" : ""}`}
            >
              1 ère année
            </button>
            <button
              value="2 ème année"
              onClick={() => annéedetude("2 ème année")}
              className={`boutonnete ${année === "2 ème année" ? "active" : ""}`}
            >
              2 ème année
            </button>
            <button
              value="3 ème année"
              onClick={() => annéedetude("3 ème année")}
              className={`boutonnete ${année === "3 ème année" ? "active" : ""}`}
            >
              3 ème année
            </button>
            <button
              value="4 ème année"
              onClick={() => annéedetude("4 ème année")}
              className={`boutonnete ${année === "4 ème année" ? "active" : ""}`}
            >
              4 ème année
            </button>
            <button
              value="5 ème année"
              onClick={() => annéedetude("5 ème année")}
              className={`boutonnete ${année === "5 ème année" ? "active" : ""}`}
            >
              5 ème année
            </button>
      
       {/* <p>Année sélectionnée : {année}</p>    */}
    </div>


        <form>
      
      <select className="dropdown" value={anneeUniversit} onChange={e => setAnneeUniversit(e.target.value)} sx={{bg:'primary', color:'text'}}>
        <option value="">Sélectionnez l'année</option>
        {
         Array.from(new Set(professeurs.map(professeur => professeur.anneeUnive)))
          .map((anneeUnive, index) => (
           <option key={index} value={anneeUnive}>{anneeUnive}</option> 
         ))}
      </select>

       <select value={selectedMention} onChange={e => setSelectedMention(e.target.value)} sx={{bg:'primary', color:'text'}}>
        <option value="">Choisissez une Mention</option>
        <option value="TCI">TCI</option>
        <option value="STIC">STIC</option>
        <option value="GET">GET</option>
        <option value="GE">GE</option>
        <option value="GM">GM</option>
        <option value="GC">GC</option>
      </select> 
    </form>

    <br/>

            <table  sx={{ 
       bg: colorMode ? 'colorHover' : 'background', 
      color: colorMode ? 'text' : 'black',
      border: '1px solid white', borderColor: 'lokonysoratra', // ajustez la couleur de la bordure en fonction du mode sombre/clair
    }}>
              <thead sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>
                <tr sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>
                  <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Matière</th>
                  <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Niveau</th> 
                  <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Mention</th>
                  <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Anneé Universitaire</th>
                </tr>
              </thead> 
              <tbody sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>
                {filterModule(professeurs, année, selectedMention, anneeUniversit).map((professeur, index) => (
                  <tr key={index}>
                    <td sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>{professeur.matieres}</td> 
                    <td sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>{professeur.niveaux}</td>
                    <td sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>{professeur.mentions}</td>
                    <td sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>{professeur.anneeUnive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
      </div>
    </div>
  );
}

export default AjoutProfesseur;

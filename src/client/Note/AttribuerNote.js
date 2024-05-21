/** @jsxImportSource theme-ui */

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import InscriptionEtConnexion from '../../artifacts/contracts/GestionDeNotes.sol/GestionDeNotes.json';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import './AttribuerNote.css';
import { useGlobalContext  } from '../AjoutModule/Context'

// const InscriptionAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const InscriptionAddress = '0xebc951Ecc30670488C2525a12108cb01B853b3F3';

const AttribuerNote = () => {
  // const [personalInfos, setPersonalInfos] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [matiere, setMatiere] = useState("");
  const [userStatus, setUserStatus] = useState('');
  const [personalInfo, setPersonalInfo] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [profMatier, setProfMatier] = useState([]);
  const [noteValue, setNoteValue] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedMention, setSelectedMention] = useState("");
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(-1); // Index de l'étudiant dans la liste principale
  const [allStudents, setAllStudents] = useState([]);
  const selectedStudentInfo = allStudents[selectedStudentIndex];
  const [allAnneeUniversitaire, setAllAnneeUniversitaire] = useState([]);
 
  const { anneeUniver } = useGlobalContext();

  const comment = "";

  const authToken = localStorage.getItem("authToken");

  // const MatierProf = [];
  const navigate = useNavigate();

  // Utilisez la fonction fléchée pour gérer les changements d'état
  const handleMatiereChange = (event) => {
    setMatiere(event.target.value);
  };
  
  const handleNoteChange = (event) => {
    setNoteValue(Number(event.target.value));
  };

// Utilisez la fonction fléchée pour gérer les changements d'état
const handleStudentChange = (event) => {
  const selectedId = event.target.value;
  setSelectedStudent(selectedId); // Utilisez l'ID comme valeur sélectionnée
  setSelectedStudentIndex(selectedId);
};


  const handleAjouterNote = async () => {

    if (selectedStudentIndex === -1 || !noteValue || noteValue <= 0 || !matiere) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Récupérez l'ID de l'étudiant sélectionné en fonction de la valeur de selectedStudent
    const selectedStudentId = parseInt(selectedStudent);

    // Récupérez les informations de l'étudiant sélectionné
    const selectedStudentInfo = allStudents[selectedStudentId];

      if (!selectedStudent || selectedStudent < 0 || selectedStudent >= allStudents.length) {
    alert('Veuillez sélectionner un étudiant valide.');
    return;
  }

  const storedAnneeUniversitaire = localStorage.getItem("derniereAnneeUniversitaire");
 // console.log("ary ty keee",storedAnneeUniversitaire)
  
     try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);
  
      console.log("selectedNiveau:", selectedNiveau);
      console.log("selectedMention:", selectedMention);
      console.log("allStudents:", allStudents);
      console.log("selectedStudent:", selectedStudent);
      // Appelez la fonction du contrat pour ajouter la note avec la matière
      if (
        (!selectedNiveau || selectedStudentInfo.Niveau === selectedNiveau) &&
        (!selectedMention || selectedStudentInfo.Mention === selectedMention)
      ) {
        // L'étudiant correspond aux critères, alors attribuez la note
        await contract.ajouterNote(
          matiere,
          noteValue*100,  
          selectedStudentInfo.name,
          selectedStudentInfo.firstName,
          selectedNiveau,
          selectedMention,
          storedAnneeUniversitaire,
        );
  
        // Mettez à jour l'interface pour refléter que la note a été attribuée avec succès.
        alert('Note attribuée avec succès.');
  
        // Effacez la valeur de la note et de la matière après l'ajout
        setNoteValue("");
      } else {
        // L'étudiant ne correspond pas aux critères de filtre, affichez un message d'erreur
        alert('L\'étudiant ne correspond pas aux critères de filtre actuels.');
      }
    } catch (error) {
      console.error(error);
      alert('Une erreur s\'est produite lors de l\'attribution de la note.');
    }
  };

 
  
  const recupereProf = async () => {
    try {
        if (typeof window.ethereum !== 'undefined') {
            // Demander l'autorisation d'accéder au compte Ethereum de l'utilisateur
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);

            const userAddress = await signer.getAddress();

            // Obtenir le nombre de professeurs liés à l'adresse de l'utilisateur
            const professCount = await contract.profeCount();
            const datas = [];

            for (let i = 1; i <= professCount; i++) {
                // Obtenir les détails du professeur à partir du contrat
                const professors = await contract.obtenirProfesseur(i);
                datas.push({
                    nom: professors[0],
                    prenom: professors[1],
                    niveaux: professors[2],
                    mentions: professors[3],
                    matieres: professors[4],
                });
            }

            // Mettre à jour l'état (ou faire toute autre chose avec les données)
            setProfMatier(datas);
        } else {
            // Gérer le cas où MetaMask (ou un autre fournisseur Ethereum) n'est pas installé
            alert("MetaMask (ou un autre fournisseur Ethereum) n'est pas installé.");
        }
    } catch (error) {
        // Gérer les erreurs
        console.error(error);
        alert("Une erreur s'est produite lors de l'exécution.");
    }
};

  


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
  
        setUserStatus(isProfessor ? 'Professeur' : 'Étudiant');
        setShowButton(isProfessor);
  
        
      }
    } catch (error) {
      console.error('Error getting personal information from the contract:', error);
    }
  }
  


// Dans la fonction useEffect, au lieu de stocker les données directement dans personalInfos, stockez-les dans allStudents
useEffect(() => {
  async function fetchAllPersonalInfos() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);

      // Obtenez les noms et prénoms des utilisateurs enregistrés
      const [allNames, allFirstNames, allNiveau, allMention] = await contract.getAllPersonalInfo();

      // Convertissez les noms et prénoms de bytes32 en chaînes
      const names = allNames.map(name => ethers.utils.parseBytes32String(name));
      const firstNames = allFirstNames.map(firstName => ethers.utils.parseBytes32String(firstName));
      const niveau = allNiveau.map(Niveau => ethers.utils.parseBytes32String(Niveau));
      const mention = allMention.map(Mention => ethers.utils.parseBytes32String(Mention));

      // Créez une liste d'objets avec les noms et prénoms
      const allPersonalInfos = names.map((name, index) => ({
        id: index, // Utilisez l'index comme ID 
        name,
        firstName: firstNames[index],
        Niveau: niveau[index],
        Mention: mention[index],
      }));

      // Stockez toutes les données non filtrées dans allStudents
     // console.log('allPersonalInfos:', allPersonalInfos);
      setAllStudents(allPersonalInfos);

    } catch (error) {
      console.error('Error fetching personal info:', error);
    }
  } 
   // Récupérez l'année universitaire stockée lors du montage du composant et mettez à jour l'état
 
  //  if (storedAnneeUniversitaire !== "") {
  //    setAnneeUniversitaire(storedAnneeUniversitaire);
  //    console.log("hhhg beggerbf ",anneeUniversitaire)
  //  } else {
  //   getProfesseurs();
  //  }

  fetchAllPersonalInfos();
  recupereProf();
  getPersonalInfo();
  getProfesseurs();
 

 

  
  if (!authToken) {
    navigate("/");
}else{
  navigate("/AttribuerNote");
}

}, []);


function filterMatierProf() {
  const MatierProfOptions = []; // Créez un tableau vide pour stocker les options

  if (personalInfo && profMatier) {
    for (const professor of profMatier) {
      if (professor.nom === personalInfo.name) {
        // Vérifiez si le niveau et la mention correspondent aux filtres sélectionnés
        const niveauMatches = !selectedNiveau || professor.niveaux === selectedNiveau;
        const mentionMatches = !selectedMention || professor.mentions === selectedMention;

        // Si les conditions de niveau et de mention correspondent, ajoutez une option
        if (niveauMatches && mentionMatches) {
          MatierProfOptions.push(
            <option key={professor.matieres} value={professor.matieres}>
              {professor.matieres}
            </option>
          );
        }
      }
    }
  }

  // Retournez les options générées
  return MatierProfOptions;
}

async function getProfesseurs() {
  try {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        InscriptionAddress,
        InscriptionEtConnexion.abi,
        signer
      );

      // Récupérer le nombre total de professeurs
      const profCount = await contract.profeCount();

      // Vérifiez s'il y a au moins un professeur
      if (profCount.toNumber() > 0) {
        // Récupérer le dernier professeur ajouté en utilisant la valeur de profCount
        // pour obtenir l'id du dernier professeur
        const lastProfesseur = await contract.obtenirProfesseur(profCount.toNumber());
        // Supposons que lastProfesseur[5] est l'année universitaire du dernier professeur
        const derniereAnneeUniversitaire = lastProfesseur[5];
      //  console.log("arry aketo krkr",derniereAnneeUniversitaire)
        // Utilisez localStorage pour conserver la dernière année universitaire des professeurs
        localStorage.setItem("derniereAnneeUniversitaire", derniereAnneeUniversitaire);

        // Mettez à jour l'état avec la dernière année universitaire
        setAllAnneeUniversitaire(derniereAnneeUniversitaire);
       // console.log(allAnneeUniversitaire)
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du dernier professeur :', error);
  }
}



  return (
    <div>
      <div className="bar">
      <Navbar />
    </div>
      <div className="containt">
        <div className="forma" sx={{bg:'navcolors', color:'lokonysoratra'}}>
          <h1 sx={{color:'text'}}>Attribuer des notes aux étudiants</h1>
          <div className="lo"> 

          <div>
           <h2 sx={{color:'text'}}>Niveau</h2>
           <select value={selectedNiveau}  onChange={(event) => setSelectedNiveau(event.target.value)} >
             <option value="">Choisissez un Niveau</option>
             <option value="1 ère année">1 ère année</option>
             <option value="2 ème année">2 ème année</option>
             <option value="3 ème année">3 ème année</option>
             <option value="4 ème année">4 ème année</option>
             <option value="5 ème année">5 ème année</option>
           </select>
         </div>
         
         <div>
           <h2 sx={{color:'text'}}>Mention</h2>
           <select value={selectedMention} onChange={(event) => setSelectedMention(event.target.value)} >
             <option value="">Choisissez une Mention</option>
             <option value="TCI">TCI</option>
             <option value="STIC">STIC</option>
             <option value="GET">GET</option>
             <option value="GE">GE</option>
             <option value="GM">GM</option>
             <option value="GC">GC</option>
           </select>
         </div>

         {allStudents.length > 0 ? (
  <>
    <div>
      <h2 sx={{color:'text'}}>Sélectionnez un étudiant</h2>
      <select value={selectedStudent} onChange={handleStudentChange}>
  <option value="-1">Sélectionnez un étudiant</option>
  {allStudents
    .filter((info) => {
      const niveauMatches = !selectedNiveau || info.Niveau.includes(selectedNiveau);
      const mentionMatches = !selectedMention || info.Mention.includes(selectedMention);
      return niveauMatches && mentionMatches; 
    })
    .map((info) => (
      <option key={info.id} value={info.id}>
        {info.name} {info.firstName}
      </option>
    ))}
</select>

    </div>
    
     <div>
    <label sx={{color:'text'}}>Matière:</label> <br/>
    
    <select value={matiere} onChange={handleMatiereChange}>
  <option value="-1">Sélectionnez une Matière</option>
  {filterMatierProf()}
</select>


</div>  


    <div>
      <label sx={{color:'text'}}>Note:</label><br/>
      <input type="number" value={noteValue} onChange={handleNoteChange}  step="0.01" />
    </div>

    <div>
      <button onClick={handleAjouterNote}>
        Ajouter Note
      </button>

    </div>
    

  </>
) : (
  <p>Aucune information personnelle disponible.</p>
          )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default AttribuerNote;

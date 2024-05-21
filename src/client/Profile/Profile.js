/** @jsxImportSource theme-ui */

import React, { useState, useEffect, useRef  } from "react";
import { ethers } from "ethers";
import InscriptionEtConnexion from '../../artifacts/contracts/GestionDeNotes.sol/GestionDeNotes.json';
import './Profile.css';
import Navbar from '../NavBar/Navbar';
import imageData from '../../img/couverture1.jpg';
import load from '../../img/Loading5.gif';
import imageData1 from '../../img/couverture7.jpg';
import modifier from '../../img/modifier.png';
import { Link, useNavigate } from 'react-router-dom';
import loggedIn from '../login/Connexion';
import Modal from 'react-modal';
import { storage } from "../../firebase";
import { ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";


import { useColorMode } from "theme-ui";

// import Changetheme from "../Componente/Changetheme"



// const InscriptionAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
 const InscriptionAddress = '0xebc951Ecc30670488C2525a12108cb01B853b3F3';



function Profile() {
  const [volohany, setVolohany] = useState();
  const [personalInfo, setPersonalInfo] = useState({});
  const [userStatus, setUserStatus] = useState('');
  const [test, setTest] = useState(null);
  const [showButton, setShowButton] = useState(false);
 // const [like1, setLike] = useState(""); 
  const [anneeUniversit, setAnneeUniversit] = useState("");
  const [selectedMention, setSelectedMention] = useState("STIC");
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [selectedNote, setSelectedNote] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedNote, setUpdatedNote] = useState(''); // Note à mettre à jour
  const [notes, setNotes] = useState([]);
  const [Notese, setNotese] = useState([]); // Define the 'Notes' variable
  // const [ firstnamecommentaire, setFirstNameCommentaire] = useState("");
  // const [ namecommentaire, setNameCommentaire] = useState("");
  // const [loading, setLoading] = useState(false); // État local pour gérer le chargement du popup
  const [imageUpload, setImageUpload] = useState(null);
  // Au début de votre composant React, juste après la déclaration du composant
const [userProfile, setUserProfile] = useState({
  ipfsLink: "",
  nom: "",
  prenom: ""
});

const [année, setAnnée] = useState("3 ème année"); // État initial vide

const [colorMode, setColorMode] = useColorMode(); 

const fileInputRef = useRef();

  // let userNotes = [];

  useEffect(() => {

  

    /****************FUNCTION POUR RECUPERER L'INFO PERSONNEL************************* */

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
          setUserStatus(isProfessor ? 'Enseignant' : 'Étudiant');
          setShowButton(isProfessor);


          localStorage.setItem("first", personalInfo.firstName);
          localStorage.setItem("last", personalInfo.name);
          if (isProfessor) {
            // If the user is a professor, fetch the notes they've attributed.
            await fetchProfessorNotes(userAddress);
          } }
      } catch (error) {
        console.error('Error getting personal information from the contract:', error);
      }
    }
    

/**********************FUNCTION POUR RECUPERER TOUT LES NOTE DANS LE BACK END***************************** */
    async function fetchAllNotes() {
      try {
        if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.enable();
          if (!loggedIn) {
            navigate("/Connexion"); // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
          } else {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, provider);
            const totalNotes = await contract.noteCount();
            const notesData = [];
            for (let i = 1; i <= totalNotes; i++) {
              const note = await contract.obtenirNote(i);
              notesData.push({
                id: note[0].toNumber(),
                Matier: note[1],
                value: note[2].toNumber(),
                Nom: note[3],
                prenom: note[4],
                niveaux: note[5],
                mentions: note[6],
                AnneeUnivers: note[7],
                timestamp: note[8].toNumber(),
                addedBy: note[9],
              });}
            setNotes(notesData);
          }
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    }

    async function fetchUserProfile() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);
        const userProfileData = await contract.getUserProfile(userAddress);
        // Mise à jour de l'état avec les données récupérées
        setUserProfile({
          ipfsLink: userProfileData[0],
          nom: userProfileData[1],
          prenom: userProfileData[2],
        });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
      }
    }
        
    getPersonalInfo();
    
    fetchAllNotes();
    
     fetchUserProfile()
    // handleJaimeClick(noteId)

    if (!authToken) {
      navigate("/");
  }else{
    navigate("/Profile");
  }

if(personalInfo){
  setVolohany(personalInfo.niveau);
  // setFirstNameCommentaire(personalInfo.firstName);
  // setNameCommentaire(personalInfo.name);
}

  }, []);


 
  /*****************FUNCTION TIMESTAMP IL CONVERTIRE LE BITCODE EN DATE HEURE MUNITE***************************** */
  
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Convertir le timestamp en millisecondes
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('fr-FR', options); // Adapter le format à vos préférences
  }

  /***********************FUNCTION POUR RECUPERER TOUT LES LES NOTE QUE L'ENSEIGNANT AJOUTER************************ */

  async function fetchProfessorNotes() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);
        // Récupérer l'adresse du compte connecté avec MetaMask
        const accounts = await provider.listAccounts();
        const userAddress = accounts.length > 0 ? accounts[0] : null;
        setTest(userAddress);
        if (userAddress) {
          // Supposons que votre contrat a une méthode pour récupérer les IDs des notes de l'utilisateur
          const userNotesIds = await contract.getNoteIdsForUser(userAddress);
          const notesDetails = [];
          for (const noteId of userNotesIds) {
            const note = await contract.obtenirNote(noteId);
            notesDetails.push({
              id: note[0].toNumber(),
              Matier: note[1],
              value: note[2].toNumber(),
              Nom: note[3],
              prenom: note[4],
              niveaux: note[5],
              mentions: note[6],
              AnneeUnivers: note[7],
              timestamp: note[8].toNumber(),
              addedBy: note[9],
            });}
          setNotese(notesDetails)
          // Maintenant, notesDetails contient les détails des notes de l'utilisateur 
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notes du professeur :', error);
    }
  }
  

 /*********************RECUPERER UN ANNEE POUR AFFICHER LE NOTE SELON L'ANNEE********************************* */
  // Fonction pour mettre à jour l'année
  const annéedetude = (annéeValue) => {
    setAnnée(annéeValue);
  };
  
/***************************FILTRER LE NOTE POUR AFFICHER LES NOTE D'ETUDIENT SELECTIONER************************ */
//recuperation de note de l'etudiant

function filterNotesByUser() {
  const userNotes = [];
  if (personalInfo) { // Vérifiez si personalInfo est défini
    for (const note of notes) {
      if ((note.Nom === personalInfo.name) && (note.niveaux === année)) {
          userNotes.push(note);
      }
    }
  }
  return userNotes; 
}



function filterNoteens(Notese, année, selectedMention, anneeUniversit) {
  return Notese.filter(note => {
    const matchesYear = année ? note.niveaux === année : true; // match sur niveaux (année académique)
    const matchesMention = selectedMention ? note.mentions === selectedMention : true; // match sur la mention
    const matchesAnneeUniversit = anneeUniversit ? note.AnneeUnivers === anneeUniversit : true; // match sur l'année universitaire
    // Retourne les notes qui correspondent à tous les filtres sélectionnés
    return matchesYear && matchesMention && matchesAnneeUniversit;
  });
}

/*************************POP-UP MODALE DE MODIFICATION DE NOTE************************** */

const openUpdateModal = (noteId) => {
  const selectedNote = Notese.find((note) => note.id === noteId);
  if (selectedNote) {
    setSelectedNote(selectedNote);
    setUpdatedNote(selectedNote.value.toString()/100); // Pré-remplir la note
    setIsUpdateModalOpen(true);}};
const closeUpdateModal = () => {
  setIsUpdateModalOpen(false);
  setSelectedNote(null);
};


/***********************FUNCTION POUR METTRE A JOURS LES NOTES********************************* */


const mettreAJourNote = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.enable();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);
    console.log("aketo1");
    try {
      console.log('Avant appel à mettreAJourNote');
      const tx = await contract.mettreAJourNote(selectedNote.id, selectedNote.Matier, updatedNote*100, selectedNote.Nom, selectedNote.prenom, selectedNote.niveaux, selectedNote.mentions, selectedNote.AnneeUnivers);
      console.log('Après appel à mettreAJourNote, tx:', tx);
      await tx.wait();
     // console.log('Transaction confirmée');
      alert("Note mise à jour");
      // Reset fields
      setIsUpdateModalOpen(false);
      setSelectedNote(null);
    } catch (error) {
      console.error(error);
    }
  }
};

/************************************************** */

 // Fonction pour ouvrir la fenêtre de sélection de fichiers
 const handleImageClick = () => {
  fileInputRef.current.click();
};

// Gestionnaire pour l'événement onChange du champ de saisie de fichier
const handleFileChange = (event) => {
  // Assurez-vous qu'un fichier a été sélectionné
  if (event.target.files && event.target.files[0]) {
    const imageFile = event.target.files[0];
    console.log("sary zaign ",imageFile);
    localStorage.setItem("imageUpload", imageFile);
    setImageUpload(imageFile); // Mettez à jour l'état avec le nouveau fichier (cette ligne peut varier selon votre implémentation)
    uploadImage(imageFile);  // Appellez votre fonction d'upload ici
  }
};

async function uploadImage() {
 
   if (imageUpload == null) return;

  const imageref = ref(storage, `images/${imageUpload.name + v4()}`);
   console.log("verifier : ", imageref);
  try {
    await uploadBytes(imageref, imageUpload);

    // Récupérer le chemin de téléchargement de l'image
    const downloadURL = await getDownloadURL(imageref);
    // Vous stockez le chemin du fichier dans votre contrat intelligent
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Créer une instance du contrat avec le signer
    const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);
    
    const namecommentaire = localStorage.getItem("first");
    const firstnamecommentaire = localStorage.getItem("last");

    await contract.uploadImage(downloadURL, namecommentaire, firstnamecommentaire);

    // if (personalInfo) {
    //   setNameCommentaire(personalInfo.name);
    //   setFirstNameCommentaire(personalInfo.firstName);

     
    // }    
    console.log("la nom commentaire reussit : ", namecommentaire);
    console.log("la prenom commentaire reussit : ", firstnamecommentaire);
    console.log("la downloadURL reussit : ", downloadURL);
  } catch (error) {
    // console.error("Erreur lors du téléchargement de l'image :", error);
    // console.log("la nom commentaire echouer : ", namecommentaire);
    // console.log("la prenom commentaire echouer : ", firstnamecommentaire);
    
  }

}

// console.log(updatedNote);




  return (
    
    <div > 
      
      <Navbar/>
   
      {userStatus ? 
       <div className="contenaire">
       <img className="sary" src={imageData} alt="sary" /> 

      {/* <br/><br/><br/><br/><br/><br/> */}
      <img 
        className="saryprofile" 
        src={userProfile && userProfile.ipfsLink ? userProfile.ipfsLink : imageData1} 
        alt="sary" 
        onClick={handleImageClick}
      />
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Cachez le champ de saisie de fichier visuellement
      />

      {personalInfo ? (
        <div className='info'>
          <div className='peso'>
            <div className="tableau"   sx={{bg:'navcolors', color:'text'}}>
              <p>Nom :</p>
              <div className="affichagedata nom">{personalInfo.name}</div>
            </div>
            <div className="tableau"  sx={{bg:'navcolors', color:'text'}}>
                <p>Prénom :</p>
                <div className="affichagedata prenom">{personalInfo.firstName}</div>
              </div>
              {/* <div className="tableau">
                <p>Âge :</p>
                <div className="affichagedata">{personalInfo.age}</div>
              </div> */}
              <div className="tableau" sx={{bg:'navcolors', color:'text'}}>
                <p>Sexe :</p>
                <div className="affichagedata">{personalInfo.sexe}</div>
              </div>
              <div className="tableau" sx={{bg:'navcolors', color:'text'}}>
                <p>Adresse :</p>
                <div className="affichagedata adresse">{personalInfo.ville}</div>
              </div>

              {!showButton && (
              <div className="tableau" sx={{bg:'navcolors', color:'text'}}>
                <p>Niveau :</p>
                <div className="affichagedata">{personalInfo.niveau}</div>
              </div> 
            )}

                {!showButton && (
              <div className="tableau" sx={{bg:'navcolors', color:'text'}}>
                <p>Mention :</p>
                <div className="affichagedata">{personalInfo.mention}</div>
              </div>
            )}  

            <div className="tableau" sx={{bg:'navcolors', color:'text'}}>
              <p>Statut :</p>
              <div className="affichagedata statu">
                {userStatus ? <p>{userStatus}</p> : <p></p>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rampisageinfo">Chargement, si vous n'avez pas rempli les informations personnelles, veuillez les remplir</div>
      )}

      {/* Affichage des notes et du bouton */}
      <div className="notes">

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

        {!showButton && (
          <div>
            <h2 sx={{color: 'lokonysoratra'}}>Notes</h2><br/>
            <table sx={{ 
      // bg: colorMode ? 'primary' : 'background', 
      color: colorMode ? 'text' : 'black',
      border: '1px solid white', borderColor: 'lokonysoratra', // ajustez la couleur de la bordure en fonction du mode sombre/clair
    }}>
              <thead>
                <tr sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>
                  <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Matière</th>
                  <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Note</th>
                  <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Date</th>     
                  <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Année Universitaire</th> 
                </tr>
              </thead> 
              <tbody>
                {filterNotesByUser().map((note, index) => (
                  <tr sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}} key={index}>
                    <td sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>{note.Matier}</td>
                    <td sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>{note.value/100}</td>
                    <td sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>{formatTimestamp(note.timestamp)}</td>
                    <td sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>{note.AnneeUnivers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> 
        )}
      </div>

      {showButton && (

        <div>

        <form>
      
      <select className="dropdown" value={anneeUniversit} onChange={e => setAnneeUniversit(e.target.value)} sx={{bg:'primary', color:'text'}}>
        <option value="">Sélectionnez l'année</option>
        {
         Array.from(new Set(Notese.map(note => note.AnneeUnivers)))
          .map((anneeUnivers, index) => (
           <option key={index} value={anneeUnivers}>{anneeUnivers}</option> 
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
         <button   className="bouton" sx={{bg:'navcolors', color:'text'}}>
        <Link to="/AttribuerNote" className="ajoutNote">Attribuer des notes</Link>
        </button>  
         <button   className="bouton" sx={{bg:'navcolors', color:'text'}}>
        <Link to="/AfficherModule" className="ajoutNote">Afficher Matière</Link>
        </button>  
        {test === '0x291aFe0B980c56f72EcdBA728617c0588fBEC42c' && (
          <button className="bouton" sx={{bg:'navcolors', color:'text'}}>
            <Link to="/AjoutModule" className="ajoutNote">Ajouter Matière</Link>
          </button>
        )}
         
    <div>
      <h2 sx={{color: 'lokonysoratra'}}>Toutes les notes ajoutées :</h2>
      
    {notes.length > 0 ? (
      <table sx={{ 
        // bg: colorMode ? 'primary' : 'background', 
        color: colorMode ? 'lokonysoratra' : 'black',
        border: '1px solid white', borderColor: 'lokonysoratra' // ajustez la couleur de la bordure en fonction du mode sombre/clair
      }}>
        <thead sx={{border:'1px solid black'}}>
          <tr sx={{border:'1px solid black'}}>
            <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Modifié</th>
            <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Nom et Prenom</th>
            <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Niveau</th>
            <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Mention</th>
            <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Matière</th>
            <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Note</th>
            <th sx={{border: '1px solid white', borderColor: 'lokonysoratra', color: 'lokonysoratra'}}>Date</th>            
          </tr>
        </thead>
        <tbody>
        {filterNoteens(Notese, année, selectedMention, anneeUniversit).map((note, index) => (
            <tr sx={{border: '1px solid white', borderColor: 'lokonysoratra'}} key={index}>
              <td sx={{border: '1px solid white', borderColor: 'lokonysoratra' , color: 'lokonysoratra'}} onClick={() => openUpdateModal(note.id)}><img className="modif" src={modifier} alt="sary" /></td>
              <td sx={{border: '1px solid white', borderColor: 'lokonysoratra' , color: 'lokonysoratra'}}><p>{note.Nom} </p><p>{note.prenom}</p></td>
              <td sx={{border: '1px solid white', borderColor: 'lokonysoratra' , color: 'lokonysoratra'}}> {note.niveaux} </td>
              <td sx={{border: '1px solid white', borderColor: 'lokonysoratra' , color: 'lokonysoratra'}}> {note.mentions} </td>
              <td sx={{border: '1px solid white', borderColor: 'lokonysoratra' , color: 'lokonysoratra'}}>{note.Matier}</td>
              <td sx={{border: '1px solid white', borderColor: 'lokonysoratra' , color: 'lokonysoratra'}}>{note.value/100}</td>
              <td sx={{border: '1px solid white', borderColor: 'lokonysoratra' , color: 'lokonysoratra'}}>{formatTimestamp(note.timestamp)}</td>           
            </tr>
            
          ))}
        </tbody>
      </table>

    ) : (
      <p>Aucune note ajoutée par l'utilisateur.</p>
    )}
  </div>
  <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={closeUpdateModal}
        contentLabel="Modalité de mise à jour de la note"
        className="custom-modal" 
      >
        <h2>Mettre à jour la note</h2>
        <p>Nom: {selectedNote && `${selectedNote.Nom} ${selectedNote.prenom}`}</p>
        <p>Niveau: {selectedNote && selectedNote.niveaux}</p>
        <p>Mention: {selectedNote && selectedNote.mentions}</p>
        <p>Matière: {selectedNote && selectedNote.Matier}</p>
        <p> {selectedNote && selectedNote.AnneeUnivers}</p>
        <form>
          <label>Note :</label>
          <input type="number" value={updatedNote} onChange={(e) => setUpdatedNote(e.target.value)} step="0.01"/>
          <br/>
          <button onClick={mettreAJourNote}>Mettre à Jour</button>
          <button onClick={closeUpdateModal}>Annuler</button>
        </form>
      </Modal>
  </div>
   )}
    </div>

    : <img className="load" src={load} alt="load" />}

  </div>
)}
export default Profile;

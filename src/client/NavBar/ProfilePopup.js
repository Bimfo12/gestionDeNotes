import React, { useState, useEffect } from 'react';
import './ProfilePopup.css';
import imageData from '../../img/couverture7.jpg';
import { Link, useNavigate } from 'react-router-dom';

import { ethers } from "ethers";
import InscriptionEtConnexion from '../../artifacts/contracts/GestionDeNotes.sol/GestionDeNotes.json';

const InscriptionAddress = '0xebc951Ecc30670488C2525a12108cb01B853b3F3';

const ProfilePopup = ({ setLoggedIn }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const storedToken = localStorage.getItem("authToken");

  const [userProfile, setUserProfile] = useState({
    ipfsLink: "",
    nom: "",
    prenom: ""
  });
  

  const navigate = useNavigate();  

  const openLogoutPopup = () => {
    setShowLogoutPopup(true);
  };

  const closeLogoutPopup = () => { 
    setShowLogoutPopup(false); 
  };

  const togglePopup = () => {
    setShowPopup((prevState) => !prevState);
  };

  const handleLogout = () => {
   // setLoggedIn(false); // Mettre à jour l'état de connexion à false
    localStorage.removeItem("authToken");
    closeLogoutPopup();
    navigate("/");
  };

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

  useEffect(() => {

    fetchUserProfile()
    // handleJaimeClick(noteId)

  }, []);

  return (
    <div>
      {/* <img className="button1" onClick={togglePopup} src={imageData} alt="sary" /> */}
      <div className='conten'>
      <img 
        className="button1" 
        src={userProfile && userProfile.ipfsLink ? userProfile.ipfsLink : imageData} 
        alt="sary" 
        onClick={togglePopup}
      />
  
      {showPopup && (
        <div className="popup">  
          
          <div>
            <Link to="/Profile" style={{color:'black'}}>Profile</Link>
          </div>

          <p>
            <Link to="/InfoPersonnelles" style={{color:'black'}}>InfoPersonnelles</Link>
          </p>

          <p onClick={openLogoutPopup}>Deconnexion</p>
        </div>
      )}

      {showLogoutPopup && (
        <div className="logout-popup">
          <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
          <button onClick={closeLogoutPopup}>Non</button>
          <button onClick={handleLogout}>Oui</button>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProfilePopup;

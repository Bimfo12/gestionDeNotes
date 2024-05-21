import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Inscription from './client/inscription/inscription';
import Connexion from './client/login/Connexion'
import InfoPersonnelles from './client/login/InfoPersonnelles'
import {Routes,Route} from 'react-router-dom';
import Accueil from './client/Accueil/Accueil';
import Profile from './client/Profile/Profile';
import AttribuerNote from './client/Note/AttribuerNote';
import ProfilePopup from './client/NavBar/ProfilePopup';
import Identifiant from './client/CreerIdentifient/Identifiant';
import AjoutModule from './client/AjoutModule/AjoutModule';
import Contact from './client/contact/Contact';
import Apropos from './client/Apropos/Apropos';
import AfficherModule from './client/AjoutModule/AfficherModule';
import { GlobalProvider } from './client/AjoutModule/Context';
import Historique from './client/Historique/Historique';


function App() {
  // const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const [loggedIn, setLoggedIn] = useState(false);
  
  return (
    <GlobalProvider>
    <div className="App">
    
      <Routes>
      
         <Route path="/" element={<Connexion setLoggedIn={setLoggedIn}/>}/>
         <Route path="/Accueil" element={<Accueil loggedIn={loggedIn}  />}/>
         <Route path="/Inscription" element={<Inscription/>}/>
         <Route path="/Profile" element={<Profile/>}/>
         <Route path="/InfoPersonnelles" element={<InfoPersonnelles/>}/>
         <Route path="/Identifiant" element={<Identifiant/>}/>
         <Route path="/AjoutModule" element={<AjoutModule/>}/>
         <Route path="/AttribuerNote" element={<AttribuerNote/>}/>
         <Route path="/ProfilePopup" element={<ProfilePopup  />}/>
         <Route path="/Contact" element={<Contact />}/>
         <Route path="/Apropos" element={<Apropos />}/> 
         <Route path="/AfficherModule" element={<AfficherModule/>}/>
         <Route path="/Historique" element={<Historique/>} />
      </Routes>
        
            
    </div>
    </GlobalProvider>
  );
}

export default App;

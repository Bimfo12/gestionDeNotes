/** @jsxImportSource theme-ui */

import React from "react";
import "./APropos.css"; // Importez votre fichier CSS
import Navbar from '../NavBar/Navbar';

function APropos() {
  return (
    <div>
        <div className="bar">
        <Navbar />
      </div>
    <div className="apropos-container" sx={{bg:'navcolors'}}> {/* Appliquez la classe de conteneur */}
      
      <h1>À Propos de l'Application</h1>
      <p>
        L'application "Gestion de Notes avec la Technologie Blockchain" a été développée pour offrir une solution innovante de gestion des notes académiques en utilisant la technologie de la blockchain.
      </p>
      <p>
        Cette application permet aux étudiants et aux professeurs de stocker de manière sécurisée et transparente les notes des étudiants, tout en garantissant l'intégrité des données et la traçabilité des résultats.
      </p>
      <p>
        Caractéristiques principales :
      </p>
      <ul>
        <li sx={{color:'soratra'}}>Enregistrement sécurisé des notes dans la blockchain.</li>
        <li sx={{color:'soratra'}}>Accès instantané aux résultats pour les étudiants.</li>
        <li sx={{color:'soratra'}}>Facilité d'ajout et de gestion des professeurs et des matières.</li>
        <li sx={{color:'soratra'}}>Transparence et immuabilité des données académiques.</li>
      </ul>
      <p>
        Notre objectif est de simplifier et de renforcer le processus de gestion des notes pour les établissements d'enseignement, en utilisant une technologie de pointe pour garantir la fiabilité des résultats.
      </p>
      
    </div>
    </div>

  );
}

export default APropos;

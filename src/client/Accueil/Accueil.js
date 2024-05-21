import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import InscriptionEtConnexion from '../../artifacts/contracts/GestionDeNotes.sol/GestionDeNotes.json';
import Navbar from '../NavBar/Navbar';
import loggedIn from '../login/Connexion';
import './Accueil.css';
import { Link, useNavigate } from 'react-router-dom';


const InscriptionAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function Accueil() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
                timestamp: note[5].toNumber(), 
                addedBy: note[6],
              });
            }

            setNotes(notesData);
          }
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    }

    fetchAllNotes();
  }, []);

  const groupNotesBySender = notes.reduce((groups, note) => {
    const sender = note.addedBy;
    if (!groups[sender]) {
      groups[sender] = [];
    }
    groups[sender].push(note);
    return groups;
  }, {});

  return (
    <div>
      
      <div className="bar">
      <Navbar/>
      </div>  <br/> <br/> 
      
      <div className='containt'>
        <div className='list_user'></div>
        {loggedIn && (
          <div className='note_publier'>
            {Object.entries(groupNotesBySender).map(([sender, senderNotes]) => (
              <div key={sender}>
                <h2>Notes envoyées par l'adresse: {sender}</h2>
                {senderNotes.length > 0 && (
                  <div>
                    <table className="table">
                      <thead> 
                        <tr>
                          <th className="titre">Notes de {senderNotes[0].Matier}</th>
                          <th></th>
                          <th></th>
                        </tr>
                        <tr>
                          <th>Nom et Prenom</th>
                          <th>Matière</th>
                          <th>Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {senderNotes.map((note, index) => (
                          <tr key={index}>
                            <td><p>{note.Nom}  {note.prenom}</p></td>
                            <td>{note.Matier}</td>
                            <td>{note.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}

export default Accueil;

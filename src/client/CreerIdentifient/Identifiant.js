import React, { useState, useEffect  } from "react";
import { ethers } from "ethers";
import InscriptionEtConnexion from '../../artifacts/contracts/GestionDeNotes.sol/GestionDeNotes.json';
import { useNavigate } from 'react-router-dom';
import './Identifient.css'



// const InscriptionAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const InscriptionAddress = '0xebc951Ecc30670488C2525a12108cb01B853b3F3';

function Identifiant() {
  const [identifier, setIdentifier] = useState(''); 
  const [isProfessor, setIsProfessor] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requireError, setRequireError] = useState(null);

  const navigate = useNavigate();

  const createIdentifier = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true);

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(InscriptionAddress, InscriptionEtConnexion.abi, signer);

        const tx = await contract.creerIdentifiant(
          ethers.utils.formatBytes32String(identifier),
          isProfessor
        );

        setTransactionHash(tx.hash);
        setLoading(false);
        setIdentifier("");
      }  catch (error) {
        console.error(error);
        if (error.data && error.data.message) {
          const reason = error.data.message.replace(
            "Error: VM Exception while processing transaction: reverted with reason string ",
            ""
          );
          setRequireError(reason);
        } else {
          setError('Erreur inattendue.');
        }
        setLoading(false);
      }
    }
  };
  
  useEffect(() => {

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

          if(userAddress === '0xdD2FD4581271e230360230F9337D5c0430Bf44C0' || userAddress === '0x291aFe0B980c56f72EcdBA728617c0588fBEC42c' ){
            navigate("/Identifiant");
          }
          else{
            navigate("/");
          }
    
        }
      } catch (error) {
        console.error('Error getting personal information from the contract:', error);
      }
    }
    getPersonalInfo()
  },[])

  return (
    <div className="ijiay">
      <br/><br/><br/><br/><br/><br/>
      <div className="form-container">
      <h2>Créer un Identifiant</h2>
      <form>
        <label htmlFor="identifier">Identifiant:</label>
        <input
          type="text"
          id="identifier"
          value={identifier} 
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <br/><br/>
        <div className="checkbox-label">
        <input type="checkbox" id="isProfessor" checked={isProfessor}
          onChange={() => setIsProfessor(!isProfessor)}
        />
        <label htmlFor="isProfessor">Enseignant(e)</label>
        </div>
        <br />

        <label>
        <input type="checkbox" />
        Etudiant(e)
      </label>
      <br />
        <button type="button" onClick={createIdentifier} disabled={loading}>
          {loading ? 'Création en cours...' : 'Créer'}
        </button>
      </form>

      </div>

      {requireError && <p style={{ color: 'red' }}>{requireError}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

    </div>
  );
}

export default Identifiant;

const InscriptionEtConnexion = require('../src/artifacts/contracts/GestionDeNotes.sol/GestionDeNotes.json');
const InscriptionAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const { ethers } = require('ethers');
const contractAbi = [InscriptionEtConnexion.abi];
// Création de l'interface du contrat à partir de son ABI
const contractInterface = new ethers.utils.Interface(contractAbi[0]); 
async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  provider.on('block', async (blockNumber) => {
    console.log(` le bloc numéro ${blockNumber} a été ajouté à la blockchain avec succès.`);
    const block = await provider.getBlockWithTransactions(blockNumber);
    block.transactions.forEach((tx) => {
      console.log(`Transaction hash: ${tx.hash}`);
      console.log(`  From: ${tx.from}`);
      console.log(`  To: ${tx.to}`);
      console.log(`  Value: ${ethers.utils.formatEther(tx.value)} ETH`);
      try {
        // Utilisation de l'interface pour décoder les données de transaction
        const txData = contractInterface.parseTransaction({ data: tx.data });
        console.log(`  Function: ${txData.name}`);
        console.log(`  Args: ${txData.args}`);
      } catch (error) {
        console.log(`  Data: ${tx.data}`);}
      console.log('---');
    });
  });
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
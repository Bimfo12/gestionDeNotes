
const hre = require("hardhat");

async function main() {
 

  const Notes = await hre.ethers.getContractFactory("GestionDeNotes");
  const notes = await Notes.deploy();

  await notes.deployed();

  console.log("Gestion de notes est deployer à :", notes.address);
}

 
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract GestionDeNotes {


    struct User {
        bytes32 username;
        bytes32 email;
        bytes32 password;
        bool isProfessor;
        bool isRegistered;  
    }

    struct PersonalInfo {
        bytes32 name;
        bytes32 firstName;
        uint256 age;
        bytes32 ville;
        bytes32 sexe;
        bytes32 niveau;
        bytes32 mention;
    }

    struct Note {
    uint id;
    string nom;
    string prenom;
    string Matier;
    string niveaux;
    string mentions;
    string AnneeUniversitaire; // Champ ajouté
    uint value;
    uint timestamp;
}

    struct Identifier {
        bytes32 identifier;
        bool isProfessor;
        bool isUsed;
    }

 struct ProfStatu {
    string nom;
    string prenom;
    string niveaux;
    string mentions;
    string matieres;
    string AnneeUniversitaire; // Champ ajouté si nécessaire
}

     struct UserProfile {
        string ipfsLink;
        string nom;
        string prenom;
    }

    mapping(bytes32 => Identifier) public identifiers;
    mapping(address => User) private users;
    mapping(address => PersonalInfo) public personalInfos;
    mapping(bytes32 => User) private usersByEmail;
    mapping(uint => Note) public notes;
    mapping(address => uint[]) private userNotes;
    mapping(address => string) private userTokens;  // Associer une adresse Ethereum à un token
    mapping(address => UserProfile) public userProfiles;

    uint public noteCount;
    address[] private userAddresses; // Tableau pour stocker les adresses des Etudiants
    address[] private ProfAddresses; // Tableau pour stocker les adresses des profs
    mapping(uint => ProfStatu) public professeurs;
    uint public profeCount;

    


    address public owner = msg.sender; // Remplacez par l'adresse souhaitée

    event UserRegistered(address indexed userAddress, bytes32 username, bytes32 email, bool isProfessor);
    event UserLoggedIn(address indexed userAddress, bytes32 username);

    event Ajout_des_Notes(uint id, string Matier, uint value, string nom, string prenom, string _niveaux, string _mentions, string _AnneeUniversitaire, uint timestamp);
    event Mise_a_jours_des_Notes(uint id, string Matier, uint value, string nom, string prenom, string _niveaux, string _mentions, string _AnneeUniversitaire, uint timestamp);
    event Effacer_des_Notes(uint id);
    event Ajout_des_Professeurs(uint indexed profId, string nom, string prenom, string niveaux, string mentions, string matieres, string _AnneeUniversitaire);
    event ConnexionReussie(address indexed userAddress, bytes32 token);

    
    modifier onlyOwnerOrAuthorized() {
        require(msg.sender == owner || msg.sender == 0xdD2FD4581271e230360230F9337D5c0430Bf44C0, "Non autoriser.");
        _;
    }

    modifier onlyRegisteredUser() {
        require(users[msg.sender].isRegistered, "Vous devez etre un utilisateur inscrit.");
        _;
    }


    // Fonction pour créer un nouvel identifiant avec une indication sur le statut de professeur
    function creerIdentifiant(bytes32 _identifier, bool _isProfessor) public onlyOwnerOrAuthorized {
        require(!identifiers[_identifier].isUsed, "Cet identifiant est deja utiliser.");
        identifiers[_identifier] = Identifier(_identifier, _isProfessor, true);
    }

    // Cette fonction permet à un utilisateur de s'inscrire en utilisant son identifiant
    function sInscrire(bytes32 _username, bytes32 _email, bytes32 _password, bytes32 _identifier) public {
        require(!users[msg.sender].isRegistered, "Utilisateur deja inscrit.");
        require(identifiers[_identifier].isUsed, "Cet identifiant n'existe pas.");
        bool isProfessor = identifiers[_identifier].isProfessor;
        users[msg.sender] = User(_username, _email, _password, isProfessor, true);
        identifiers[_identifier].isUsed = false;
        if (isProfessor == false) {
            userAddresses.push(msg.sender);
        } else {
            ProfAddresses.push(msg.sender);
        }
        emit UserRegistered(msg.sender, _username, _email, isProfessor);
    }

    function setPersonalInfo(bytes32 _name, bytes32 _firstName, uint256 _age, bytes32 _ville, bytes32 _sexe, bytes32 _niveau, bytes32 _mention) public onlyRegisteredUser {
        personalInfos[msg.sender] = PersonalInfo(_name, _firstName, _age, _ville, _sexe, _niveau, _mention);
    }

    function getPersonalInfo() public view returns (bytes32, bytes32, uint256, bytes32, bytes32, bytes32, bytes32) {
        PersonalInfo memory info = personalInfos[msg.sender];
        return (info.name, info.firstName, info.age, info.ville, info.sexe, info.niveau, info.mention);
    }

    function seConnecter(bytes32 _email, bytes32 _password) public {
    address userAddress = msg.sender;
    User memory user = users[userAddress]; 
    require(user.isRegistered, "Utilisateur non inscrit.");
    require(user.email == _email && user.password == _password, "Email ou mot de passe incorrect.");

    bytes32 token = keccak256(abi.encodePacked(generateRandomToken()));

    userTokens[msg.sender] = bytes32ToString(token);

    emit ConnexionReussie(msg.sender, token);
    emit UserLoggedIn(userAddress, user.username);
}

    function estProfesseur(address _userAddress) public view returns (bool) {
        return users[_userAddress].isProfessor;
    }

    function estInscrit(address _userAddress) public view returns (bool) {
        return users[_userAddress].isRegistered;
    }

     // Ajouter une nouvelle note avec la possibilité d'ajouter un commentaire initial
    function ajouterNote(string memory _Matier, uint _value, string memory _nom, string memory _prenom, string memory _niveaux, string memory _mentions, string memory _AnneeUniversitaire) public {
    noteCount++;
    Note storage nouvelleNote = notes[noteCount];
    nouvelleNote.id = noteCount;
    nouvelleNote.nom = _nom;
    nouvelleNote.prenom = _prenom;
    nouvelleNote.Matier = _Matier;
    nouvelleNote.niveaux = _niveaux;
    nouvelleNote.mentions = _mentions;
    nouvelleNote.AnneeUniversitaire = _AnneeUniversitaire; // Enregistrement de la nouvelle donnée
    nouvelleNote.value = _value;
    nouvelleNote.timestamp = block.timestamp;

    userNotes[msg.sender].push(noteCount);
    emit Ajout_des_Notes(noteCount, _Matier, _value, _nom, _prenom, _niveaux, _mentions, _AnneeUniversitaire, block.timestamp);
}

      function mettreAJourNote(uint _id, string memory _Matier, uint _value, string memory _nom, string memory _prenom, string memory _niveaux, string memory _mentions, string memory _AnneeUniversitaire) public {
    require(_id > 0 && _id <= noteCount, "Note non trouve");
    Note storage note = notes[_id];
    note.Matier = _Matier;
    note.value = _value;
    note.nom = _nom;
    note.prenom = _prenom;
    note.niveaux = _niveaux;
    note.mentions = _mentions;
    note.AnneeUniversitaire = _AnneeUniversitaire;
    note.timestamp = block.timestamp;
    emit Mise_a_jours_des_Notes(_id, _Matier, _value, _nom, _prenom, _niveaux, _mentions, _AnneeUniversitaire, block.timestamp);
}


    function supprimerNote(uint _id) public {
        require(_id > 0 && _id <= noteCount, "Note non trouver");
        delete notes[_id];
        emit Effacer_des_Notes(_id);
    }

   function obtenirNote(uint _id) public view returns (uint, string memory, uint, string memory, string memory, string memory, string memory, string memory, uint) {
    require(_id > 0 && _id <= noteCount, "Note non trouve");
    Note storage note = notes[_id];
    return (note.id, note.Matier, note.value, note.nom, note.prenom, note.niveaux, note.mentions, note.AnneeUniversitaire, note.timestamp);
}


    
    function getNoteIdsForUser(address _userAddress) public view returns (uint[] memory) {
        require(users[_userAddress].isRegistered, "Utilisateur non inscrit.");
        return userNotes[_userAddress];
    }

    function ajouterProfesseur(string memory _nom, string memory _prenom, string memory _niveaux, string memory _mentions, string memory _matieres, string memory _AnneeUniversitaire) public {
        profeCount++;
        professeurs[profeCount] = ProfStatu(_nom, _prenom, _niveaux, _mentions, _matieres, _AnneeUniversitaire);
        emit Ajout_des_Professeurs(profeCount, _nom, _prenom, _niveaux, _mentions, _matieres, _AnneeUniversitaire);
    }

    // Déclarez une fonction pour récupérer les données d'un professeur par son ID
    function obtenirProfesseur(uint _profId) public view returns (string memory nom, string memory prenom, string memory niveaux, string memory mentions, string memory matieres, string memory AnneeUniversitaire) {
        require(_profId > 0 && _profId <= profeCount, "L'ID du professeur n'existe pas");
        ProfStatu storage prof = professeurs[_profId];
        return (prof.nom, prof.prenom, prof.niveaux, prof.mentions, prof.matieres, prof.AnneeUniversitaire);
    }

    function getAllPersonalInfo() public view returns (bytes32[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory) {
        uint userCount = 0; // Compteur d'utilisateurs enregistrés
        for (uint i = 0; i < userAddresses.length; i++) {
            if (users[userAddresses[i]].isRegistered) {
                userCount++;
            }
        }

        bytes32[] memory allNames = new bytes32[](userCount);
        bytes32[] memory allFirstNames = new bytes32[](userCount);
        bytes32[] memory allNiveau = new bytes32[](userCount);
        bytes32[] memory allMention = new bytes32[](userCount);

        uint currentIndex = 0; // Index actuel pour ajouter des noms et prénoms

        for (uint i = 0; i < userAddresses.length; i++) {
            address userAddress = userAddresses[i];
            if (users[userAddress].isRegistered) {
                PersonalInfo memory info = personalInfos[userAddress];
                allNames[currentIndex] = info.name;
                allFirstNames[currentIndex] = info.firstName;
                allNiveau[currentIndex] = info.niveau;
                allMention[currentIndex] = info.mention;
                currentIndex++;
            }
        }

        return (allNames, allFirstNames, allNiveau, allMention);
    }

    function getAllProfesseursNames() public view returns (bytes32[] memory, bytes32[] memory) {
        uint profCount = ProfAddresses.length;
        bytes32[] memory allNoms = new bytes32[](profCount);
        bytes32[] memory allPrenoms = new bytes32[](profCount);

        for (uint i = 0; i < profCount; i++) {
            address profAddress = ProfAddresses[i];
            PersonalInfo memory info = personalInfos[profAddress];
            allNoms[i] = info.name;
            allPrenoms[i] = info.firstName;
        }

        return (allNoms, allPrenoms);
    }

    function generateRandomToken() internal view returns (string memory) {
   
    bytes32 hash = keccak256(abi.encodePacked(msg.sender, block.timestamp));
    return bytes32ToString(hash);
}

function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
    uint8 i = 0;
    while (i < 32 && _bytes32[i] != 0) {
        i++;
    }
    bytes memory bytesArray = new bytes(i);
    for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
        bytesArray[i] = _bytes32[i];
    }
    return string(bytesArray);
}

function getAuthToken() public view returns (bytes32) {
    bytes32 hash = keccak256(abi.encodePacked(msg.sender, block.timestamp));
    return hash;
}



function uploadImage(string memory _ipfsLink, string memory _nom, string memory _prenom) external {
        require(bytes(_ipfsLink).length > 0, "Le lien IPFS est requis");
        require(bytes(_nom).length > 0, "Le nom est requis");
        require(bytes(_prenom).length > 0, "Le prenom est requis");

        UserProfile memory newUserProfile = UserProfile({
            ipfsLink: _ipfsLink,
            nom: _nom,
            prenom: _prenom
        });

        userProfiles[msg.sender] = newUserProfile;
    }

     function getUserProfile(address userAddress) external view returns (string memory, string memory, string memory) {
    UserProfile storage userProfile = userProfiles[userAddress];
    return (userProfile.ipfsLink, userProfile.nom, userProfile.prenom);
}

     function displayUserProfile(address userAddress) external view returns (string memory) {
         UserProfile storage userProfile = userProfiles[userAddress];
         return string(abi.encodePacked(
             "Nom: ", userProfile.nom, "\n",
             "Prenom: ", userProfile.prenom, "\n",
             "Lien IPFS: ", userProfile.ipfsLink
         ));
     }

}

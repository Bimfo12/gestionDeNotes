/** @jsxImportSource theme-ui */
import React from "react";
import "./Contact.css"; // Importez votre fichier CSS
import Navbar from '../NavBar/Navbar'

function Contact() {
  const contactInfo = {
    mail: "giltoedouard@gmail.com",
    téléphone: "+261345508492",
    facebook: "Edouard Gilto"
  };

  return (
    <div>
        <div className="bar">
      <Navbar />
    </div>
    <div className="contact-container"> {/* Appliquez la classe de conteneur */}
      <h1>Contactez-nous</h1>
      <p>
        <strong>Email:</strong> {contactInfo.mail}
      </p>
      <p>
        <strong>Téléphone:</strong> {contactInfo.téléphone}
      </p>
      <p>
        <strong>Facebook:</strong> {contactInfo.facebook}
      </p>
    </div>
    </div>
  );
}

export default Contact;

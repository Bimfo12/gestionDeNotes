/** @jsxImportSource theme-ui */
import React, { useState } from "react";
import "./Navbar.css";
import ProfilePopup from "./ProfilePopup"; 
import { Link } from "react-router-dom";
import { useColorMode } from "theme-ui";
function Navbar() {
  const [active, setActive] = useState("nav__menu");
  const [icon, setIcon] = useState("nav__toggler");
  const [colorMode, setColorMode] = useColorMode(); // État initial vide
  
  
  const navToggle = () => {
    if (active === "nav__menu") {
      setActive("nav__menu nav__active");
    } else setActive("nav__menu");  

    // Icon Toggler
    if (icon === "nav__toggler") {
      setIcon("nav__toggler toggle");
    } else setIcon("nav__toggler");
  };

  const contacts = [
    { id: 1, },
    // Ajoutez plus de contacts ici
  ]; 


  return (
    <nav className="nav"  sx={{bg:'navcolors', color:'soratra'}}>
        
      <div className="nav__brand" >
        
      <button onClick={()=> setColorMode(colorMode==='light' ? 'dark' : 'light')} 
            sx={{bg:'text', color:'lokonysoratra'}} className="boutem">
             {colorMode==='light' ? 'sombre 🌙' : 'Claire ☀️'}
            </button>

          <Link to="/Profile" sx={{color:'text'}}>Gestion de Notes</Link>
        </div>
      <ul className={active} >
        <li className="nav__item" sx={{ color:'soratra'}}>


        <div className="nav__brand">
          <Link to="/Profile" sx={{color:'text'}}>Accueil</Link>
        </div>
        </li>
        
        <li className="nav__item" sx={{ color:'soratra'}}>
        <Link to="/Apropos" sx={{color:'text'}}>Apropos</Link>
        </li>
        
        <li className="nav__item">
        <Link to="/Contact" sx={{color:'text'}}>Contact</Link>
        </li>  
       

        {/* ... Other nav items */}
        {contacts.map((contact) => (
          <li key={contact.id} sx={{ bg:'navcolors' }}>
            {contact.name}
            <ProfilePopup />
          </li>
        ))}

      
      </ul>
      <div onClick={navToggle} className={icon} >
        <div className="line1" sx={{color:'soratra'}}></div>
        <div className="line2" sx={{color:'soratra'}}></div>
        <div className="line3" sx={{color:'soratra'}}></div>
      </div>
    </nav>
    
  );

}

export default Navbar;

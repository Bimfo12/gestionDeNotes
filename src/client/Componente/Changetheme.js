import React from "react";
import {ReactComponent as Sun} from "./sun.svg"
import {ReactComponent as Moon} from "./moon.svg"
import "./Changetheme.css"
const Changetheme = () => {
  
    const setDarkMode = () => {
        const bodies = document.querySelectorAll("body");
        bodies.forEach(body => {
          body.setAttribute('data-theme', 'dark');
        });
      };
      
      const setLightMode = () => {
        const bodies = document.querySelectorAll("body");
        bodies.forEach(body => {
          body.setAttribute('data-theme', 'light');
        });
      };
      
    const toggleTheme = (e) =>{
        if (e.target.checked) setDarkMode();
        else setLightMode();
    }
  return (
    <div className="dark_mode">

    <input
        className="dark_mode_input"
        type='checkbox'
        id="darkmode_toggle"
        onChange={toggleTheme}
    
    />
     <label className="dark_mode_label" for="darkmode-toggle">
     <Sun/>
     <Moon/>

     </label>
    </div>
  );
}

export default Changetheme;

import React, { useState } from "react";
import "../styles/Header.css";
import logo from "../assets/REPLACE-BACKLOG.png";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header">
            <div className="logo"><img src={logo} alt="Game Backlog Logo" /></div>
            <nav className={`nav ${isOpen ? "open" : ""}`}>
                <a href="/" className="nav-link">Home</a>
                <a href="/backlog" className="nav-link">Backlog</a>
                <a href="/profile" className="nav-link">Profile</a>
            </nav>
            <div className="burger" onClick={toggleMenu}>
                &#9776;
            </div>
        </header>
    );
};

/**
 * &#9776; is the unicode for the hamburger menu icon
*/

export default Header;
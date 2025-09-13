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
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
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
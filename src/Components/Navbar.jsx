import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../Styles/Navbar.css";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="responsive-navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          GameBacklog
        </NavLink>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <nav className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "navbar-link active" : "navbar-link"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  isActive ? "navbar-link active" : "navbar-link"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Favorites
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
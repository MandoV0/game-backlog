import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header>
      <nav>
        <ul className="ref-list">
          <li className="header-button"><Link to="/">Home</Link></li>
          <li className="header-button"><Link to="/favorites">Favorites</Link></li>
          <li className="header-button">About</li>
        </ul>
      </nav>
    </header>
  );
}
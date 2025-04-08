import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header>
      <nav>
        <ul className="ref-list">
          <Link to="/"><li className="header-button">Home</li></Link>
          <Link to="/favorites"><li className="header-button">Favorites</li></Link>
        </ul>
      </nav>
    </header>
  );
}
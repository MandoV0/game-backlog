import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import GameBrowsingPage from "./pages/GameBrowsingPage";
import GameDetailsPage from "./pages/GameDetailsPage";

function App() {
  return (
    <Router>
       <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<GameBrowsingPage />} />
        <Route path="/game" element={<GameDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App;
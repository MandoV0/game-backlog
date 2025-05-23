import "./Styles/App.css";
import Favorites from "./Pages/Favorites";
import { Routes, Route } from "react-router-dom";
import Games from "./Pages/Games";
import Game from "./Pages/Game";
import Login from "./Pages/Login";

function App() {
  return(
    <Routes>
      <Route path="/" element={<Games/>} />
      <Route path="/favorites" element={<Favorites/>} />
      <Route path="/game" element={<Game/>} />
      <Route path="/login" element={<Login/>} />
    </Routes>
  );
}

export default App;
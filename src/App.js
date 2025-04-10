import "./Styles/App.css";
import Pagination from "./Components/Pagination";
import { useEffect, useState } from "react";
import { getGames } from "./Services/API";
import { Header } from "./Components/Header";
import { Search } from "./Components/Search";
import { GameGrid } from "./Components/GameGrid";
import Favorites from "./Pages/Favorites";
import { Routes, Route } from "react-router-dom";
import Games from "./Pages/Games";

function App() {
  return(
    <Routes>
      <Route path="/" element={<Games/>} />
      <Route path="/favorites" element={<Favorites/>} />
    </Routes>
  );
}

export default App;
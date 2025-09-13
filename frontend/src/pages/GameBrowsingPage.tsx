import { useState } from "react";
import GameGrid from "../components/GameGrid";
import Pagination from "../components/Pagination";
import "../App.css";
import Header from "../components/Header";

const mockGames = [
  { id: 1, name: "The Witcher 3", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.cBe32xws0g6ntBZaZAk4TgHaLH%3Fpid%3DApi&f=1&ipt=a2dbb26309ad9e4b7e816c13b2452d554e04ed4d01ace160cccee5a6a754e102" },
  { id: 2, name: "Cyberpunk 2077", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.cBe32xws0g6ntBZaZAk4TgHaLH%3Fpid%3DApi&f=1&ipt=a2dbb26309ad9e4b7e816c13b2452d554e04ed4d01ace160cccee5a6a754e102" },
  { id: 3, name: "Red Dead Redemption 2", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.cBe32xws0g6ntBZaZAk4TgHaLH%3Fpid%3DApi&f=1&ipt=a2dbb26309ad9e4b7e816c13b2452d554e04ed4d01ace160cccee5a6a754e102" },
  { id: 4, name: "God of War", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.cBe32xws0g6ntBZaZAk4TgHaLH%3Fpid%3DApi&f=1&ipt=a2dbb26309ad9e4b7e816c13b2452d554e04ed4d01ace160cccee5a6a754e102" },
  { id: 5, name: "Hades", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.cBe32xws0g6ntBZaZAk4TgHaLH%3Fpid%3DApi&f=1&ipt=a2dbb26309ad9e4b7e816c13b2452d554e04ed4d01ace160cccee5a6a754e102" },
  { id: 6, name: "Elden Ring", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.cBe32xws0g6ntBZaZAk4TgHaLH%3Fpid%3DApi&f=1&ipt=a2dbb26309ad9e4b7e816c13b2452d554e04ed4d01ace160cccee5a6a754e102" },
  { id: 7, name: "Hollow Knight", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.cBe32xws0g6ntBZaZAk4TgHaLH%3Fpid%3DApi&f=1&ipt=a2dbb26309ad9e4b7e816c13b2452d554e04ed4d01ace160cccee5a6a754e102" },
  { id: 8, name: "Celeste", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.cBe32xws0g6ntBZaZAk4TgHaLH%3Fpid%3DApi&f=1&ipt=a2dbb26309ad9e4b7e816c13b2452d554e04ed4d01ace160cccee5a6a754e102" },
];

const PAGE_SIZE = 10;

function App() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(mockGames.length / PAGE_SIZE);
  const paginatedGames = mockGames.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Header></Header>

      <section className="hero">
        <h1>Welcome to the Game Backlog</h1>
        <p>Add your games to your backlog and track your progress!</p>
        <a href="#about" className="btn">Get Started</a>
      </section>

      <main>
        <GameGrid games={paginatedGames} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </main>

      <footer>
        <p>&copy; 2025 MyWebsite. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
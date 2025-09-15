import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import GameBrowsingPage from "./pages/GameBrowsingPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import AuthPage from "./pages/AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Router>
        <Routes>
            <Route path="/" element={<GameBrowsingPage />} />
            <Route path="/game/:id" element={<GameDetailsPage/>} />
            <Route path="/auth" element={<AuthPage/>}/>
        </Routes>
        </Router>
    </QueryClientProvider>
  )
}

export default App;
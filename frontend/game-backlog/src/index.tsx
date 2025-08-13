import './styles/Variables.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import Header from './components/Header';
import { Games } from './pages/Games';
import { Favorites } from './pages/Favorites';
import ProtectedRoute from './routes/ProtectedRoute';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/games/:gameid" element={<ProtectedRoute><Games/></ProtectedRoute>}/>
        <Route path="/favorites" element={<ProtectedRoute><Favorites/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
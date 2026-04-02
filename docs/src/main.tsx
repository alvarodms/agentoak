import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import JournalPage from './pages/JournalPage';
import GuidePage from './pages/GuidePage';
import AboutPage from './pages/AboutPage';
import DownloadsPage from './pages/DownloadsPage';
import PokedexPage from './pages/PokedexPage';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<JournalPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/pokedex" element={<PokedexPage />} />
          <Route path="/pokedex/:name" element={<PokedexPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  </React.StrictMode>,
);

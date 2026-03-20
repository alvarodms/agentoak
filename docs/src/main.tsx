import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import JournalPage from './pages/JournalPage';
import GuidePage from './pages/GuidePage';
import StrategyPage from './pages/StrategyPage';
import RoadmapPage from './pages/RoadmapPage';
import AboutPage from './pages/AboutPage';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<JournalPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/strategy" element={<StrategyPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  </React.StrictMode>,
);

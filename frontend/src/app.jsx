import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bri from './pages/bri.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import Health from './pages/health.jsx';
import Recipes from './pages/recipes.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Bri />} /> 
          <Route path="health" element={<Health />} />
          <Route path="recipes" element={<Recipes />} />
        </Route>
      </Routes>
    </Router>
  );
}

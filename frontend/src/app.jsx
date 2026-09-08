import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bri from './pages/bri.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Bri />} />
        </Route>
      </Routes>
    </Router>
  );
}
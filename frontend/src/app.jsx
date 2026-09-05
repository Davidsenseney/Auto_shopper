import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hestia from './pages/hestia';
import DashboardLayout from './components/DashboardLayout.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Hestia />} />
        </Route>
      </Routes>
    </Router>
  );
}
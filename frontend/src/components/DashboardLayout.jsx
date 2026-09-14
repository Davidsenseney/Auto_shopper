import React from 'react';
import {Outlet, NavLink} from 'react-router-dom';
import './styles/DashboardLayout.css';
import logo from '../assets/brilogo.png';


export default function DashboardLayout(){
    return (
  <div className="layout-container">  
    
      <aside className="sidebar">
        <div className="sidebar-logo" >
          <div className="logo-container">
            <img  src={logo} alt="Logo" />
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><NavLink to="/pages/hestia.jsx">Dashboard</NavLink></li>
            <li><NavLink to="/pages/recipies.jsx">Recipies</NavLink></li>
            <li><NavLink to="/pages/goals.jsx">Goals</NavLink></li>
            <li><NavLink to="/pages/shopping.jsx">Shopping</NavLink></li>
            <li><NavLink to="/pages/settings.jsx">Settings</NavLink></li>
          </ul>
        </nav>
      </aside>
    <main className="main-content">
      <header className="top-header">
        <div className='header-titles'>
          <h1> Hello and Welcome to Bri</h1>
            <p> I am ready to help you Eat well and live well! </p>
        </div>  
        <div className="header-actions">
          <button className="btn-secondary">quick actions</button>
          <button className="btn-primary">Get Started </button>
        </div>
      </header>
      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-value"> 0</span>
          <span className="stat-label"> Current Order</span>
          <span className="stat-indicator"> 0% </span>
        </div>
        <div className="stat-card">
          <span className="stat-value"> 0</span>
          <span className="stat-label"> Current Order</span>
          <span className="stat-indicator"> 0% </span>
        </div>
        <div className="stat-card">
          <span className="stat-value"> 0</span>
          <span className="stat-label"> Current Order</span>
          <span className="stat-indicator"> 0% </span>
        </div>
        <div className="stat-card"> card 4</div>
      </section>
      <section className="workspace-area">
      <Outlet />
      </section>
    </main>
  </div>
    );
}
import React from 'react';
import {Outlet} from 'react-router-dom';
import './DashboardLayout.css';

export default function DashboardLayout(){
    return (
  <div className="layout-container">  
    
      <aside clasName="sidebar">
        <div className="sidebar-brand"> logo</div>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="/pages/hestia.jsx">Dashboard</a> Hestia</li>
            <li>Recipies</li>
            <li>Goals</li>
            <li>shopping </li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>
    <main className="main-content">
      <header className="top-header">
        <div className='header-titles'>
          <h1> Hello and Welcome to Hestia</h1>
            <p> I am ready to help you Eat well and live well! </p>
        </div>  
        <div className="header-actions">
          <button>Toggle</button>
          <button>Get Started </button>
        </div>
      </header>
      <section className="stats-grid">
        <div className="stat-card"> card 1</div>
        <div className="stat-card"> card 2</div>
        <div className="stat-card"> card 3</div>
        <div className="stat-card"> card 4</div>
      </section>
      <Outlet />
   
    </main>
  </div>
    );
}
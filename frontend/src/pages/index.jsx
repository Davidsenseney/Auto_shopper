import React from 'react';
import './DashboardLayout.css';

export default function DashboardLayout(){
    return (
  <div className="layout-container">  
    
      <aside clasName="sidebar">
        <div className="sidebar-brand"> logo</div>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="#">Dashboard</a> Hestia</li>
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
      <section className="workspace-area">
        <div className="empty-state-content">
          <div className="icon-placeholder"> icon</div>
          <h2>Welcome to Hestia</h2>
          <div className="empty-state-action">
            <p>Get started by creating your first recipe or goal.</p>
            <button className="primary-button">Create Recipe</button>
            <button className="secondary-button">Create Goal</button>
          </div>
        </div>
      </section>
   
    </main>
  </div>
    );
}
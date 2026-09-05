import react from 'react';

export default function Hestia() {
  return (
    <div>
      <h1>Welcome to Hestia</h1>
      <p>This is the Hestia page.</p>
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
    </div>
  );
}
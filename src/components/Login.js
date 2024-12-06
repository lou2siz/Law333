import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.toLowerCase() === 'aflorek' && password === 'GoatLawyer') {
      onLogin(true);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="cyber-background">
        <div className="grid-overlay"></div>
        <div className="scan-line"></div>
      </div>
      
      <div className="breaking-news-banner">
        <div className="news-content">
          <span className="news-badge">Breaking News</span>
          <p className="news-text">Demand Dashboard Release: 12/13/24</p>
          <div className="glitch-effect"></div>
        </div>
      </div>

      <div className="login-card">
        <h2>LawSist Dashboard</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login; 
import React, { useState, useEffect } from 'react';
import NodeGraph from './components/NodeGraph';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [nodesData, setNodesData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

  useEffect(() => {
    // Load initial nodes data
    fetch('data/nodes.json')
      .then(response => response.json())
      .then(data => setNodesData(data))
      .catch(error => {
        console.error('Error loading data:', error);
        alert('Failed to load data. Please try refreshing the page.');
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);

  const handleLogin = (password) => {
    if (password === "admin123") {
      localStorage.setItem('adminToken', 'admin123');
      setIsAdmin(true);
      setShowLogin(false);
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  const handleSaveData = async (data) => {
    try {
      await fetch('/.netlify/functions/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      setNodesData(data);
      setShowAdminPanel(false);
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  if (!nodesData) return <div>Loading...</div>;

  return (
    <div className="App">
      <main>
        <NodeGraph data={nodesData} />
        
        {!isAdmin && (
          <button 
            className="admin-login-button" 
            onClick={() => setShowLogin(true)}
          >
            Admin Login
          </button>
        )}

        {showLogin && (
          <div className="login-overlay">
            <div className="login-form">
              <h3>Admin Login</h3>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>
              <button onClick={() => setShowLogin(false)}>Cancel</button>
            </div>
          </div>
        )}

        {isAdmin && (
          <>
            <button 
              className="admin-logout-button" 
              onClick={handleLogout}
            >
              Logout
            </button>
            <button 
              className="admin-login-button" 
              onClick={() => setShowAdminPanel(true)}
            >
              Open Admin Panel
            </button>
            {showAdminPanel && (
              <div className="admin-overlay">
                <AdminPanel onSave={handleSave} onClose={handleClosePanel} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;

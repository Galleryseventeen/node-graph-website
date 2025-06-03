import React, { useState, useEffect } from 'react';
import NodeGraph from './components/NodeGraph';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [nodesData, setNodesData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

  useEffect(() => {
    // Load initial nodes data
    fetch('data/nodes.json')
      .then(response => response.json())
      .then(data => {
        console.log('Loaded data:', data);
        setNodesData(data);
      })
      .catch(error => {
        console.error('Error loading data:', error);
      });
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      localStorage.setItem('adminToken', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminToken');
  };

  const handleSave = async (data) => {
    try {
      const response = await fetch('/.netlify/functions/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setNodesData(data);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  if (!nodesData) {
    return <div>Loading...</div>;
  }

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
            <div className="admin-overlay">
              <AdminPanel onSave={handleSave} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;

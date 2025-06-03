import React, { useState, useEffect } from 'react';
import NodeGraph from './components/NodeGraph';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [nodesData, setNodesData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);

    // Load initial data
    fetch('/data/nodes.json')
      .then(res => res.json())
      .then(data => setNodesData(data))
      .catch(error => {
        console.error('Error loading data:', error);
        alert('Failed to load data. Please try refreshing the page.');
      });
  }, []);

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

  const handleClosePanel = () => {
    setShowAdminPanel(false);
  };

  if (!nodesData) return <div>Loading...</div>;

  return (
    <div className="app">
      <div className="header">
        <h1>Interactive Node Graph</h1>
        {isAdmin ? (
          <>
            <button onClick={() => setShowAdminPanel(!showAdminPanel)}>
              {showAdminPanel ? 'Close Admin Panel' : 'Open Admin Panel'}
            </button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => {
            const password = prompt('Enter admin password:');
            if (password === 'admin123') {
              localStorage.setItem('adminToken', 'admin123');
              setIsAdmin(true);
            } else {
              alert('Invalid password');
            }
          }}>Login as Admin</button>
        )}
      </div>

      {showAdminPanel && (
        <AdminPanel 
          onSave={handleSaveData} 
          onClose={handleClosePanel}
        />
      )}

      <NodeGraph data={nodesData} />
    </div>
  );
}

export default App;

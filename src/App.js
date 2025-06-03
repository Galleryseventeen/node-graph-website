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

    // Add Command+A shortcut
    const handleKeyDown = (e) => {
      if (e.key === 'a' && e.metaKey) {
        e.preventDefault();
        if (isAdmin) {
          setShowAdminPanel(!showAdminPanel);
        } else {
          const password = prompt('Enter admin password:');
          if (password === 'admin123') {
            localStorage.setItem('adminToken', 'admin123');
            setIsAdmin(true);
            setShowAdminPanel(true);
          } else {
            alert('Invalid password');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    setShowAdminPanel(false);
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
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search nodes..."
          className="search-input"
        />
      </div>

      <div className="graph-container">
        <NodeGraph data={nodesData} />
      </div>

      {showAdminPanel && (
        <div className="admin-panel-overlay">
          <AdminPanel 
            onSave={handleSaveData} 
            onClose={handleClosePanel}
          />
        </div>
      )}
    </div>
  );
}

export default App;

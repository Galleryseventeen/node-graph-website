import React, { useState, useEffect } from 'react';
import NodeGraph from './components/NodeGraph';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [nodesData, setNodesData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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

  // Check if user is admin
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);
  }, []);

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
        {isAdmin && (
          <div className="admin-overlay">
            <AdminPanel onSave={handleSave} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

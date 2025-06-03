import React, { useState, useEffect } from 'react';
import NodeGraph from './components/NodeGraph';
import './App.css';

function App() {
  const [nodesData, setNodesData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Load initial nodes data
    fetch('/data/nodes.json')
      .then(response => response.json())
      .then(data => setNodesData(data));
  }, []);

  // Admin authentication check (this will be implemented later)
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);
  }, []);

  if (!nodesData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Node Graph Explorer</h1>
      </header>
      <main>
        <NodeGraph data={nodesData} />
      </main>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import NodeGraph from './components/NodeGraph';
import './App.css';

function App() {
  const [nodesData, setNodesData] = useState(null);

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

  if (!nodesData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <main>
        <NodeGraph data={nodesData} />
      </main>
    </div>
  );
}

export default App;

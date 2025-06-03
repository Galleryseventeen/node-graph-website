import React, { useState, useEffect } from 'react';
import { Auth } from '@netlify/auth';

const AdminPanel = ({ onSave }) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [newNode, setNewNode] = useState({ name: '', type: 'child', parentId: '' });
  const [editingNode, setEditingNode] = useState(null);

  useEffect(() => {
    // Load existing nodes and links
    fetch('/data/nodes.json')
      .then(res => res.json())
      .then(data => {
        setNodes(data.nodes);
        setLinks(data.links);
      });
  }, []);

  const handleAddNode = () => {
    if (!newNode.name) return;

    const newNodeData = {
      id: Date.now().toString(),
      name: newNode.name,
      type: newNode.type,
      parentId: newNode.parentId
    };

    setNodes([...nodes, newNodeData]);
    setNewNode({ name: '', type: 'child', parentId: '' });
  };

  const handleDeleteNode = (nodeId) => {
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    const updatedLinks = links.filter(link => link.source !== nodeId && link.target !== nodeId);
    setNodes(updatedNodes);
    setLinks(updatedLinks);
  };

  const handleSave = () => {
    onSave({
      nodes,
      links
    });
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      <div className="node-editor">
        <h3>Add New Node</h3>
        <input
          type="text"
          placeholder="Node name"
          value={newNode.name}
          onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
        />
        <select
          value={newNode.type}
          onChange={(e) => setNewNode({ ...newNode, type: e.target.value })}
        >
          <option value="root">Root</option>
          <option value="child">Child</option>
        </select>
        <select
          value={newNode.parentId}
          onChange={(e) => setNewNode({ ...newNode, parentId: e.target.value })}
        >
          <option value="">Select parent</option>
          {nodes.map(node => (
            <option key={node.id} value={node.id}>{node.name}</option>
          ))}
        </select>
        <button onClick={handleAddNode}>Add Node</button>
      </div>

      <div className="node-list">
        <h3>Existing Nodes</h3>
        <ul>
          {nodes.map(node => (
            <li key={node.id}>
              {node.name} ({node.type})
              <button onClick={() => handleDeleteNode(node.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleSave} className="save-button">Save Changes</button>
    </div>
  );
};

export default AdminPanel;

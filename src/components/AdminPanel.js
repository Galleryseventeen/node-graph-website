import React, { useState, useEffect } from 'react';

const AdminPanel = ({ onSave, onClose }) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [newNode, setNewNode] = useState({ 
    name: '', 
    type: 'child', 
    parentId: '',
    content: '',
    isLink: false
  });

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
      parentId: newNode.parentId,
      content: newNode.content,
      isLink: newNode.isLink
    };

    setNodes([...nodes, newNodeData]);
    setNewNode({ 
      name: '', 
      type: 'child', 
      parentId: '',
      content: '',
      isLink: false
    });
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
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
      
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
        <div className="content-editor">
          <input
            type="text"
            placeholder="Content (text or YouTube URL)"
            value={newNode.content}
            onChange={(e) => setNewNode({ ...newNode, content: e.target.value })}
          />
          <div className="link-toggle">
            <input
              type="checkbox"
              checked={newNode.isLink}
              onChange={(e) => setNewNode({ ...newNode, isLink: e.target.checked })}
            />
            <label>Is YouTube Link</label>
          </div>
        </div>
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

      <div className="admin-actions">
        <button onClick={handleSave} className="save-button">Save Changes</button>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default AdminPanel;

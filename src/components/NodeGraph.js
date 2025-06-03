import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const NodeGraph = ({ data }) => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);

  // Function to get node color based on type and depth
  const getNodeColor = (node, depth = 0) => {
    if (node.type === 'root') return '#6617CE';
    if (depth === 1) return '#1D201F';
    return '#909090';
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight - 100; // Subtract search bar height

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link')
      .style('stroke', '#999')
      .style('stroke-opacity', 0.6);

    // Create nodes
    const node = svg.selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node-group')
      .on('click', (event, d) => {
        setSelectedNode(d);
      });

    // Add drag behavior
    const drag = d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);

    node.call(drag);

    // Add circle to node group
    node.append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .style('fill', (d) => {
        const depth = d.parent ? (d.parent.depth || 0) + 1 : 0;
        return getNodeColor(d, depth);
      });

    // Add text labels to nodes
    node.append('text')
      .attr('dx', 12)
      .attr('dy', 4)
      .text(d => d.name)
      .style('fill', '#333');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Apply zoom behavior
    svg.call(zoom);

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => simulation.stop();
  }, [data]);

  const isUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <div className="node-graph-container">
      <svg ref={svgRef} width="100%" height="100%" />
      {selectedNode && (
        <div className="node-content">
          <h3>{selectedNode.name}</h3>
          {isUrl(selectedNode.content) ? (
            <div className="iframe-container">
              <iframe
                title={`Embedded content ${selectedNode.name}`}
                src={selectedNode.content}
                width="100%"
                height="400"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="content-container">
              <div className="content-text" dangerouslySetInnerHTML={{
                __html: selectedNode.content || 'Click to expand'
              }} />
            </div>
          )}
          <button onClick={() => setSelectedNode(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default NodeGraph;

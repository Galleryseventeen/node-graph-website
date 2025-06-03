import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const NodeGraph = ({ data }) => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

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
      .style('fill', '#69b3a2');

    // Add text labels to nodes
    node.append('text')
      .attr('dx', 12)
      .attr('dy', 4)
      .text(d => d.name);

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

  return (
    <div>
      <svg ref={svgRef} width={800} height={600} />
      {selectedNode && (
        <div className="node-content">
          <h3>{selectedNode.name}</h3>
          <p>{selectedNode.content || 'Click to expand'}</p>
          <button onClick={() => setSelectedNode(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default NodeGraph;

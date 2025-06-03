import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NodeGraph = ({ data }) => {
  const svgRef = useRef();

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
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .style('fill', '#69b3a2')
      .on('click', (event, d) => {
        // Handle node click
        console.log('Node clicked:', d);
      });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });

    return () => simulation.stop();
  }, [data]);

  return (
    <svg ref={svgRef} width={800} height={600} />
  );
};

export default NodeGraph;

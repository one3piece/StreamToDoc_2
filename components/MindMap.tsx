import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MindMapNode } from '../types';

interface MindMapProps {
  data: MindMapNode;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = 600;
    
    // Create hierarchy
    const root = d3.hierarchy(data);
    
    // Tree layout
    const treeLayout = d3.tree<MindMapNode>().size([height - 100, width - 200]);
    treeLayout(root);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(100, 50)");

    // Links
    svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x)
      )
      .attr("fill", "none")
      .attr("stroke", "#475569") // Slate 600
      .attr("stroke-width", 1.5);

    // Nodes
    const nodes = svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    // Node Circles
    nodes.append("circle")
      .attr("r", 6)
      .attr("fill", d => d.depth === 0 ? "#3b82f6" : d.depth === 1 ? "#a855f7" : "#10b981") // Blue, Purple, Emerald
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 2);

    // Node Labels
    nodes.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -12 : 12)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .attr("fill", "#e2e8f0")
      .attr("font-size", "12px")
      .attr("font-family", "sans-serif")
      .clone(true).lower() // Stroke for readability
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 3);

  }, [data]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden bg-slate-900 rounded-lg border border-slate-700 shadow-inner">
      <svg ref={svgRef} className="mx-auto" />
    </div>
  );
};

export default MindMap;
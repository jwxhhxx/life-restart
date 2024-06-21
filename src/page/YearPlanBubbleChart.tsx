// src/components/YearPlanBubbleChart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Plan } from '../util/types';

interface YearPlanBubbleChartProps {
  plans: Plan[];
}

const YearPlanBubbleChart: React.FC<YearPlanBubbleChartProps> = ({ plans }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 300;

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const sizeScale = d3.scaleLinear()
      .domain([0, d3.max(plans, d => d.description.length)!])
      .range([10, 30]);

    const fontSizeScale = d3.scaleLinear()
      .domain([0, d3.max(plans, d => d.description.length)!])
      .range([12, 24]);

    const fontWeightScale = d3.scaleLinear()
      .domain([0, d3.max(plans, d => d.description.length)!])
      .range([300, 700]);

    const nodes = plans.map(plan => ({
      ...plan,
      x: Math.random() * width,
      y: Math.random() * height
    }));

    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(5))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d:any) => sizeScale(d.description.length) + 5))
      .on('tick', () => {
        labels.attr('x', d => d.x!)
          .attr('y', d => d.y!);
      });

    const labels = svg.selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('x', d => d.x!)
      .attr('y', d => d.y!)
      .style('font-size', d => fontSizeScale(d.description.length) + 'px')
      .style('font-weight', d => fontWeightScale(d.description.length))
      .style('fill', (d, i) => colorScale(i.toString()))
      .text(d => d.title);
  }, [plans]);

  return <svg ref={svgRef} width={800} height={300}></svg>;
};

export default YearPlanBubbleChart;

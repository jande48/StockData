import '../../App.css'
import 'react-datepicker/dist/react-datepicker.css'
import { scaleLinear, scaleBand, scalePoint } from 'd3-scale'
import { select } from 'd3-selection'
import * as d3 from "d3";

export function createEarningsChart(data,earningsChartNode) {
    // https://www.youtube.com/watch?v=UDDGcgxficY 
    // stopped video at 3:41
    // https://observablehq.com/d/8974f775c6a0ae5d
    const svg = select(earningsChartNode.current);
    svg.selectAll("g").remove()
    const margin = ({top: 30, right: 30, bottom: 50, left: 40})
    const parseDate = d3.utcParse("%Y-%m-%d")
    const xLabel = 'Fiscal Period';
    const yLabel = 'Earnings Per Share'
    const width = 700;
    const height = 350;
    svg.attr("viewBox", [0, 0, width, height])
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const yScale = scaleLinear()
        .domain([d3.min(data,d => Math.min(d.consensusEPS,d.actualEPS)),d3.max(data,d => Math.max(d.consensusEPS,d.actualEPS))])
        .range([innerHeight,0])

    const yAxis = d3.axisLeft(yScale)

    const xScale = scaleBand()
        .domain(data.map(d => d.fiscalPeriod))
        .range([0,innerWidth])
        
    
    const xAxis = d3.axisBottom(xScale);

    const g = svg.append('g')
        .attr('transform',`translate(${margin.left},${margin.top})`);

    g.append('g').call(d3.axisLeft(yScale))
        .select(".domain").remove();
    g.append('g').call(d3.axisBottom(xScale))
        .attr('transform',`translate(0,${innerHeight})`)
        .select(".domain").remove();

    g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => ((xScale.bandwidth()/2)+xScale(d.fiscalPeriod)))
            .attr('cy', d => yScale(d.consensusEPS))
            .attr('r',30)
            .attr('fill','green')
            .attr('width', xScale.bandwidth())
        
    return svg.node();

}
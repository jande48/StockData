import '../../App.css'
import 'react-datepicker/dist/react-datepicker.css'
import * as d3 from "d3"
import {
    select,
    csv,
    scaleLinear,
    scaleBand,
    scaleTime,
    extent,
    axisLeft,
    axisBottom,
    line,
    curveBasis,
    curveLinear
  } from 'd3';

export function createStockPriceLineChart(data,stockPriceLineChartNode) {
    console.log(data)
    const svg = select(stockPriceLineChartNode.current);
    svg.selectAll("g").remove()

    const height = 350;
    const width = 700;
    //const margin = ({top: 20, right: 30, bottom: 30, left: 80})

    const margin = ({top: 50, right: 30, bottom: 50, left: 40})
    const parseDate = d3.utcParse("%Y-%m-%d")
    const x = scaleBand()
        .domain(d3.utcDay
            .range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
            .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
        .range([margin.left, width - margin.right])
        .padding(0.2)

    
    const y = scaleLinear()
        .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
        .rangeRound([height - margin.bottom, margin.top])

    

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickValues(d3.utcMonday
                .every(data.length > 2 ? (data.length > 15 ? 4 : 2) : 1)
                .range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
            .tickFormat(d3.utcFormat("%-m/%-d")))
        .call(g => g.select(".domain").remove())
    

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y)
            .tickFormat(d3.format("$~f"))
            .tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
        .call(g => g.selectAll(".tick line").clone()
            .attr("stroke-opacity", 0)
            .attr("x2", width - margin.left - margin.right))
        .call(g => g.select(".domain").remove())

    svg.attr("viewBox", [0, 0, width, height])

    svg.append("g")
        .call(xAxis);
        
    svg.append("g")
        .call(yAxis);
    
    const g = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "black")
        .selectAll("g")
        .data(data)
        .join("g")
        // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);

    const lineGenerator = line()
        .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
        .y(d => y(d.close))
        .curve(curveLinear);

    g.append('path')
        .attr('class', 'line-path')
        .attr('d', lineGenerator(data))
        .attr('fill','none')
        .attr('stroke-width',10)

    return svg.node();
}
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

export function createStockPriceLineChart(data,stockPriceLineChartNode,displayPriceChart,displayEMA) {
    
    const svg = select(stockPriceLineChartNode.current);
    svg.selectAll("g").remove()

    const height = 350;
    const width = 700;
    //const margin = ({top: 20, right: 30, bottom: 30, left: 80})
    //const formatSecond = d3.timeFormat(":%S")
    function parseSec(date) {
        return new Date(date * 1000);
    }
    const parseDate = d3.utcParse("%Y-%m-%d")
    //new Date(secs * 1000);
    const margin = ({top: 10, right: 30, bottom: 5, left: 40})
    //const parseDate = d3.utcParse("%s")// d3.utcParse("%a %b %d %Y %X %LZ")// d3.utcParse("%Y-%m-%d")
    //console.log(parseDate((data[data.length - 1].date)) + 1)
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
    if (displayPriceChart) {
        svg.selectAll("g").selectAll(".candleStick").remove()

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
            .attr('id','lineChart')
            .attr('fill','none')
            .attr('stroke-width',3)
            .attr('stroke-linecap','round')
    }else{
        svg.selectAll("g").selectAll(".lineChart").remove()

        const g = svg.append("g")
            .attr("stroke-linecap", "round")
            .attr("stroke", "black")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);

        g.append("line")
            .attr("y1", d => y(d.low))
            .attr("y2", d => y(d.high));

        g.append("line")
            .attr("y1", d => y(d.open))
            .attr("y2", d => y(d.close))
            .attr("id","candleStick")
            .attr("stroke-width", x.bandwidth())
            .attr("stroke", d => d.open > d.close ? d3.schemeSet1[0]
                : d.close > d.open ? d3.schemeSet1[2]
                : d3.schemeSet1[8]);
    }

    if (displayEMA) {
        const gEMA = svg.append("g")
            .attr("stroke-linecap", "round")
            .attr("stroke", "blue")
            .selectAll("g")
            .data(data)
            .join("g")
            // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);

        const lineGeneratorEMA = line()
            .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            .y(d => y(d.ema))
            .curve(curveLinear);

        gEMA.append('path')
            .attr('class', 'line-path')
            .attr('d', lineGeneratorEMA(data))
            .attr('id','ema')
            .attr('fill','none')
            .attr('stroke-width',3)
            .attr('stroke-linecap','round')
    }
    
    //     .on('mouseover', function (d, i) {
    //         let hoverOverString = 'Date: '+d.date.toString();//(Math.round((d.value / d.data.all) * 100)).toString() + '%';
    //         tooltip.html(d)  
    //             .style("left", (d3.event.pageX) + "px")     
    //             .style("top", (d3.event.pageY - 28) + "px");
            
    //         div.html(hoverOverString)
    //              .style("left", (10) + "px")
    //              .style("top", (15) + "px");
    //     })
    //    .on('mouseout', function (d, i) {
    //     d3.select(svg).transition()
    //          .duration('50')
    //          .attr('opacity', '1');
    //     div.transition()
    //          .duration('50')
    //          .style("opacity", 0);
    //     });

    // const g2 = svg.append("g")
    //     .attr("stroke-linecap", "round")
    //     .attr("stroke", "red")
    //     .selectAll("g")
    //     .data(data)
    //     .join("g")
    //     // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
    
    // const lineGenerator2 = line()
    //     .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
    //     .y(d => y(d.rsi))
    //     .curve(curveLinear);

    // g2.append('path')
    //     .attr('class', 'line-path')
    //     .attr('d', lineGenerator2(data))
    //     .attr('fill','none')
    //     .attr('stroke-width',5)
    return svg.node();
}
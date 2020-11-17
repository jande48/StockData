import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import {Header, Grid, Button} from 'semantic-ui-react'
import { fetchEarningsData } from '../redux'
import '../App.css'
import * as d3 from 'd3'
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

function EarningContainer (props) {
    const earningsChartNode = useRef(null);

    useEffect(() => {

        props.fetchEarningsData(String(props.tickers))

        }, [props.tickers])


    function createEarningsChart(data) {
        // https://www.youtube.com/watch?v=UDDGcgxficY 
        // stopped video at 3:41
        // https://observablehq.com/d/8974f775c6a0ae5d

        function findMinMax(FinData) {
            var min = FinData[0]['actualEPS']
            var max = FinData[0]['actualEPS']
            for (var i = 0; i < FinData.length; i++) {
                if (FinData[i]['actualEPS'] !='undefined'  && FinData[i]['consensusEPS'] != 'undefined') {
                    if (FinData[i]['actualEPS'] < min){
                        min = FinData[i]['actualEPS']
                    }
                    if (FinData[i]['consensusEPS'] < min){
                        min = FinData[i]['consensusEPS']
                    }
                    if (FinData[i]['actualEPS'] > max){
                        max = FinData[i]['actualEPS']
                    }
                    if (FinData[i]['consensusEPS'] > max){
                        max = FinData[i]['consensusEPS']
                    } 
                }
            }
            min = min - (min/7)
            max = max + (max/10)
            return [min,max]
        }

        const svg = select(earningsChartNode.current);
        svg.selectAll("g").remove()
        const margin = ({top: 30, right: 20, bottom: 50, left: 40})
        const parseDate = d3.utcParse("%Y-%m-%d")
        const xLabel = 'Fiscal Period';
        const yLabel = 'Earnings Per Share'
        const width = 700;
        const height = 220;
        svg.attr("viewBox", [0, 0, width, height])
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
    
        const yScale = scaleLinear()
            .domain(findMinMax(data))
            //.domain([(d3.min(data,d => Math.min(d.consensusEPS,d.actualEPS))-d3.min(data,d => Math.min(d.consensusEPS,d.actualEPS))/5),d3.max(data,d => Math.max(d.consensusEPS,d.actualEPS))])
            .range([innerHeight,0])
    
        const yAxis = d3.axisLeft(yScale)
            
    
        const xScale = scaleBand()
            .domain(data.map(d => d.fiscalPeriod))
            .range([0,innerWidth])
            
        
        const xAxis = d3.axisBottom(xScale)
            
        const gActual = svg.append('g')
            .attr('transform',`translate(${margin.left},${margin.top})`);

        gActual.append('g').call(d3.axisLeft(yScale))
            .attr("class", "axisWhite")
            .select(".domain").remove();
        gActual.append('g').call(d3.axisBottom(xScale))
            .attr("class", "axisWhite")
            .attr('transform',`translate(0,${innerHeight})`)
            .select(".domain").remove();

        gActual.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', d => ((xScale.bandwidth()/2)+xScale(d.fiscalPeriod)))
                .attr('cy', d => yScale(d.actualEPS))
                .attr('r',20)
                .attr('fill','green')
                .attr('width', xScale.bandwidth())
                .style('opacity',1)

        const g = svg.append('g')
            .attr('transform',`translate(${margin.left},${margin.top})`);
    
        g.append('g').call(d3.axisLeft(yScale))
            .attr("class", "axisWhite")
            //.select(".domain").remove();
        g.append('g').call(d3.axisBottom(xScale))
            .attr("class", "axisWhite")
            .attr('transform',`translate(0,${innerHeight})`)
            //.select(".domain").remove();
    
        g.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', d => ((xScale.bandwidth()/2)+xScale(d.fiscalPeriod)))
                .attr('cy', d => yScale(d.consensusEPS))
                .attr('r',20)
                .attr('fill','green')
                .attr('width', xScale.bandwidth())
                .style('opacity',0.5)

        svg.append("text")
            .attr("class", "axisWhite")
            .attr("text-anchor", "middle")
            .attr("font-size",'10px')
            .style('fill','#e0e1e2')
            .attr('transform',`translate(10,${height/2}) rotate(-90)`)
            .text("Earnings Per Share ($)")

        var keysList = [{'name':'Actual EPS','color':'green'},{'name':'Expected EPS','color':'#0e4e0f'}]
        
        svg.selectAll("g").selectAll(".mydotsLeft").remove()
        svg.selectAll("g").selectAll(".mylabelsLeft").remove()

        const size = 10

        const mydotsLeft = svg.append("g")
            .selectAll("g")
            .data(keysList)
            .join('g')
            //.enter()
        mydotsLeft.append("rect")
            .attr('id','mydotsLeft')
            .attr("x", margin.left + 5)
            .attr("y", function(d,i){ return margin.top + 1 + i*10}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width",size)
            .attr("height", size/2)
            .style("fill", function(d){return d['color']})
            // Add one dot in the legend for each name.

        const mylabelsLeft = svg.append('g')
            .selectAll('g')
            .data(keysList)
            .join('g')

        mylabelsLeft.append("text")
            .attr('id','mylabelsLeft')
            .attr("x", margin.left + 20)
            .attr("y", function(d,i){ return margin.top + 4 + i*10 }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){return d['color']})
            .text(function(d){ return d['name']})
            .attr("text-anchor", "left")
            .attr("font-size",'10px')
            .style("alignment-baseline", "middle")
            
        return svg.node();
    
    }
    
    if (props.earningsData.length > 1) {
        createEarningsChart(props.earningsData)
    }
    
    return props.earningsLoading ? ( 


    <Header as='h3' inverted color="#e0e1e2" textAlign='center'>Loading Earnings</Header>
  ) : props.earningsError ? (
    <h2><Header as='h2' textAlign='center' inverted color="#e0e1e2">Whoops. We can't get earnings info now.</Header></h2>
  ) :  (
    <div>
        

        <React.Fragment>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column>
                    <svg ref={earningsChartNode}></svg>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </React.Fragment>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    earningsData: state.stockDataFromRootReducer.earningsData,
    earningsError: state.stockDataFromRootReducer.earningsError,
    earningsData: state.stockDataFromRootReducer.earningsData,
    EarningLoading: state.stockDataFromRootReducer.earningLoading,
    startDate: state.datesFromRootReducer.startDate,
    tickers: state.tickersFromRootReducer.tickers,
  }
}
const mapDispatchToProps = dispatch => {
    return {
      fetchEarningsData: (ticker) => dispatch(fetchEarningsData(ticker)),
    }
  }
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EarningContainer)



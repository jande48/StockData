
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
    transition,
    curveLinear,
  } from 'd3';


export function createLoadingSpinnerChart(loadingSpinnerNode, width, height, margin) {
    const data = [{'date':'2020-07-29'},{'date':'2020-07-30'},{'date':'2020-07-31'},{'date':'2020-08-02'},{'date':'2020-08-03'}]
    const parseDate = d3.utcParse("%Y-%m-%d")
    const svg = select(loadingSpinnerNode.current);
      svg.selectAll("g").remove()
  
      const x = scaleBand()
        .range([margin.left, width - margin.right])
        .padding(0.2)

      var y = scaleLinear()
          //.domain(findMixMaxObjects(objectList,'axisLeft'))
          //.domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
          .rangeRound([height - margin.bottom, margin.top])
              //d3.min(data, d => d.low), d3.max(data, d => d.high

      const xAxis = g => g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .attr('class','axisWhite')
          .call(d3.axisBottom(x)
            .tickValues(d3.utcMonday
              .every(data.length > 2 ? (data.length > 250 ? 8 : (data.length > 150 ? 4 : (data.length > 80 ? 2 : 1))) : 1)
            .range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
          .tickFormat(d3.utcFormat("")))

      const yAxis = g => g
          .attr("transform", `translate(${margin.left},0)`)
          .attr('class','axisWhite')
          .call(d3.axisLeft(y))
          .call(g => g.selectAll(".tick line").remove())
          .call(g => g.selectAll("text").remove())
          //     .attr("stroke-opacity", 0)
          //     .attr("x2", width - margin.left - margin.right))
          //.call(g => g.select(".domain").remove())
      
      svg.attr("viewBox", [0, 0, width, height])

      svg.append("g")
          .call(xAxis);
          
      svg.append("g")
          .call(yAxis)
          
      // svg.append('g')
      //     .attr("stroke-linecap", "round")
      //     .attr("stroke",  '#1b1c1d')
      //     .selectAll("g")
      //     .data(data)
      //     .join("g")
      // main circle
      const CX = (width) / 2;
      const CY = (height-margin.bottom-margin.top) / 2;
      const R = 12;
      // little circles
      const r = 1.2;

      // degree - radian conversion
      function radian(degree) {
        return degree * Math.PI / 180;
      }
      // parametric equation of a circle is : x=cx+r*cos(t) and y=cy+r*sin(t)
      function xSpinner(radian) {
        return CX + R * Math.cos(radian);
      }
      function ySpinner(radian) {
        return CY + R * Math.sin(radian);
      }

      // root svg
      // const svg = d3
      //   .select("body")
      //   .append("svg")
      //   .attr("width", margin.width)
      //   .attr("height", margin.height)
      //   .style("background-color", "lightblue")
      //   .append("g")
      //   .attr("transform", "translate(" + margin.left + "," + margin.left + ")");

      // g and rect are useless : just for showing element g
      // const justForShowing_g = svg
      //   .append("rect")
      //   .style("fill", "lightgrey")
      //   .attr("width", WIDTH)
      //   .attr("height", HEIGHT);

      // main circle : just for explanation purpose
      // uncomment if needed
      /*
      const mainCircle = svg
        .append("circle")
        .attr("id", "main")
        .attr("cx", CX)
        .attr("cy", CY)
        .attr("r", R)
        .style("stroke", "red")
        .style("fill", "none");
      */

      // little circles
      // 10 equal sectors for 10 points on the main circle
      const SECTORS = 10; // number of sectors
      const SECTOR = 360 / SECTORS; // sector in degree: each equal
      let anglesList = [];

      for (let index = 0; index < SECTORS; index++) {
        anglesList.push(radian(index * SECTOR));
      }
      const MAX = anglesList[SECTORS - 1];

      // opacity
      function getOpacity(datum) {
        return Number((datum / MAX).toFixed(1));
      }

      // little circle radius
      function getRadius(datum) {
        return Number(r + r * (datum / MAX).toFixed(1));
      }

      function update(dataset) {
        let littleCircle = svg.selectAll("#little").data(dataset);
        // const g = svg.append("g")
        //   .selectAll("g")
        //   .data(dataset)
        //   .join("g")

        // UPDATE
        // Update old elements as needed.

        littleCircle
          .attr("r", function(d) {
            return getRadius(d);
          })
          .style("opacity", function(d) {
            return getOpacity(d);
          });

        // ENTER
        // Create new elements as needed.
        littleCircle
          .enter()
          .append("circle")
          .attr("id", "little")
          .attr("fill", "green")
          .attr("cx", function(d) {
            return xSpinner(d);
          })
          .attr("cy", function(d) {
            return ySpinner(d);
          })
          .attr("r", function(d) {
            return getRadius(d);
          })
          .style("opacity", function(d) {
            return getOpacity(d);
          });

          // EXIT
        // Remove old elements as needed.
        //littleCircle.exit().remove();
      
        
      }

      update(anglesList);

      function arrayRotate(arr, count) {
        count -= arr.length * Math.floor(count / arr.length);
        arr.push.apply(arr, arr.splice(0, count));
        return arr;
      }

      // cyclic circular permutation
      d3.interval(function() {
        anglesList = arrayRotate(anglesList.slice(), -1);
        update(anglesList);
      }, 350);

    return svg.node();
  }
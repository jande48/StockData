import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { fetchStockData } from '../redux'
import { createVolumeBarChart } from './charts/volumeBarChart.js'
import { fetchTrendData, displaySMA, nForSMA, displayEMA, displayMACD, nSlowForMACD, nFastForMACD } from '../redux';
import '../App.css'
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

function LineCandleGraphContainer (props) {

    const stockPriceLineChartNode = useRef(null);
    const showVolumeNode = useRef(null);
    const momentumIndicatorsChartNode = useRef(null);

    function convertDatesToString(initialDate) {
		const convertedDate = String(initialDate.getFullYear())+"-"+String(initialDate.getMonth() + 1)+"-"+String(initialDate.getDate())
		return convertedDate
	}
  useEffect(() => {
    const SMAp = {'displaySMA':props.displaySMA,'nForSMA':props.nForSMA}
    const EMAp = {'displayEMA':props.displayEMA,'nForEMA':props.nForEMA}
    const MACDp = {'displayMACD':props.displayMACD,'nFastForMACD':props.nFastForMACD,'nSlowForMACD':props.nSlowForMACD}
    
    props.fetchStockData(String(props.tickers+"/"+convertDatesToString(props.startDate)+"/"+convertDatesToString(props.endDate)))
    props.fetchTrendData(JSON.stringify([props.stockData,SMAp,EMAp,MACDp]))
    // if (props.stockData.length > 1) {
    //   createStockPriceLineChart(stockPriceLineChartNode)
    // }  
  }, [props.tickers,props.startDate,props.endDate,props.displaySMA,props.nForSMA,props.displayEMA,props.nForEMA,props.displayMACD,props.nFastForMACD,props.nSlowForMACD])

  if (props.stockData.length > 1) {
    createStockPriceLineChart(stockPriceLineChartNode)
    createVolumeBarChart(props.stockData,showVolumeNode)
    //createMomentumIndicatorsChartFunction(stockData,momentumIndicatorsChartNode)
    }

    function createStockPriceLineChart(stockPriceLineChartNode) {
        const data = props.stockData
        const trendData = props.trendData
        // var min = 0
            // var max = 0
            // //console.log(displayEMA)
            // for (var i = 0; i < data.length; i++) {
            //     if (data[i]['close'] < min) {
            //         min = data[i]['close']
            //     }
            //     if (data[i]['close'] > max) {
            //         max = data[i]['close']
            //     }
            //     if (displayEMA) {
            //         if (data[i]['ema'] < min) {
            //             min = data[i]['ema']
            //         }
            //         if (data[i]['ema'] > max) {
            //             max = data[i]['ema']
            //         }
            //     }
            //     if (displayAIdown) {
                   
            //         if (data[i]['AIdown'] < min) {
            //             min = data[i]['AIdown']
            //         }
            //         if (data[i]['AIdown'] > max) {
            //             max = data[i]['AIdown']
            //         }
            //     }
        
                
            //     if (displayAIup) {
            //         if (data[i]['AIup'] < min) {
            //             min = data[i]['AIup']
            //         }
            //         if (data[i]['AIupuo'] > max) {
            //             max = data[i]['AIup']
            //         }
            //     }
            //     if (displayIchimuku) {
            //         if (data[i]['ichimoku'] < min) {
            //             min = data[i]['ichimoku']
            //         }
            //         if (data[i]['ichimoku'] > max) {
            //             max = data[i]['ichimoku']
            //         }
            //     }
            //     if (displayDPO) {
            //         if (data[i]['dpo'] < min) {
            //             min = data[i]['dpo']
            //         }
            //         if (data[i]['dpo'] > max) {
            //             max = data[i]['dpo']
            //         }
            //     }
            //     if (displayCCI) {
            //         if (data[i]['cci'] < min) {
            //             min = data[i]['cci']
            //         }
            //         if (data[i]['cci'] > max) {
            //             max = data[i]['cci']
            //         }
            //     }
            //     if (displaySMA) {
            //         if (data[i]['sma'] < min) {
            //             min = data[i]['sma']
            //         }
            //         if (data[i]['sma'] > max) {
            //             max = data[i]['sma']
            //         }
            //     }
            //     if (displayMACD) {
            //         if (data[i]['macd'] < min) {
            //             min = data[i]['macd']
            //         }
            //         if (data[i]['macd'] > max) {
            //             max = data[i]['macd']
            //         }
            //     }
            //     if (displayMACDsignal) {
            //         if (data[i]['macdSignal'] < min) {
            //             min = data[i]['macdSignal']
            //         }
            //         if (data[i]['macdSignal'] > max) {
            //             max = data[i]['macdSignal']
            //         }
            //     }
            //     if (displayADX) {
            //         if (data[i]['adx'] < min) {
            //             min = data[i]['adx']
            //         }
            //         if (data[i]['adx'] > max) {
            //             max = data[i]['adx']
            //         }
            //     }
            //     if (displayADXpos) {
            //         if (data[i]['adxPositive'] < min) {
            //             min = data[i]['adxPositive']
            //         }
            //         if (data[i]['adxPositive'] > max) {
            //             max = data[i]['adxPositive']
            //         }
            //     }
            //     if (displayADXneg) {
            //         if (data[i]['adxNegative'] < min) {
            //             min = data[i]['adxNegative']
            //         }
            //         if (data[i]['adxNegative'] > max) {
            //             max = data[i]['adxNegative']
            //         }
            //     }
            //     if (displayVIpos) {
            //         if (data[i]['VIpositive'] < min) {
            //             min = data[i]['VIpositive']
            //         }
            //         if (data[i]['VIpositive'] > max) {
            //             max = data[i]['VIpositive']
            //         }
            //     }
            //     if (displayVIneg) {
            //         if (data[i]['VInegative'] < min) {
            //             min = data[i]['VInegative']
            //         }
            //         if (data[i]['VInegative'] > max) {
            //             max = data[i]['VInegative']
            //         }
            //     }
            //     if (displayTRIX) {
            //         if (data[i]['trix'] < min) {
            //             min = data[i]['trix']
            //         }
            //         if (data[i]['trix'] > max) {
            //             max = data[i]['trix']
            //         }
            //     }
            //     if (displayMassIndex) {
            //         if (data[i]['massIndex'] < min) {
            //             min = data[i]['massIndex']
            //         }
            //         if (data[i]['massIndex'] > max) {
            //             max = data[i]['massIndex']
            //         }
            //     }
            // }
            // if (min == 0 && max == 0) {
            //     max = 80
            // }
        
            const svg = select(stockPriceLineChartNode.current);
            svg.selectAll("g").remove()
        
            const height = 220;
            const width = 700;
            //const margin = ({top: 20, right: 30, bottom: 30, left: 80})
            //const formatSecond = d3.timeFormat(":%S")
            function parseSec(date) {
                return new Date(date * 1000);
            }
            const parseDate = d3.utcParse("%Y-%m-%d")
            //new Date(secs * 1000);
            const margin = ({top: 1, right: 30, bottom: 20, left: 40})

            const x = scaleBand()
                .domain(d3.utcDay
                    .range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
                    .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
                .range([margin.left, width - margin.right])
                .padding(0.2)
        
            var y = scaleLinear()
                //.domain([min,max])
                .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
                .rangeRound([height - margin.bottom, margin.top])
                    //d3.min(data, d => d.low), d3.max(data, d => d.high
            
            
            
        
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
        
    
            if (props.displayLine) {
                
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
                    .attr('stroke-width',2)
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
        
            if (props.displaySMA) {
                const gSMA = svg.append("g")
                    .attr("stroke-linecap", "round")
                    .attr("stroke", "green")
                    .selectAll("g")
                    .data(trendData)
                    .join("g")
                    // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
                const lineGeneratorSMA = line()
                    .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
                    .y(d => y(d.sma))
                    .curve(curveLinear);
        
                gSMA.append('path')
                    .attr('class', 'line-path')
                    .attr('d', lineGeneratorSMA(trendData))
                    .attr('id','sma')
                    .attr('fill','none')
                    .attr('stroke-width',2)
                    .attr('stroke-linecap','round')
            }else{
                svg.selectAll("g").selectAll(".sma").remove()
            }
            // if (props.displayMACD) {
            //     const gMACD = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "blue")
            //         .selectAll("g")
            //         .data(trendData)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorMACD = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.macd))
            //         .curve(curveLinear);
        
            //     gMACD.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorMACD(trendData))
            //         .attr('id','macd')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".macd").remove()
            // }
            // if (displayMACDsignal) {
            //     const gMACDsignal = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "yellow")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorMACDsignal = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.macdSignal))
            //         .curve(curveLinear);
        
            //     gMACDsignal.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorMACDsignal(data))
            //         .attr('id','macdSignal')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".macdSignal").remove()
            // }
            // if (displayAIdown) {
            //     const gAIdown = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "green")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorAIdown = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.AIdown))
            //         .curve(curveLinear);
        
            //     gAIdown.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorAIdown(data))
            //         .attr('id','AIdown')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".AIdown").remove()
            // }
            // if (displayAIup) {
            //     const gAIup = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "lightgreen")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorAIup = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.AIup))
            //         .curve(curveLinear);
        
            //     gAIup.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorAIup(data))
            //         .attr('id','AIup')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".AIup").remove()
            // }
            // if (displayIchimuku) {
            //     const gIchimuku = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "lightblue")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorIchimuku = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.ichimoku))
            //         .curve(curveLinear);
        
            //     gIchimuku.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorIchimuku(data))
            //         .attr('id','Ichimuku')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".Ichimuku").remove()
            // }
            // if (displayDPO) {
            //     const gDPO = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "red")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorDPO = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.dpo))
            //         .curve(curveLinear);
        
            //     gDPO.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorDPO(data))
            //         .attr('id','dpo')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".dpo").remove()
            // }
            // if (displayCCI) {
            //     const gCCI = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "pink")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorCCI = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.cci))
            //         .curve(curveLinear);
        
            //     gCCI.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorCCI(data))
            //         .attr('id','cci')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".cci").remove()
            // }
            // if (displaySMA) {
            //     const gSMA = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "purple")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorSMA = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.sma))
            //         .curve(curveLinear);
        
            //     gSMA.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorSMA(data))
            //         .attr('id','sma')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".sma").remove()
            // }
            // if (displayADX) {
            //     const gADX = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "orange")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorADX = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.adx))
            //         .curve(curveLinear);
        
            //     gADX.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorADX(data))
            //         .attr('id','adx')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".adx").remove()
            // }
            // if (displayADXpos) {
            //     const gADXpos = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "lightorange")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorADXpos = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.adxPositive))
            //         .curve(curveLinear);
        
            //     gADXpos.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorADXpos(data))
            //         .attr('id','adxPos')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".adxPos").remove()
            // }
            // if (displayADXneg) {
            //     const gADXneg = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "darkorange")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorADXneg = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.adxNegative))
            //         .curve(curveLinear);
        
            //     gADXneg.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorADXneg(data))
            //         .attr('id','adxNeg')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".adxNeg").remove()
            // }
            // if (displayVIneg) {
            //     const gVIneg = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "steelblue")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorVIneg = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.VInegative))
            //         .curve(curveLinear);
        
            //     gVIneg.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorVIneg(data))
            //         .attr('id','VIneg')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".VIneg").remove()
            // }
            // if (displayVIpos) {
            //     const gVIpos = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "rgb(12,240,233)")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorVIpos = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.VIpositive))
            //         .curve(curveLinear);
        
            //     gVIpos.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorVIpos(data))
            //         .attr('id','VIpos')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".VIpos").remove()
            // }
            // if (displayTRIX) {
            //     const gTRIX = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "rgba(198, 45, 205, 0.8)")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorTRIX = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.trix))
            //         .curve(curveLinear);
        
            //     gTRIX.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorTRIX(data))
            //         .attr('id','trix')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".trix").remove()
            // }
            // if (displayMassIndex) {
            //     const gMI = svg.append("g")
            //         .attr("stroke-linecap", "round")
            //         .attr("stroke", "darkred")
            //         .selectAll("g")
            //         .data(data)
            //         .join("g")
            //         // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);
        
            //     const lineGeneratorMI = line()
            //         .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
            //         .y(d => y(d.massIndex))
            //         .curve(curveLinear);
        
            //     gMI.append('path')
            //         .attr('class', 'line-path')
            //         .attr('d', lineGeneratorMI(data))
            //         .attr('id','mi')
            //         .attr('fill','none')
            //         .attr('stroke-width',3)
            //         .attr('stroke-linecap','round')
            // }else{
            //     svg.selectAll("g").selectAll(".mi").remove()
            // }
        
        
        // displayIchimuku,displayDPO,displayCCI,displaySMA,displayMACD,displayMACDsignal,displayADX,displayADXpos,displayADXneg,displayVIpos,displayVIneg,displayTRIX,displayMassIndex
        //   
          return svg.node();
        }

  return props.stockData.loading ? (


    <h2>Loading</h2>
  ) : props.stockData.error ? (
    <h2>{props.stockData.error}</h2>
  ) : (
    <div>
        <React.Fragment>
            <svg ref={stockPriceLineChartNode}></svg>
        </React.Fragment>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    tickers: state.tickersFromRootReducer.tickers,
    startDate: state.datesFromRootReducer.startDate,
    endDate: state.datesFromRootReducer.endDate,
    stockData: state.stockDataFromRootReducer.stockData,
    fetchStockData: state.stockDataFromRootReducer.fetchStockData,
    displayLine: state.chartsFromRootReducer.displayLine,
    displaySMA: state.trendFromRootReducer.displaySMA,
    nForSMA: state.trendFromRootReducer.nForSMA,
    displayEMA: state.trendFromRootReducer.displayEMA,
    nForEMA: state.trendFromRootReducer.nForEMA,
    displayMACD: state.trendFromRootReducer.displayMACD,
    nSlowForMACD: state.trendFromRootReducer.nSlowForMACD,
    nFastForMACD: state.trendFromRootReducer.nFastForMACD,
    trendData: state.trendFromRootReducer.trendData

  }
}

const mapDispatchToProps = dispatch => {
  return {
    //requestAPIstockData: (APIstring) => dispatch(requestAPIstockData(APIstring)),
    fetchStockData: (APIstring) => dispatch(fetchStockData(APIstring)),
    fetchTrendData: (APIstring) => dispatch(fetchTrendData(APIstring))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LineCandleGraphContainer)



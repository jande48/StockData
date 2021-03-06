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



  

export function createMomentumIndicatorsChart(data,momentumIndicatorsChartNode,displayRSIcheckbox,displayTSIcheckbox,displayUOcheckbox,displayStochCheckbox,displayStochSignalCheckbox,displayWR,displayAO,displayKama,displayROC) {

    var min = 0
    var max = 0
    for (var i = 0; i < data.length; i++) {
        if (displayRSIcheckbox) {
            if (data[i]['rsi'] < min) {
                min = data[i]['rsi']
            }
            if (data[i]['rsi'] > max) {
                max = data[i]['rsi']
            }
        }
        if (displayTSIcheckbox) {
            console.log(data[i]['tsi'])
            if (data[i]['tsi'] < min) {
                min = data[i]['tsi']
                console.log(data[i]['tsi'])
            }
            if (data[i]['tsi'] > max) {
                max = data[i]['tsi']
            }
        }
        if (displayUOcheckbox) {
            if (data[i]['uo'] < min) {
                min = data[i]['uo']
            }
            if (data[i]['uo'] > max) {
                max = data[i]['uo']
            }
        }
        if (displayStochCheckbox) {
            if (data[i]['stoch'] < min) {
                min = data[i]['stoch']
            }
            if (data[i]['stoch'] > max) {
                max = data[i]['stoch']
            }
        }
        if (displayStochSignalCheckbox) {
            if (data[i]['stoch_signal'] < min) {
                min = data[i]['stoch_signal']
            }
            if (data[i]['stoch_signal'] > max) {
                max = data[i]['stoch_signal']
            }
        }
        if (displayWR) {
            if (data[i]['wr'] < min) {
                min = data[i]['wr']
            }
            if (data[i]['wr'] > max) {
                max = data[i]['wr']
            }
        }
        if (displayAO) {
            if (data[i]['ao'] < min) {
                min = data[i]['ao']
            }
            if (data[i]['ao'] > max) {
                max = data[i]['ao']
            }
        }
        if (displayKama) {
            if (data[i]['kama'] < min) {
                min = data[i]['kama']
            }
            if (data[i]['kama'] > max) {
                max = data[i]['kama']
            }
        }
        if (displayROC) {
            if (data[i]['roc'] < min) {
                min = data[i]['roc']
            }
            if (data[i]['roc'] > max) {
                max = data[i]['roc']
            }
        }
    }
    if (min == 0 && max == 0) {
        max = 80
    }
    
    // function min_max(data,displayRSIcheckbox,displayTSIcheckbox,displayUOcheckbox,displayStochCheckbox,displayStochSignalCheckbox)  {
    //     var min = 0
    //     var max = 0
    //     console.log(displayRSIcheckbox)
    //     console.log(displayTSIcheckbox)
    //     for (var i = 0; i < data.length; i++) {
    //         if (displayRSIcheckbox) {
    //             if (data[i]['rsi'] < min) {
    //                 min = data[i]['rsi']
    //             }
    //             if (data[i]['rsi'] > max) {
    //                 max = data[i]['rsi']
    //             }
    //         }
    //         if (displayTSIcheckbox) {
    //             console.log(data[i]['tsi'])
    //             if (data[i]['tsi'] < min) {
    //                 min = data[i]['tsi']
    //                 console.log(data[i]['tsi'])
    //             }
    //             if (data[i]['tsi'] > max) {
    //                 max = data[i]['tsi']
    //             }
    //         }
    //         if (displayUOcheckbox) {
    //             if (data[i]['uo'] < min) {
    //                 min = data[i]['uo']
    //             }
    //             if (data[i]['uo'] > max) {
    //                 max = data[i]['uo']
    //             }
    //         }
    //         if (displayStochCheckbox) {
    //             if (data[i]['stoch'] < min) {
    //                 min = data[i]['stoch']
    //             }
    //             if (data[i]['stoch'] > max) {
    //                 max = data[i]['stoch']
    //             }
    //         }
    //         if (displayStochSignalCheckbox) {
    //             if (data[i]['stoch_signal'] < min) {
    //                 min = data[i]['stoch_signal']
    //             }
    //             if (data[i]['stoch_signal'] > max) {
    //                 max = data[i]['stoch_signal']
    //             }
    //         }
    //     }
    //     if (min == 0 && max == 0) {
    //         max = 80
    //     }
    //     return [min,max]
    // }
            
    
    //console.log(data)


    const svg = select(momentumIndicatorsChartNode.current);
    svg.selectAll("g").remove()

    //console.log(displayRSIcheckbox)

    const height = 150;
    const width = 700;
    //const margin = ({top: 20, right: 30, bottom: 30, left: 80})

    const margin = ({top: 5, right: 30, bottom: 50, left: 40})
    const parseDate = d3.utcParse("%Y-%m-%d")
    
    const x = scaleBand()
        .domain(d3.utcDay
            .range(parseDate(data[0].date), +parseDate(data[data.length - 1].date) + 1)
            .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
        .range([margin.left, width - margin.right])
        .padding(0.2)

    var y = scaleLinear()
        //.domain([d3.min(data, d => d.rsi), d3.max(data, d => d.rsi)])
        .domain([min,max])
        .rangeRound([height - margin.bottom, margin.top])

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickValues(d3.utcMonday
                .every(data.length > 2 ? (data.length > 15 ? 4 : 2) : 1)
                .range(parseDate(data[0].date), parseDate(data[data.length - 1].date)))
            .tickFormat(d3.utcFormat("%-m/%-d")))
        .call(g => g.select(".domain").remove())

    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y)
            .tickFormat(d3.format("~f"))
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

    const gRSI = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "red")
        .selectAll("g")
        .data(data)
        .join("g")
        // .attr("transform", data => `translate(${(x(parseDate(data.date))+x.bandwidth()/2)},0)`);

    const lineGeneratorRSI = line()
        .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
        .y(d => y(d.rsi))
        .curve(curveLinear);

    if (displayRSIcheckbox) {
        gRSI.append('path')
        .attr('class', 'line-path')
        .attr("id", "rsi")
        .attr('d', lineGeneratorRSI(data))
        .attr('fill','none')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
    }else{
        svg.selectAll("g").selectAll(".rsi").remove()
    }

    const gTSI = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "blue")
        .selectAll("g")
        .data(data)
        .join("g")

    const lineGeneratorTSI = line()
        .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
        .y(d => y(d.tsi))
        .curve(curveLinear);

    if (displayTSIcheckbox) {
        gTSI.append('path')
        .attr('class', 'line-path')
        .attr("id", "tsi")
        .attr('d', lineGeneratorTSI(data))
        .attr('fill','none')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
    }else{
        svg.selectAll("g").selectAll(".tsi").remove()
    }

    const gUO = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "green")
        .selectAll("g")
        .data(data)
        .join("g")

    const lineGeneratorUO = line()
        .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
        .y(d => y(d.UO))
        .curve(curveLinear);

    if (displayUOcheckbox) {
        gUO.append('path')
        .attr('class', 'line-path')
        .attr("id", "uo")
        .attr('d', lineGeneratorUO(data))
        .attr('fill','none')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
    }else{
        svg.selectAll("g").selectAll(".uo").remove()
    }
    
    
    const gStoch = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "purple")
        .selectAll("g")
        .data(data)
        .join("g")

    const lineGeneratorStoch = line()
        .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
        .y(d => y(d.stoch))
        .curve(curveLinear);

    if (displayStochCheckbox) {
        gStoch.append('path')
        .attr('class', 'line-path')
        .attr("id", "stoch")
        .attr('d', lineGeneratorStoch(data))
        .attr('fill','none')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
    }else{
        svg.selectAll("g").selectAll(".stoch").remove()
    }

    
    const gStochSignal = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "yellow")
        .selectAll("g")
        .data(data)
        .join("g")

    const lineGeneratorStochSignal = line()
        .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
        .y(d => y(d.stoch_signal))
        .curve(curveLinear);

    if (displayStochSignalCheckbox) {
        gStochSignal.append('path')
        .attr('class', 'line-path')
        .attr("id", "stochSignal")
        .attr('d', lineGeneratorStochSignal(data))
        .attr('fill','none')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
    }else{
        svg.selectAll("g").selectAll(".stochSignal").remove()
    }

    const gWR = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "orange")
        .selectAll("g")
        .data(data)
        .join("g")

    const lineGeneratorWR = line()
        .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
        .y(d => y(d.wr))
        .curve(curveLinear);

    if (displayWR) {
        gWR.append('path')
        .attr('class', 'line-path')
        .attr("id", "wr")
        .attr('d', lineGeneratorWR(data))
        .attr('fill','none')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
    }else{
        svg.selectAll("g").selectAll(".wr").remove()
    }

    const gAO = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "pink")
        .selectAll("g")
        .data(data)
        .join("g")

    const lineGeneratorAO = line()
        .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
        .y(d => y(d.ao))
        .curve(curveLinear);

    if (displayAO) {
        gAO.append('path')
        .attr('class', 'line-path')
        .attr("id", "ao")
        .attr('d', lineGeneratorAO(data))
        .attr('fill','none')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
    }else{
        svg.selectAll("g").selectAll(".ao").remove()
    }

    const gKama = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "darkgreen")
        .selectAll("g")
        .data(data)
        .join("g")

    const lineGeneratorKama = line()
        .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
        .y(d => y(d.kama))
        .curve(curveLinear);

    if (displayKama) {
        gKama.append('path')
        .attr('class', 'line-path')
        .attr("id", "kama")
        .attr('d', lineGeneratorKama(data))
        .attr('fill','none')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
    }else{
        svg.selectAll("g").selectAll(".kama").remove()
    }

    const gROC = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke", "lightblue")
        .selectAll("g")
        .data(data)
        .join("g")

    const lineGeneratorROC = line()
        .x(d => (x(parseDate(d.date))+x.bandwidth()/2))
        .y(d => y(d.roc))
        .curve(curveLinear);

    if (displayROC) {
        gROC.append('path')
        .attr('class', 'line-path')
        .attr("id", "roc")
        .attr('d', lineGeneratorROC(data))
        .attr('fill','none')
        .attr('stroke-width',3)
        .attr('stroke-linecap','round')
    }else{
        svg.selectAll("g").selectAll(".roc").remove()
    }

    return svg.node();

}
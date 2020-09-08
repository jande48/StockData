const DUMMY_DATA = [
    { id: 'd1', region: 'USA', value: 10}
    { id: 'd2', region: 'India', value: 12}
    { id: 'd3', region: 'China', value: 11}
    { id: 'd4', region: 'Germany', value: 6}

];

const CHART_WIDTH = 600;
const CHART_HEIGHT = 400;
const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
const y = d3.scaleLinear().range([CHART_HEIGHT,0]);

const chartContainer = d3.select('svg')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT)
    x.domain(DUMMY_DATA.map(d => d.region));
    y.domain([0, d3.max(DUMMY_DATA, d => d.value)+3])

const chart = chartContainer.append('g')

chart
    .selectAll('.bar')
    .data(DUMMY_DATA)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('width', x.bandwidth())
    .attr('height', data => CHART_HEIGHT - y(data.value));
    .attr('x', data => x(data.region))
    .attr('y', data => y(data.value));

chart
    .selectAll('.label')
    .data(DUMMY_DATA)
    .enter()
    .append('text')
    .text(data => data.value)
    .attr('x', data => x(data.region) + x.bandwidth()/2)
    .attr('y', data => y(data.value)-20)
    .attr('text-anchor','middle')
    .classed('label', true);
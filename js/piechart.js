function piechart() {

  const povertyData = {
    'White': [
        { label: 'Less than 50 percent', value: 5785 },
      { label: '50 to 99 percent', value: 6013 },
      { label: '100 to 149 percent', value: 7298 },
      { label: '150 to 199 percent', value: 8099 },
      { label: '200 percent or more', value: 69803}],
    'Black or African American': [
      { label: 'Less than 50 percent', value: 2014 },
      { label: '50 to 99 percent', value: 2025 },
      { label: '100 to 149 percent', value: 1765 },
      { label: '150 to 199 percent', value: 1889 },
      { label: '200 percent or more', value: 9422}],
    'American Indian and Alaska Native': [
      { label: 'Less than 50 percent', value: 153 },
      { label: '50 to 99 percent', value: 193 },
      { label: '100 to 149 percent', value: 204 },
      { label: '150 to 199 percent', value: 121 },
      { label: '200 percent or more', value: 761}],
    'Asian': [
      { label: 'Less than 50 percent', value: 437 },
      { label: '50 to 99 percent', value: 339 },
      { label: '100 to 149 percent', value: 318 },
      { label: '150 to 199 percent', value: 380 },
      { label: '200 percent or more', value: 4904}],
    'Native Hawaiian and Other Pacific Islander': [
      { label: 'Less than 50 percent', value: 0 },
      { label: '50 to 99 percent', value: 27 },
      { label: '100 to 149 percent', value: 0 },
      { label: '150 to 199 percent', value: 0 },
      { label: '200 percent or more', value: 283}],
    'Some other race': [
      { label: 'Less than 50 percent', value: 102 },
      { label: '50 to 99 percent', value: 152 },
      { label: '100 to 149 percent', value: 172 },
      { label: '150 to 199 percent', value: 147 },
      { label: '200 percent or more', value: 1247}],
  };

  const povertyCategory = ['less than 50 percent', '50 to 99 percent', '100 to 149 percent',
    '150 to 199 percent', '200 percent and more']

  const raceData = [
    { label: 'White', value: 1500 },
    { label: 'Black or African American', value: 1350 },
    { label: 'American Indian and Alaska Native', value: 1250 },
    { label: 'Asian', value: 1250 },
    { label: 'Native Hawaiian and Other Pacific Islander', value: 650 },
    { label: 'Some other race', value: 250 }
  ];

  // Setup the SVG
  const svg = d3.select('#vis-svg'); // Select the existing SVG element

  // Pie chart setup
  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(100);

  // Positioning for the first pie chart
const firstChartX = 100; // X-coordinate for the first pie chart
const firstChartY = 200; // Y-coordinate for the first pie chart

// Positioning for the second pie chart
const secondChartX = 400; // X-coordinate for the second pie chart
const secondChartY = 200; // Y-coordinate for the second pie chart

  // population level Pie Chart
  const raceG = svg.select('#pie-chart-container')
  .attr('transform', `translate(${firstChartX}, ${firstChartY})`); // Select the first <g> element
  raceG.selectAll('.arc')
    .data(pie(raceData))
    .enter().append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => d3.schemeCategory10[i])
      .on('click', handleClick);

  function handleClick(d) {
    // Handle click event by updating the second pie chart
    const correspondingData = povertyData[d.data.label]; // Replace this with your own data retrieval logic
    updatePieChart('chartContainer2', correspondingData);
  }

  // Function to update the second pie chart
  function updatePieChart(containerId, newData) {
    // Select the second pie chart container's <g> element
    const svg = d3.select(`#${containerId}`);
    const chartG = svg.select('g');

    // Pie chart setup
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(100);

    // Update the data binding for the second pie chart
    const paths = chartG.selectAll('.arc')
        .data(pie(newData));

    // Remove old elements
    paths.exit().remove();

    // Append new elements
    paths.enter().append('path')
        .attr('class', 'arc')
        .attr('d', arc)
        .attr('fill', (d, i) => d3.schemeCategory10[i]);

    // Update existing elements
    paths.attr('d', arc)
        .attr('fill', (d, i) => d3.schemeCategory10[i]);
  }


// poverty by Race Pie Chart (Second Pie Chart)
const raceG2 = svg.select('#second-pie-chart-container') // Select the second <g> element
.attr('transform', `translate(${secondChartX}, ${secondChartY})`);// Adjust the translation as needed for the second chart
raceG2.selectAll('.arc')
  .data(pie(povertyData['White']))
  .enter().append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => d3.schemeCategory10[i % 10]);


  // Legend (for one chart, repeat for the other)
  const legend = svg.append('g')
    .attr('transform', 'translate(50, 20)');

  povertyCategory.forEach((data, index) => {
    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', index * 20)
      .attr('r', 5)
      .style('fill', d3.schemeCategory10[index]);

    legend.append('text')
      .attr('x', 20)
      .attr('y', index * 20)
      .text(data.label)
      .style('font-family', 'sans-serif')
      .style('font-size', '12px')
      .attr('alignment-baseline', 'middle');
  });


   // Legend for Population by Race Pie Chart
   const legend2 = svg.append("g").attr("transform", "translate(250, 20)"); // Adjust the translation as needed for the second legend

   raceData.forEach((data, index) => {
     legend2
       .append("circle")
       .attr("cx", 0)
       .attr("cy", index * 20)
       .attr("r", 5)
       .style("fill", d3.schemeCategory10[index]);
 
     legend2
       .append("text")
       .attr("x", 20)
       .attr("y", index * 20)
       .text(data.label)
       .style("font-family", "sans-serif")
       .style("font-size", "12px")
       .attr("alignment-baseline", "middle");
   });

}
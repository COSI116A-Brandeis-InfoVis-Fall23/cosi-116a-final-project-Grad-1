function piechart() {

  // this pie chart does not take csv file properly, always leads to failures;
  // Thus, we have hardcoded data right here.
  const povertyData = {
    'White': [
        { label: '<50%', value: 5785 },
      { label: '50%~99%', value: 6013 },
      { label: '100%~149%', value: 7298 },
      { label: '150%~199%', value: 8099 },
      { label: '>200%', value: 69803}],
    'Black or African American': [
      { label: '<50%', value: 2014 },
      { label: '50%~99%', value: 2025 },
      { label: '100%~149%', value: 1765 },
      { label: '150%~199%', value: 1889 },
      { label: '>200%', value: 9422}],
    'American Indian and Alaska Native': [
      { label: '<50%', value: 153 },
      { label: '50%~99%', value: 193 },
      { label: '100%~149%', value: 204 },
      { label: '150%~199%', value: 121 },
      { label: '>200%', value: 761}],
    'Asian': [
      { label: '<50%', value: 437 },
      { label: '50%~99%', value: 339 },
      { label: '100%~149%', value: 318 },
      { label: '150%~199%', value: 380 },
      { label: '>200%', value: 4904}],
    'Native Hawaiian and Other Pacific Islander': [
      { label: '<50%', value: 0 },
      { label: '50%~99%', value: 27 },
      { label: '100%~149%', value: 0 },
      { label: '150%~199%', value: 0 },
      { label: '>200%', value: 283}],
    'Some other race': [
      { label: '<50%', value: 102 },
      { label: '50%~99%', value: 152 },
      { label: '100%~149%', value: 172 },
      { label: '150%~199%', value: 147 },
      { label: '>200%', value: 1247}],
  };

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
      .attr('transform', `translate(${firstChartX}, ${firstChartY})`);

  raceG.selectAll('.arc')
      .data(pie(raceData))
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => d3.schemeCategory10[i])
      .attr('stroke', 'white')
      .on('click', handleClick);

  function handleClick(d) {
    console.log('Clicked!', d);

    const clickedRace = d.data.label;

    console.log('Clicked Race:', clickedRace);

    if (povertyData.hasOwnProperty(clickedRace)) {
      const clickedPovertyData = povertyData[clickedRace];
      console.log('Clicked Poverty Data:', clickedPovertyData);

      // Update the second pie chart with the poverty data for the clicked race
      updatePieChart('second-pie-chart-container', clickedPovertyData);

    } else {
      console.error('Invalid clicked race:', clickedRace);
    }

  }

  // Function to update the second pie chart
  function updatePieChart(containerId, newData) {
    console.log('Updating pie chart with data:', newData);

    // Filter out data points with a value of 0
    const filteredData = newData.filter(d => d.value !== 0);

    // Select the second pie chart container's <g> element
    const chartG = d3.select(`#${containerId}`);

    console.log('Selected <g> element:', chartG.node());

    // Pie chart setup
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(100);

    // Update the data binding for the second pie chart
    const paths = chartG.selectAll('.arc')
        .data(pie(filteredData));

    // Remove old elements
    paths.exit().remove();

    // Append new elements
    paths.enter().append('path')
        .attr('class', 'arc')
        .attr('d', arc)
        .attr('fill', (d, i) => d3.schemeCategory10[i])
        .attr('stroke', 'white');

    // Update existing elements
    paths.attr('d', arc)
        .attr('fill', (d, i) => d3.schemeCategory10[i])
        .attr('stroke', 'white');

    // Update text labels
    const labels = chartG.selectAll('text')
        .data(pie(filteredData));

    // Remove old text labels
    labels.exit().remove();

    // Update existing text labels
    labels.text(d => d.data.label)
        .attr('transform', d => {
          const centroid = arc.centroid(d);
          const x = centroid[0] + centroid[0] * (1.5);
          const y = centroid[1] + centroid[1] * (1.5);
          return `translate(${x}, ${y})`;
        });

    // Enter new text labels
    labels.enter().append('text')
        .text(d => d.data.label)
        .attr('transform', d => {
          const centroid = arc.centroid(d);
          const x = centroid[0] + centroid[0] * (1.5);
          const y = centroid[1] + centroid[1] * (1.5);
          return `translate(${x}, ${y})`;
        })
        .style('text-anchor', 'end')
        .style('font-size', '12px');

  }


  // poverty by Race Pie Chart (Second Pie Chart)
  const raceG2 = svg.select('#second-pie-chart-container')
      .attr('transform', `translate(${secondChartX}, ${secondChartY})`);

  raceG2.selectAll('.arc')
      .data(pie(povertyData['White']))
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
      .attr('stroke', 'white');

  raceG2.selectAll('text')
      .data(pie(povertyData['White']))
      .enter().append('text')
      .text(d => d.data.label)
      .attr('transform', d => {
        const centroid = arc.centroid(d);
        const x = centroid[0] + centroid[0] * (1.2);
        const y = centroid[1] + centroid[1] * (1.2);
        return `translate(${x}, ${y})`;
      })
      .style('text-anchor', 'end')
      .style('alignment-baseline', 'middle')
      .style('font-size', '12px');


   // Legend for population Pie Chart
  const legend2 = svg.append('g').attr("transform", "translate(0, -10)");

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
       .style("font-size", "12px");
   });

}
function piechart() {
  // Sample data - will replace this with our real data
  const educationData = [
    { label: "No High School", value: 8000 },
    { label: "High School", value: 3000 },
    { label: "Undergrad", value: 6000 },
    { label: "Graduate", value: 2000 },
  ];

  const raceData = [
    { label: "White", value: 1500 },
    { label: "Black", value: 1350 },
    { label: "Asian", value: 1250 },
    { label: "Hispanic", value: 1250 },
    { label: "Other", value: 650 },
  ];

  // Setup the SVG
  const svg = d3.select("#vis-svg"); // Select the existing SVG element

  // Pie chart setup
  const pie = d3.pie().value((d) => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(100);

  // Positioning for the first pie chart
  const firstChartX = 100; // X-coordinate for the first pie chart
  const firstChartY = 200; // Y-coordinate for the first pie chart

  // Positioning for the second pie chart
  const secondChartX = 400; // X-coordinate for the second pie chart
  const secondChartY = 200; // Y-coordinate for the second pie chart

  // Education Level Pie Chart
  const educationG = svg
    .select("#pie-chart-container")
    .attr("transform", `translate(${firstChartX}, ${firstChartY})`); // Select the first <g> element
  educationG
    .selectAll(".arc")
    .data(pie(educationData))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => d3.schemeCategory10[i]);

  // Population by Race Pie Chart (Second Pie Chart)
  const raceG2 = svg
    .select("#second-pie-chart-container") // Select the second <g> element
    .attr("transform", `translate(${secondChartX}, ${secondChartY})`); // Adjust the translation as needed for the second chart
  raceG2
    .selectAll(".arc")
    .data(pie(raceData))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);

  // Legend (for one chart, repeat for the other)
  const legend = svg.append("g").attr("transform", "translate(50, 20)");

  educationData.forEach((data, index) => {
    legend
      .append("circle")
      .attr("cx", 0)
      .attr("cy", index * 20)
      .attr("r", 5)
      .style("fill", d3.schemeCategory10[index]);

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", index * 20)
      .text(data.label)
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
  });
}

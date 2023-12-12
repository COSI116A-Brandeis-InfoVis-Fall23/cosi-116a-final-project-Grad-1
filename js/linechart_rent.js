function linechart_rent() {
  const yearData = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022];
  const values = [0.0, -1.2458577138872977, -1.8040316985686373, -0.9225681711658799, 
                  0.6200427174090102, 3.1908136379390313, 4.243029753737447, 5.294016154398191,
                  7.4555310022891215, 9.43364518437041, 12.096609387068803, 13.289413986750272];
  const width = 400,
    height = 400,
    margin = { top: 20, right: 20, bottom: 20, left: 20 };

  // Set up scales
  let xScale = d3.scaleLinear()
    .range([margin.left, width - margin.right])
    .domain([d3.min(yearData), d3.max(yearData)]); 
  let yScale = d3.scaleLinear()
    .range([height - margin.top, margin.bottom])
    .domain([d3.min(values), d3.max(values)]);

  // Create SVG element
  let svg = d3.select("#linechart_rent")
    .append("svg")
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(" "))
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create axes
  let xAxis = svg.append("g")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d"))); 

  let yAxis = svg.append("g")
    .call(d3.axisLeft(yScale))
    .attr("transform", "translate(" + margin.left + ",0)");

  // Line generator
  let line = d3.line()
    .x((d, i) => xScale(yearData[i]))
    .y(d => yScale(d));

  // Draw line and points
  svg.append("path")
    .attr('d', line(values))
    .attr('stroke', "black")
    .attr('stroke-width', "4px")
    .attr("fill", "none");

  let circles = svg.selectAll("circle")
    .data(values)
    .enter().append("circle")
    .attr("cx", (d, i) => xScale(yearData[i]))
    .attr("cy", d => yScale(d))
    .attr("r", 5)
    .style("fill", "black");

  // Add title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Yearly Data Representation");

  // Add horizontal grid
  svg.selectAll("horizontalGrid").data(yScale.ticks()).enter()
    .append("line")
    .attr("class", "horizontalGrid")
    .attr("x1", margin.left)
    .attr("x2", width)
    .attr("y1", function(d) { return yScale(d); })
    .attr("y2", function(d) { return yScale(d); })
    .attr("stroke", "rgba(0, 0, 0, 0.1)");

  // Define brush behavior
  const brush = d3.brush()
    .on("brush", highlight)
    .on("end", brushEnd)
    .extent([
      [margin.left, margin.top],
      [width - margin.right, height - margin.bottom]
    ]);

  svg.append("g")
    .attr("class", "brush")
    .call(brush);

    function linechart_income_highlight(selectedRaces, selectedYears) {
      if (!selectedYears.length) return;
    
      d3.select("#linechart_income").selectAll("circle")
        .style("fill", function(d, i) {
          const year = yearData[i]; 
          // Highlight in black, other keep its origin color
          if (selectedYears.includes(year)) {
            return "black"; 
          } else {
            return d3.select(this).style("fill"); 
          }
        });
    }
    

    function highlight() {
      if (!d3.event.selection) return;
      const [[x0, y0], [x1, y1]] = d3.event.selection;
      const selectedYearIndexes = [];
      resetPoints();
     // get selected year
      svg.selectAll("circle").classed("selected", function(d, i) {
        const cx = +d3.select(this).attr("cx");
        const cy = +d3.select(this).attr("cy");
        const isSelected = x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  
        if (isSelected) {
          selectedYearIndexes.push(i); // add index of selected year
        }
  
        return isSelected;
      }).filter(".selected").style("fill", "red");
  
      const selectedYears = selectedYearIndexes.map(i => yearData[i]); 
      linechart_income_highlight(selectedRaces, selectedYears); 
    }

  function brushEnd() {
    if (!d3.event.selection) return;
    svg.select(".brush").call(brush.move, null);
    linechart_income_highlight(selectedRaces, selectedYears); 
  }

  // Reset all points
  function resetPoints() {
    d3.select("#linechart_rent").selectAll("circle")
      .style("fill", "black")
      .classed("selected", false);

      d3.select("#linechart_income").selectAll("circle")
      .style("fill", function() {
        return d3.select(this).attr("data-original-color");
      })
      .classed("selected", false);
  selectedRaces = [];
  selectedYears = [null, null];
  }
}






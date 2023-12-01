
function linechart_rent() {
    const raceData = ["White", "Black or African American", 
          "American Indian and Alaska Native", "Asian", 
          "Native Hawaiian and Other Pacific Islander", "Some other race"];
    
    const colorData = [
      "#f5222d",
      "#fa8c16",
      "#a0d911",
      "#13c2c2",
      "#2f54eb",
      "grey",
    ];
  
    const yearData = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022];
    const width = 400,
      height = 400,
      margin = { top: 20, right: 20, bottom: 20, left: 20 };
  
    // Set up scales
    let xScale = d3.scaleLinear()
    .range([margin.left, width - margin.right])
    .domain([d3.min(yearData), d3.max(yearData)]); 
    let yScale = d3.scaleLinear().range([height - margin.top, margin.bottom]).domain([-10, 25]);
  
    // Load the real data from csv file
    d3.csv("../data/real_data/percentage_change_income.csv", function(error, data) {
      if (error) throw error;
  
      // Process data
      let processedData = raceData.map((race, index) => {
        return yearData.map(year => +data[index][year]);
      });
  
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
                    .attr("transform", "translate(" + margin.left + ", -12)")
                    .attr("font-size", ".4em");
  
      // Line generator
      let line = d3.line()
                  .x((d, i) => xScale(yearData[i]))
                  .y((d) => yScale(d));
  
      // Draw lines and points
      for (let i = 0; i < colorData.length; ++i) {
        svg.append("path")
          .attr('d', line(processedData[i]))
          .attr('stroke', colorData[i])
          .attr('stroke-width', "2px")
          .attr("fill", "none");
  
        // Draw points
        let circles = svg.selectAll(".dot-" + i)
          .data(processedData[i])
          .enter().append("circle")
          .attr("class", "dot-" + i)
          .attr("cx", (d, j) => xScale(yearData[j]))
          .attr("cy", (d) => yScale(d))
          .attr("r", 3)
          .style("fill", colorData[i]);
  
         circles.on("click", function(d) {
          let isSelected = d3.select(this).classed("selected");
          if (!isSelected) {
            resetPoints();
          }
          // Toggle the selection state of the clicked point
          d3.select(this).classed("selected", !isSelected)
                         .style("fill", isSelected ? colorData[i] : "black");
        });
  
        // Add legend
        svg.append("rect")
          .attr('x', 30)
          .attr('y', 10 + i * 10)
          .attr('width', "7px")
          .attr('height', "7px")
          .style('fill', colorData[i]);
  
        svg.append("text")
          .attr('x', 40)
          .attr('y', 16 + i * 10)
          .attr('font-size', "7px")
          .text(raceData[i]);
  
          // Add title
          svg.append("text")
         .attr("x", (width / 2))             
         .attr("y", 0 )
         .attr("text-anchor", "middle")  
         .style("font-size", "14px") 
         .text("Income change by race 2010-2022");

         // Add horizontal grid 
        svg.selectAll("horizontalGrid").data(yScale.ticks()).enter()
        .append("line")
        .attr("class", "horizontalGrid")
        .attr("x1", margin.left)
        .attr("x2", width)
        .attr("y1", function(d) { return yScale(d); })
        .attr("y2", function(d) { return yScale(d); })
        .attr("stroke", "rgba(0, 0, 0, 0.1)"); 

      }
  
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
            if (!selectedRaces.length || !selectedYears[0] || !selectedYears[1]) return;
          
            const [startYear, endYear] = selectedYears;
          
            selectedRaces.forEach(selectedRace => {
              const raceIndex = raceData.indexOf(selectedRace);
          
              d3.select("#linechart_income").selectAll(".dot-" + raceIndex)
                .classed("selected", function(d, i) {
                  const year = yearData[i];
                  return startYear <= year && year <= endYear;
                })
                .style("fill", function() {
                  return d3.select(this).classed("selected") ? "black" : colorData[raceIndex];
                });
            });
          }
          
        
        function highlight() {
          if (!d3.event.selection) return; 
          const [[x0, y0], [x1, y1]] = d3.event.selection;
          selectedYears = [xScale.invert(x0), xScale.invert(x1)];
          resetPoints();
          svg.selectAll("circle").classed("selected", function(d, i) {
            const cx = +d3.select(this).attr("cx");
            const cy = +d3.select(this).attr("cy");
            const isSelected = x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
            if (isSelected) {
              const raceIndex = parseInt(d3.select(this).attr("class").split("-")[1]);
              if (!selectedRaces.includes(raceData[raceIndex])) {
                selectedRaces.push(raceData[raceIndex]);
              }
            }
            return isSelected;
          }).filter(".selected").style("fill", "black");
          
    
          linechart_income_highlight(selectedRaces, selectedYears);
        }
  
      function brushEnd() {
        if (!d3.event.selection) return;
        svg.select(".brush").call(brush.move, null);
      }
  
      // Reset all points
      function resetPoints() {
        svg.selectAll("circle")
          .style("fill", function() {
            return colorData[parseInt(d3.select(this).attr("class").split("-")[1])];
          })
          .classed("selected", false);
      
        linechart_income_highlight(selectedRaces, selectedYears);
      }
  
    });
  }
  
function linechart_income() {
  let showValues = false;
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

  const raceColorMap = {
    "White": "#f5222d",
    "Black or African American": "#fa8c16",
    "American Indian and Alaska Native": "#a0d911",
    "Asian": "#13c2c2",
    "Native Hawaiian and Other Pacific Islander": "#2f54eb",
    "Some other race": "grey"
  };

  const yearData = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022];
  const values = {
    "White": [0.0, -1.2792582032266904, -0.9553108674123916, -0.3553925135560953, 0.6656248428835558, 4.653678875766568, 6.208137844455159, 7.984685947748842, 9.04706726905944, 13.478877460816646, 14.90007916455515, 13.486546268373125],
    "Black or African American": [0.0, -4.084829641761774, -4.499295890828289, -2.9481426868771585, -2.6704394247440257, 0.12667671062001484, 4.320585386226028, 6.587454610573543, 7.353842213778473, 11.415075407784288, 12.097652109773616, 13.998897006803656],
    "American Indian and Alaska Native": [0.0, -2.700514315771965, -4.353619715320466, -2.181069820990634, -2.20309974133179, 1.0999330397138614, 2.9214161087453214, 6.2624978162518, 10.886590799066493, 10.62567284471743, 21.984666191842393, 23.428931616028695],
    "Asian": [0.0, -1.8117047250500802, 0.10722093729337671, 1.2150606071606265, 1.8436284986262566, 6.201959823018558, 9.422819860541523, 10.771866889427137, 13.037470189428625, 19.317991990240575, 20.755392277814448, 18.902706641972323],
    "Native Hawaiian and Other Pacific Islander": [0.0, -9.301458080175324, -7.641981233221558, -10.271776548922551, -7.822579863158814, -3.0647937314863007, -1.6815483349625064, 2.37282956272948, 1.8686543841985057, 7.413868156134855, 6.694210188986993, 2.2304251283561403],
    "Some other race": [0.0, -5.7427181667737885, -4.50617494269604, -3.6640097522440436, -1.542015530139164, 2.1820154148454933, 6.462941216791034, 9.875731794436447, 11.262881692536133, 18.461175733907996, 21.39478040503019, 23.351061280796756]
  };

  const width = 400,
    height = 400,
    margin = {top: 20, right: 20, bottom: 20, left: 20};

  // Set up scales
  let xScale = d3.scaleLinear()
  .range([margin.left, width - margin.right])
  .domain([d3.min(yearData), d3.max(yearData)]); 
  let yScale = d3.scaleLinear().range([height - margin.top, margin.bottom]).domain([-10, 25]);

  // Process hardcoded data
  let processedData = raceData.map(race => values[race]);

    // Create SVG element
    let svg = d3.select("#linechart_income")
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

      // Draw points,store original color of the point
      let circles = svg.selectAll(".dot-" + i)
        .data(processedData[i])
        .enter().append("circle")
        .attr("class", "dot-" + i)
        .attr("cx", (d, j) => xScale(yearData[j]))
        .attr("cy", (d) => yScale(d))
        .attr("r", 3.5)
        .style("fill", colorData[i])
        .attr("data-original-color", colorData[i]);


       circles.on("click", function(d) {
        let isSelected = d3.select(this).classed("selected");
        if (!isSelected) {
          resetPoints();
        }
        // Toggle the selection state of the clicked point
        d3.select(this).classed("selected", !isSelected).style("fill", isSelected ? colorData[i] : "black");
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
       .text("Income change in Percentage by Race 2010-2022");

       // Add horizontal grid 
      svg.selectAll("horizontalGrid").data(yScale.ticks()).enter()
      .append("line")
      .attr("class", "horizontalGrid")
      .attr("x1", margin.left)
      .attr("x2", width)
      .attr("y1", function(d) { return yScale(d); })
      .attr("y2", function(d) { return yScale(d); })
      .attr("stroke", "rgba(200, 200, 200, 0.1)"); 

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
      
      // highlight points in another line chart
      function linechart_rent_highlight(selectedRaces, selectedYears) {
        if (!selectedYears[0] || !selectedYears[1]) return;
      
        const [startYear, endYear] = selectedYears.map(year => Math.round(year));

        d3.select("#linechart_rent").selectAll("circle")
          .style("fill", function(d, i) {
            const year = yearData[i]; 
            //console.log(year)
            return year >= startYear && year <= endYear ? "red" : "black";
          });
      }
      
      // Highlight selected points, call highlight func in another line chart
      function highlight() {
        if (!d3.event.selection) return; 
        const [[x0, y0], [x1, y1]] = d3.event.selection;
        selectedYears = [xScale.invert(x0), xScale.invert(x1)];
        resetPoints();

        svg.selectAll("circle") .classed("selected", false) .style("fill", function() {
            return d3.select(this).attr("data-original-color");
        });

        svg.selectAll("circle").filter(function() {
            const cx = +d3.select(this).attr("cx");
            const cy = +d3.select(this).attr("cy");
            return x0 < cx && cx < x1 && y0 < cy && cy < y1;
          }).classed("selected", true).style("fill", "black"); 

        linechart_rent_highlight(selectedRaces, selectedYears);
      }

    function brushEnd() {
      if (!d3.event.selection) return;
      svg.select(".brush").call(brush.move, null);
    }

    // Reset all points
    function resetPoints() {
      svg.selectAll("circle")
      .style("fill", function() {
        return d3.select(this).attr("data-original-color");
      })
      .classed("selected", false);
    
      linechart_rent_highlight(selectedRaces, selectedYears);
    }

    function updateLineChart(selectedRaces) {
      // reset 
      svg.selectAll("path").remove();
      svg.selectAll(".dot-group").remove();
      svg.selectAll("circle").remove();
  
      // display line for selected race
      selectedRaces.forEach(race => {
          const raceIndex = raceData.indexOf(race);
          let updatedProcessedData = [processedData[raceIndex]];
          let color = raceColorMap[race];
  
          svg.append("path")
              .attr('d', line(updatedProcessedData[0]))
              .attr('stroke', color)
              .attr('stroke-width', "3px")
              .attr("fill", "none");
  
          let circles = svg.selectAll(".dot-" + raceIndex)
              .data(updatedProcessedData[0])
              .enter()
              .append("g")
              .attr("class", "dot-group");
  
          circles.append("circle")
              .attr("cx", (d, j) => xScale(yearData[j]))
              .attr("cy", (d) => yScale(d))
              .attr("r", 4)
              .style("fill", color)
              .attr("data-original-color", color);
          
        // Control to display value 
          if (selectedRaces !== raceData) {
            if (showValues){
              circles.append("text")
              .text((d) => d.toFixed(2)) 
              .attr("x", (d, j) => xScale(yearData[j]) - 12) 
              .attr("y", (d) => yScale(d) -20)
              .attr("font-size", "10px")
              .attr("fill", "black");
          }
        }
      });

  }
    
    // Only display the selected race
    document.getElementById("filterButton").addEventListener("click", function() {
      var checkboxes = document.querySelectorAll('input[name="race"]:checked');
      var selectedRaces = Array.from(checkboxes).map(el => el.value);
      updateLineChart(selectedRaces);
  });

  // Display all race
    document.getElementById("showAllButton").addEventListener("click", function() {
      var checkboxes = document.querySelectorAll('input[name="race"]');
      checkboxes.forEach(function(checkbox) {
          checkbox.checked = true;
      });
      updateLineChart(raceData);
    });

// Control to display value of the data point or not
  document.getElementById("showValueButton").addEventListener("click", function() {
    showValues = !showValues; 
    var checkboxes = document.querySelectorAll('input[name="race"]:checked');
    var selectedRaces = checkboxes.length > 0 ? Array.from(checkboxes).map(x => x.value) : [];
    updateLineChart(selectedRaces);
  });

  }
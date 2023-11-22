function linechart() {
  const incomeData = [
    [
      52480, 53444, 54729, 55867, 57355, 59698, 61349, 63704, 65902, 69823,
      74932, 79933,
    ],
    [
      33578, 33223, 33764, 34815, 35481, 36544, 38555, 40232, 41511, 43862,
      46774, 51374,
    ],
    [
      35062, 35192, 35310, 36641, 37227, 38530, 39719, 41882, 44772, 45476,
      53149, 58082,
    ],
    [
      67022, 67885, 70644, 72472, 74105, 77368, 80720, 83456, 87243, 93759,
      100572, 106954,
    ],
    [
      52776, 49378, 51322, 50591, 52815, 55607, 57112, 60734, 61911, 66464,
      69973, 72411,
    ],
    [
      38230, 37172, 38439, 39346, 40865, 42461, 44798, 47219, 48983, 53097,
      57671, 63290,
    ],
  ];

  const raceData = ["White", "Black or African American", 
        "American Indian and Alaska Native", "Asian", 
        "Native Hawaiian and Other Pacific Islander", "Other"]

  const colorData = [
    "#f5222d",
    "#fa8c16",
    "#a0d911",
    "#13c2c2",
    "#2f54eb",
    "#eb2f96",
  ];

  const yearData = [
    2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022,
  ];
  const width = 400,
    height = 400,
    margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    };

  let xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear();

  let svg = d3
    .select("#linechart")
    .append("svg")
    .attr(
      "viewBox",
      [
        0,
        0,
        width + margin.left + margin.right,
        height + margin.top + margin.bottom,
      ].join(" ")
    );

  svg = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  xScale.range([margin.left, width - margin.right]).domain([2010, 2022]);

  yScale.range([height - margin.top, margin.bottom]).domain([30000, 110000]);

  let xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(d3.axisBottom(xScale));

  xAxis
    .selectAll("text")
    .style("text-anchor", "middle")
    .attr("dx", "-.8em")
    .attr("dy", "1em")
    .attr("transform", "rotate(-30)")
    .attr("font-size", ".8em");

  let yAxis = svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .attr("transform", "translate(" + margin.left + ", -12)")
    .attr("font-size", ".4em")

  let line = d3.line()
          .x((d, i) => xScale(yearData[i]))
          .y((d) => yScale(d));
  
  for(let i = 0; i < colorData.length; ++i) {
    svg.append("path")
      .attr('d', line(incomeData[i]))
      .attr('stroke', colorData[i])
      .attr('stroke-width', "2px")
      .attr("fill", "none")

    // add legend
    svg.append("rect")
      .attr('x', 30)
      .attr('y', 10 + i * 15)
      .attr('width', "7px")
      .attr('height', "7px")
      .style('fill', colorData[i])
    
    svg.append("text")
      .attr('x', 40)
      .attr('y', 16 + i * 15)
      .attr('font-size', "7px")
      .text(raceData[i])

  }

  
  
  
}

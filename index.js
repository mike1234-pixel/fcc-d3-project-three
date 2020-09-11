fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then((response) => {
  if (response.status !== 200) {
    console.log(
      "Looks like there was a problem. Status Code: " + response.status
    );
    return;
  }

  response.json().then((data) => {
    // general variables
    const dataset = data;
    const baseTemp = dataset.baseTemperature; // 8.66
    const datasetKeyValues = data.monthlyVariance; // array of cell values - rect element for each value in the array

    //  svg area

    const margin = {
      top: 100,
      right: 20,
      bottom: 30,
      left: 60,
    };
    const svgWidth = 1300 - margin.left - margin.right;
    const svgHeight = 600 - margin.top - margin.bottom;
    const padding = 70;

    // colours

    let tempValues = [];
    let yearValues = [];

    for (let i = 0; i < datasetKeyValues.length; i++) {
      tempValues.push(
        Math.round((baseTemp + datasetKeyValues[i].variance) * 10) / 10
      );

      yearValues.push(datasetKeyValues[i].year);
    }

    console.log(yearValues);

    // colour variables
    const highestTemp = d3.max(tempValues);
    const lowestTemp = d3.min(tempValues);
    const stepNumber = Math.round(((highestTemp - lowestTemp) / 11) * 10) / 10; // 1.1

    // colour chart

    const colorChart = {
      color1: {
        hex: "#9ae5e6",
        range: lowestTemp + stepNumber, // 2.8 if number is greater than color1, hex should be color2
      },
      color2: {
        hex: "#9beddf",
        range: lowestTemp + stepNumber * 2, // 3.9
      },
      color3: {
        hex: "#a5f5d3",
        range: lowestTemp + stepNumber * 3,
      },
      color4: {
        hex: "#b9fac4",
        range: lowestTemp + stepNumber * 4,
      },
      color5: {
        hex: "#d3feb4",
        range: lowestTemp + stepNumber * 5,
      },
      color6: {
        hex: "#f1ffa6",
        range: lowestTemp + stepNumber * 6,
      },
      color7: {
        hex: "#ebda79",
        range: lowestTemp + stepNumber * 7,
      },
      color8: {
        hex: "#e4b454",
        range: lowestTemp + stepNumber * 8,
      },
      color9: {
        hex: "#dc8c38",
        range: lowestTemp + stepNumber * 9,
      },
      color10: {
        hex: "#d2622a",
        range: lowestTemp + stepNumber * 10,
      },
      color11: {
        hex: "#c32f27",
        range: highestTemp,
      },
    };

    // months array
    const monthValues = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // scales

    // xScale

    const maxYear = d3.max(yearValues);
    const minYear = d3.min(yearValues);

    const xScale = d3
      .scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, svgWidth - padding]);

    // yScale

    const yScale = d3.scaleLinear().domain([0, 12]).range([svgHeight, 5]); // change to 0

    // create axes
    const xAxis = d3.axisBottom(xScale).tickFormat((d) => parseInt(d));
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => monthValues[d + 1]); // converts 0-11 to january-decemenber

    //   .rangePoints([10, 0]);

    // chart description
    d3.select("span")
      .append("p")
      .attr("id", "description")
      .html(
        `${data.monthlyVariance[0].year}-${
          data.monthlyVariance[data.monthlyVariance.length - 1].year
        }: base temperature: ${baseTemp} &#8451;`
      );

    const svg = d3
      .select(".vis-container")
      .append("svg")
      .attr("width", svgWidth + margin.left + margin.right)
      .attr("height", svgHeight + margin.top + margin.bottom)
      .attr("class", "svg-element");

    // append rects

    let uniqueYears = [...new Set(yearValues)];

    // tooltip
    const tooltip = d3
      .select("#tooltip-container")
      .append("div")
      .html("sjsdks")
      .attr("id", "tooltip")
      .style("opacity", 0);

    svg
      .selectAll()
      .data(datasetKeyValues)
      .enter()
      .append("rect")
      .attr("height", svgHeight / 12)
      .attr("width", svgWidth / uniqueYears.length)
      .attr("class", "cell")
      .attr("data-month", (d) => d.month - 1) // 0-11 // check type
      .attr("data-year", (d) => d.year) // "1753" // check type
      .attr("data-temp", (d) => Math.round((baseTemp + d.variance) * 10) / 10) // finds temp and rounds to 1 decimal place
      //   .attr("x", (d, i) => i * 5)
      .attr("x", (d) => xScale(d.year))
      .attr("y", (d) => yScale(d.month))
      .attr("fill", (d) => {
        let temp = Math.round((baseTemp + d.variance) * 10) / 10;
        if (temp > colorChart.color10.range) {
          return colorChart.color11.hex;
        } else if (temp > colorChart.color9.range) {
          return colorChart.color10.hex;
        } else if (temp > colorChart.color8.range) {
          return colorChart.color9.hex;
        } else if (temp > colorChart.color7.range) {
          return colorChart.color8.hex;
        } else if (temp > colorChart.color6.range) {
          return colorChart.color7.hex;
        } else if (temp > colorChart.color5.range) {
          return colorChart.color6.hex;
        } else if (temp > colorChart.color4.range) {
          return colorChart.color5.hex;
        } else if (temp > colorChart.color3.range) {
          return colorChart.color4.hex;
        } else if (temp > colorChart.color2.range) {
          return colorChart.color3.hex;
        } else if (temp > colorChart.color1.range) {
          return colorChart.color2.hex;
        } else {
          return colorChart.color1.hex;
        }
      })
      .on("mouseover", (d, i) => {
        let x = d3.event.x;
        let y = d3.event.y;
        console.log(x);
        console.log(y);

        tooltip.transition().duration(20).style("opacity", 0.9);
        tooltip
          .html(
            `${d.year} ${monthValues[d.month]} ${
              Math.round((baseTemp + d.variance) * 10) / 10
            }&#8451;`
          )
          .attr("data-year", d.year)
          .attr("id", "tooltip")
          .style("position", "absolute")
          .style("z-index", "10")
          .style("left", x + 10 + "px")
          .style("top", y + "px");
      });

    // legend
    const colorArray = Object.values(colorChart);

    for (var i = 0; i < colorArray.length; i++) {
      let legendGroup = d3
        .select(".legend-svg")
        .append("g")
        .attr("width", 100)
        .attr("height", 100);

      legendGroup
        .append("rect")
        .attr("x", 50 * i)
        .attr("y", 50)
        .attr("class", "legend-color-box")
        .attr("width", 50)
        .attr("height", 50)
        .style("fill", colorArray[i].hex); // AFTER EACH OF THESE I WANT A TEXT ELEMENT

      legendGroup
        .append("text")
        .text(`> ${Math.round(colorArray[i].range * 10) / 10}`)
        .attr("x", 50 * i)
        .attr("y", 40)
        .style("text-anchor", "beginning");
    }

    // append axes

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`) // change to 0
      .call(yAxis);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(${0}, ${svgHeight})`)
      .call(xAxis);
  });
});

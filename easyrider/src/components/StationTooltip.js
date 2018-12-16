import * as d3 from "d3";

/**
 * Creates the tooltip content of an specific station.
 * @param {station} station whose tooltip is going to be generated.
 */
export function getTooltipContent(station, date) {
  const data = station.trend;

  const margin = { left: 40, right: 20, top: 20, bottom: 30 };
  const width = 300 - margin.left - margin.right;
  const height = 100 - margin.top - margin.bottom;

  const div = d3.create("div");

  div
    .append("text")
    .text("Adress: ")
    .append("text")
    .style("font-weight", "bold")
    .text(station.station_name);

  div.append("br");

  div
    .append("text")
    .text("ID: ")
    .append("text")
    .style("font-weight", "bold")
    .text(station.station_id);
  div.append("br");
  div
    .append("text")
    .text("Bikes: ")
    .append("text")
    .style("font-weight", "bold")
    .text(station.current_bikes);
  div.append("br");
  div
    .append("text")
    .text("Empty slots: ")
    .append("text")
    .style("font-weight", "bold")
    .text(station.total_docks - station.current_bikes);
  div.append("br");
  div.append("br");
  div
    .append("text")
    .text("PLAN YOUR TRIP: ")
    .append("hr");
  div
    .append("text")
    .text("Date: ")
    .append("text")
    .style("font-weight", "bold")
    .text(date.format("DD-MM-YYYY HH:mm"));
  div.append("br");
  div
    .append("text")
    .text("Week day: ")
    .append("text")
    .style("font-weight", "bold")
    .text(date.format("dddd"));

  var svg = div
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function(d) {
        return d;
      })
    ])
    .range([height, 0]);

  // y Axis
  var yAxis = d3.axisLeft(y).ticks(4);

  g.append("g").call(yAxis);

  // text label for the y axis
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin.left / 3)
    .attr("x", 0 - height / 2 - margin.top)
    .style("text-anchor", "middle")
    .text("Bikes");

  var x = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([0, width]);

  // x Axis
  var xAxis = d3.axisBottom(x).tickFormat(d => {
    return d % 2 === 1 ? d : "";
  });

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text");

  // Label for the x axis
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" +
        (width / 2 + margin.left) +
        " ," +
        (height + margin.top + 30) +
        ")"
    )
    .style("text-anchor", "middle")
    .text("Hours");

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", height)
    .attr("height", 0)
    .attr("width", x.bandwidth() - 2)
    .attr("x", function(d, i) {
      return x(i);
    })
    .attr("fill", "steelblue")
    .transition()
    .attr("height", function(d) {
      return height - y(d);
    })
    .attr("y", function(d) {
      return y(d);
    })
    .duration(1000);

  return div.node();
}

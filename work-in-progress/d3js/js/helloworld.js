function main() {
  
  var cScale = d3.scale.linear().domain([0, 100]).range([0, 2 * Math.PI]);
  
  data = [[0,50,"#AA8888"], [50,75,"#88BB88"], [75,100,"#8888CC"]]
  
  var vis = d3.select("#svg_donut");
  var arc = d3.svg.arc()
                  .innerRadius(0)
                  .outerRadius(100)
                  .startAngle( function(d){ return cScale(d[0]); } )
                  .endAngle( function(d){ return cScale(d[1]); });
  
  vis.selectAll("path")
     .data(data)
     .enter()
     .append("path")
     .attr("d", arc)
     .style("fill", function(d){ return d[2]; })
     .attr("transform", "translate(300,200)"); 
  
  d3.csv("http://localhost:8000/dashboard-20150313.csv", function(data) {
    data.forEach( function(d) {
      console.log(d);
    });
  });
}

chartdiv=document.getElementById("wlchart");
console.log(chartdiv.clientWidth);
console.log(chartdiv.clientHeight);

var svg = d3.select(chartdiv).append('svg');
console.log(svg);
// ,
//    
//     width = 530 - margin.left - margin.right,
//     height = 310 - margin.top - margin.bottom;
var width = chartdiv.clientWidth-40-40;
var height = chartdiv.clientHeight-20-20;


svg
          .attr("width", width+40)
          .attr("height", height+80)
          .attr('id','linechart');

var parseTime = d3.timeParse("%Y%m%d")
    bisectDate = d3.bisector(function(d) { return d.date; }).left;
    console.log(parseTime);

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var color = d3.scaleOrdinal().range(["#1f78b4","#a6cee3"]);
console.log(color);


var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.wl); });

var g = svg.append("g")
    .attr("width", width)
    .attr("height", height+20+20)
    .attr("transform", "translate(" + 40 + "," + 20 + ")");



d3.json("data/wls.json", function(error, data) {
    if (error) throw error;
    

    color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== "date";
    }));


    data.forEach(function(d) {
      d.date = parseTime(d.date);
      //console.log(d.date);
      // d.mohwl= +d.mohwl;
    });



    var stations = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {
            date: d.date,
            wl: +d[name]
          };
        })
      };
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    
    y.domain([
      d3.min(stations, function(c) {
        return d3.min(c.values, function(v) {
          return v.wl;
        });
      }),
      d3.max(stations, function(c) {
        return d3.max(c.values, function(v) {
          return v.wl;
        });
      })
    ]);
    
    //below creates the legends
    
    
    var legend = g.selectAll('g')
      .data(stations)
      .enter()
      .append('g')
      .attr('class', 'legend');

    legend.append("rect")
      .attr("class","legendbox")
      .attr("width",150)
      .attr("height",50)
      .attr("x",width/2-30)
      .attr("y",-8)
      .style("fill","rgba(213, 213, 213, 0.2)");



    legend.append('rect')
      .attr('x', width/2-20)
      .attr('y', function(d, i) {
        console.log(d);
        return i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {

        return color(d.name);
      })
      .style("z-index",2);

    legend.append('text')
      .attr("class","linechart-legend")
      .attr('x', width/2 -5)
      .attr('y', function(d, i) {
        console.log(i);
        return (i * 20) + 9;
      })
      .text(function(d) {
        //console.log(d.name)
        return d.name;
      })
      .style("z-index",2);

    
      


    

      //below generate the x and y axis

    g.append("g")
        .attr("class", "axis axis--x")
        //.scaleTime(x)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(9).tickFormat(d3.timeFormat("%Y-%m-%d")))
      .selectAll("text")
        .attr("y", 0)
        .attr("x", -5)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-60)")
        .style("text-anchor", "end")
        .style("color", "red");

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(8).tickFormat(function(d) { return d + "m"; }))
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 8)
        .attr("dy", "0.8em")
        .style("text-anchor", "end")
        .text("Water Level")
        .style("fill", "black")
        .style('font-size','1.5em');




    // g.append("path")
    //     .datum(stations)
    //     .attr("class", "line")
    //     .attr("d", line);


    //paths for the two variables

     var station = g.selectAll(".station")
      .data(stations)
      .enter().append("g")
      .attr("class", "station");

    station.append("path")
      .attr("class", "line")
      .attr("d", function(d) {
        return line(d.values);
      })
      .style("stroke", function(d) {
        return color(d.name);
      });

    station.append("text")
      .datum(function(d) {
        return {
          name: d.name,
          value: d.values[d.values.length - 1]
        };
      })
      .attr("transform", function(d) {
        return "translate(" + x(d.value.date) + "," + y(d.value.wl) + ")";
      })
      .attr("x", 3)
      .attr("dy", ".35em");
      // .text(function(d) {
      //   return d.name;
      // });


//append lines of where the selected dates are

        //var today="20170517";

        var wldates=["20161122","20161202","20170401","20170411","20170421","20171107","20180106","20180426","20180516","20180605"];
        wldates.forEach(function(da){
          var theDate = parseTime(da);
          g.append("svg:line")
            .attr("class", "wldates")
            .attr("x1", x(theDate))
            .attr("y1", height)
            .attr("x2", x(theDate))
            .attr("y2", 0)
            .style("stroke-width", 0.5)
            .style("stroke", "gray")
            .style("fill", "none");

          g.append("text")

              
              .attr("x", x(theDate))
              .attr("y", 540)


        });





        // wldates.append("text")
        //   // .datum(function(d) {
        //   //   return {
        //   //     name: d.name,
        //   //     value: d.values[d.values.length - 1]
        //   //   };
        //   // })
        //   // .attr("transform", function(d) {
        //   //   return "translate(" + x(d.value.date) + "," + y(d.value.wl) + ")";
        //   // })
          
        //   .attr("x", 3)
        //   .attr("dy", ".35em")
        //   .text(function(d) {
        //     return d.name

        //   });
        //var theDate = parseTime(today);

      // g.append("svg:line")
      //     .attr("class", "today")
      //     .attr("x1", x(theDate))
      //     .attr("y1", height)
      //     .attr("x2", x(theDate))
      //     .attr("y2", 0)
      //     .style("stroke-width", 2)
      //     .style("stroke", "red")
      //     .style("fill", "none");







    //the following does the hightlighting in parallel 

    var mouseG = g.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    var lines = document.getElementsByClassName('line');


      

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(stations)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 4)
      .style("stroke", function(d) {
        return color(d.name);
      })
      .style("fill", function(d) {
        return color(d.name);
      })
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("rect")
        .attr("transform", "translate(10,3)")
        .attr("class", "tooltip")
        .attr("width", 130)
        .attr("height", 25)
        .attr("x",5)
        .attr("y", -17)
        .attr("rx", 4)
        .attr("ry", 4);

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)")
      .attr("class", "tooltip-text");


    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line rect")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
        
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line rect")
          .style("opacity", "1")
          .style("fill","rgba(213, 213, 213, 0.7)")

        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
        
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        //console.log(mouse);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")  //configure the dynamic positioning by elaborate the trnasform function
          .attr("transform", function(d, i) {
            //console.log(width/mouse[0])
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }

            formatTime=d3.timeFormat("%Y-%m-%d");
            var content=[];
            content.push(y.invert(pos.y).toFixed(2)+"m on "+formatTime(xDate));
            
            d3.select(this).select('text')
              .text(content);   

            var a = mouse[0];        
            return "translate(" + a + "," + pos.y +")";
          });

        d3.selectAll(".mouse-per-line rect")
          .attr("transform",function(){
            //console.log(mouse[0]);
            if (mouse[0]>332){
              
              return "translate(" + -140 + "," + 3+")";
            } else {
              return "translate(0,3)";
            }
          });

        d3.selectAll(".mouse-per-line text")
          .attr("transform",function(){
            //console.log(mouse[0]);
            if (mouse[0]>332){
              
              return "translate(" + -130 + "," + 3+")";
            } else {
              return "translate(10,3)";
            }
          });

      });
     

    // var focus = g.append("g")
    //     .attr("class", "focus")
    //     .style("display", "none");

    // focus.append("line")
    //     .attr("class", "x-hover-line hover-line")
    //     .attr("y1", 0)
    //     .attr("y2", height);

    // focus.append("line")
    //     .attr("class", "y-hover-line hover-line")
    //     .attr("x1", width)
    //     .attr("x2", width);

    // focus.append("circle")
    //     .attr("r", 7.5);

    // focus.append("text")
    //     .attr("x", 15)
    //     .attr("dy", ".31em");

    // svg.append("rect")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //     .attr("class", "overlay")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .on("mouseover", function() { focus.style("display", null); })
    //     .on("mouseout", function() { focus.style("display", "none"); })
    //     .on("mousemove", mousemove);

    // function mousemove() {
    //   var x0 = x.invert(d3.mouse(this)[0]),
    //       i = bisectDate(data, x0, 1),
    //       d0 = data[i - 1],
    //       d1 = data[i],
    //       d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //   focus.attr("transform", "translate(" + x(d.date) + "," + y(d.mohwl) + ")");
    //   focus.select("text").text(function() { return d.mohwl; });
    //   focus.select(".x-hover-line").attr("y2", height - y(d.mohwl));
    //   focus.select(".y-hover-line").attr("x2", width + width);
    // }
});
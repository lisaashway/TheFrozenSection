
d3.json("../../Resources/grocery_info_from_zipcodes.json").then(function(zipcodes){

    zipcodesArray2 = Object.values(zipcodes)

    //create svg sizes
    var svgWidth = 1000;
    var svgHeight = 600;

    //create margins for chart
    var margin = {
    top: 60,
    right: 40,
    bottom: 60,
    left: 80
    };

    //calculate width and height of chart based on svg sizes and margin sizes
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    //create an SVG wrapper, append an SVG element that will hold the scatter plot, and add in svg sizes.
    var svg = d3.select("#bubble")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    //create group and move entire svg to margin locations
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // create scaling functions based off of data
    var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(zipcodesArray2, d => d.medianIncome))
    .range([0, width])

    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(zipcodesArray2, d => d.yearsOfSchool))
    .range([height, 0]);

    // create axes from scaling functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
    .call(leftAxis);

    //create function to scale colors to revenue amounts
    var myColor = d3.scaleLinear().domain(d3.extent(zipcodesArray2, d=> d.groceryCount+1))
    .range(["#44D1C8", "#FF5CDA"])

    //create circles from grocerycount
    var circlesGroup = chartGroup.selectAll("circle")
    .data(zipcodesArray2)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.medianIncome))
    .attr("cy", d => yLinearScale(d.yearsOfSchool))
    .attr("r", d => d.groceryCount*2.5+2)
    .attr("fill", d => myColor(d.groceryCount))
    .attr("opacity", ".9");

    //add text from count of GroveryStores
    chartGroup.selectAll("null")
    .data(zipcodesArray2)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.medianIncome))
    .attr("y", d => yLinearScale(d.yearsOfSchool)+4)
    .text(d => d.groceryCount)
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");



    // create tooltip pop-up
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([350, -200])
    .html(function(d) {
        var numberOfStores = d.groceryStores.length;
        var popUpList = "<strong><u>" + d.zip + "</strong></u><br>"
        for (i=0; i < numberOfStores; i++){
            popUpList = popUpList + d.groceryStores[i] + "<br>"
        }
        return(popUpList)
    })

    // adding tooltop to chartGroup
    chartGroup.call(toolTip);

    //create event listener for pop-up on mouse-over
    circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
    })

    // hide when mouse moves away
    .on("mouseout", function(data) {
        toolTip.hide(data);
    });

    // create y axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 5)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "active")
    .text("Years of School");


    //create x axes labels
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .attr("x", 0)
    .attr("y", 20)
    .attr("class", "active")
    .text("Median Family Income");

});
            
// var PdfReader = require("pdfreader").PdfReader;

// new PdfReader().parseFileItems("budget_spreadsheet_-_fy24.pdf", function(err, item){
//     if (item && item.text)
//     console.log(item.text);
// })

// To Do List.
//Create interactive Zoom and adjustable plot.
var width, height, marginTop, marginRight, marginBottom, marginLeft, legendHeightStart, legendPositionStart, legendSideMultipler,fontSize;
let svg;
function resizeScreen() {
    console.log(document.body.clientWidth)
    if (document.body.clientWidth < 600) {
        width = 375;
        height = 650;
        marginBottom = 225;
        marginRight = 0;
        legendHeightStart = 500;
        legendPositionStart = 20;
        legendSideMultipler=1 ;
        fontSize= 3.25;
    } 
    else {
        marginBottom = document.body.clientHeight*0.05;
        marginRight = document.body.clientWidth*0.325;
        width = document.body.clientWidth*0.9;
        height = document.body.clientHeight*0.8;
        legendPositionStart = width*0.68;
        legendHeightStart = 40;
        legendSideMultipler=0;
        fontSize= 1.5;
    }
    marginTop = document.body.clientHeight*0.10;
    marginLeft = 75;
}
window.addEventListener('resize',loadGraph);
let container = document.getElementById("screen");
loadGraph();
function loadGraph() {
    d3.select("svg").remove();
    resizeScreen()
    // TimePlot
    // const x = d3.scaleUtc()
    //     .domain([new Date("2023-01-1"), new Date("2024-01-01")])
    //     .range([marginLeft, width - marginRight]);

    // const y = d3.scaleLinear()
    //     .domain([0, 100])
    //     .range([height -marginBottom,marginTop]);

    // svg = d3.create("svg")
    //     .attr("width",width)
    //     .attr("height",height);

    // svg.append("g")
    // .attr("transform", `translate(0,${height - marginBottom})`)
    // .call(d3.axisBottom(x))
    // .style("font","1vw times");

    // svg.append("g")
    //     .attr("transform", `translate(${marginLeft},0)`)
    //     .call(d3.axisLeft(y));

    // Histogram
    console.log(height);
    const revenues = [{revenue:"State Appropriations",amount:218045224,color:"red",side:0},{revenue:"Federal Support",amount:0,color:"blue",side:0},{revenue:"Interest",amount:365000,color:"green",side:0},{revenue:"Tuition and Fees",amount:512431984,color:"yellow",side:0},{revenue:"Reimbursement",amount:71191542,color:"black",side:1},{revenue:"Sales and Services",amount:0,color:"purple",side:1},{revenue:"Other Income",amount:6000,color:"pink",side:1},{revenue:"Total",amount:802039750,color:"orange",side:1}];
    const x = d3.scaleBand()
    .domain(d3.groupSort(revenues, ([d]) => -d.amount, (d) => d.revenue))
    .range([marginLeft, width - marginRight])
    .padding(0.1);

    const y = d3.scaleLinear()
    .domain(([0,d3.max(revenues , (d) => d.amount)]))
    .range([height - marginBottom, marginTop]);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width:100%: height: auto;");

    // svg.append("text")
    //     .text("Proposed Budget Revenues (University of Iowa)")
    //     .attr("y",25)
    //     .style("fill","yellow")
    //     .style("background","black")
    //     .style("font-weight",700)
    //     .style("margin","auto")
    //     .style("text-align","center")
    //     .style("width","100%");

    svg.append("g")
    .selectAll()
    .data(revenues)
    .join("rect")
        .attr("x", (d) => x(d.revenue))
        .attr("y", (d) => y(d.amount))
        .attr("height", (d) => y(0) - y(d.amount))
        .attr("width", x.bandwidth())
        .attr("fill", (d) => d.color);

    svg.append("g")
        .style("font","0.5vw times")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.selectAll()
        .data(revenues)
        .enter()
        .append("circle")
            .attr("cx", (d) => {return legendPositionStart + legendSideMultipler*(325/2 +25)*d.side })
            .attr("cy", (d,i) => {return legendHeightStart + i*25 - legendSideMultipler*d.side*100})
            .attr("r",7)
            .attr("fill", (d) => {return d.color});

    svg.selectAll("mylabels")
        .data(revenues)
        .enter()
        .append("text")
        .attr("x",(d) => {return legendPositionStart + legendSideMultipler*(325/2 +25)*d.side + 20})
        .attr("y", (d,i) => {return legendHeightStart + 5 + i*25 - legendSideMultipler*d.side*100})
        .attr("fill", "black")
        .style("font-weight",700)
        .style("font",`${fontSize}vw times`)
        .text((d) => {return d.revenue})
        .attr("text-anchor","left");

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickFormat((y) => (y).toFixed()))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y",10)
            .attr("fill","currentColor")
            .attr("text-anchor","start")
            .text("\u2191 Revenue ($)"));
    container.append(svg.node());
}
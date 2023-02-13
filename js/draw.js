import {canvasProp, beach, dune, sea} from './object_assets.js';

// Setups up initial canvas as svg to draw on.
// Then calls drawSideCanvas to draw the side view initially
var canvas = d3.select("#canvas")
    .append("svg")
    .attr("width", canvasProp.getCanvasWidth)
    .attr("height", canvasProp.getCanvasHeight);

drawSideCanvas(canvas)

// *************************** Main Draw Functions **********************************

// Draws the side view of the canvas
function drawSideCanvas(canvas) {
    console.log("Drawing the Side")
    canvas = drawBackground(canvas)
    canvas = drawSideSea(canvas)
    canvas = drawSideBeach(canvas)
    canvas = drawSideDune(canvas)
    return canvas
}

// Draws the side view of the canvas
function drawAerialCanvas(canvas) {
    console.log("Drawing the aerial")
    canvas = drawBackground(canvas)
    canvas = drawAerialBeach(canvas)
    canvas = drawAerialDune(canvas)
    canvas = drawAerialSea(canvas)
    return canvas
}

// Draws the background colour of the canvas
function drawBackground(canvas) {
    canvas.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", canvasProp.getCanvasWidth)
      .attr("height", canvasProp.getCanvasHeight)
      .style("fill", "#E8E8E8");
    return canvas
}

// *************************** Detect View Change Functions **********************************
const sideViewOption = document.getElementById('sideViewButton');
sideViewOption.addEventListener('click', reDrawSideCanvas);

function reDrawSideCanvas() {
    sea.increaseSeaRise(0.1)
    drawSideCanvas(canvas)
}

const aerialViewOption = document.getElementById('aerialViewButton');
aerialViewOption.addEventListener('click', reDrawAerialCanvas);

function reDrawAerialCanvas() {
    drawAerialCanvas(canvas)
}


// *************************** Side View Draw Functions **********************************

// Draws the side view of the beach object
function drawSideBeach(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    var line = [
        {"x": cW * beach.getBeachWidth, "y": cH},
        {"x": cW * beach.getBeachWidth, "y": cH * beach.getBeachMaxHeight},
        {"x": 0, "y": cH * beach.getBeachMinHeight},
        {"x": 0, "y": cH},
        {"x": cW * beach.getBeachWidth, "y": cH}
    ];
    
    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("fill", "#FAFAD2");

    canvas.append("text")
        .attr("x", canvasProp.getCanvasWidth * 0.5)
        .attr("y", canvasProp.getCanvasHeight * 0.8)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Beach");
    
    return canvas
}

// Draws the side view of the dune object
function drawSideDune(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    var line = [
        {"x": cW * beach.getBeachWidth, "y": cH},
        {"x": cW * beach.getBeachWidth, "y": cH * beach.getBeachMaxHeight},
        {"x": cW * (beach.getBeachWidth + dune.bankLength), "y": cH * (beach.getBeachMaxHeight - dune.getDuneHeight)},
        {"x": cW, "y": cH * (beach.getBeachMaxHeight - dune.getDuneHeight)},
        {"x": cW, "y": cH},
        {"x": cW * beach.getBeachWidth, "y": cH}
    ];
    
    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("fill", "#FAFAD2");

    canvas.append("text")
        .attr("x", canvasProp.getCanvasWidth * 0.9)
        .attr("y", canvasProp.getCanvasHeight * 0.8)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Dune");
    
    return canvas
}

function drawSideSea(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    var line = [
        {"x": 0, "y": cH},
        {"x": 0, "y": cH * (beach.getBeachMinHeight - sea.getHeight)},
        {"x": cW * sea.getLength, "y": cH * (beach.getBeachMinHeight - sea.getHeight)},
        {"x": cW * sea.getLength, "y": cH},
        {"x": 0, "y": cH},
    ];

    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("fill", "#87CEFA")
    
    canvas.append("text")
      .attr("x", 50)
      .attr("y", 350)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .text("Sea");

    return canvas
}

// *************************** Aerial View Draw Functions **********************************

// Draws the aerial view of the beach object
function drawAerialBeach(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    var line = [
        {"x": 0, "y": cH},
        {"x": 0, "y": cH * (1 - beach.getBeachWidth)},
        {"x": cW, "y": cH * (1 - beach.getBeachWidth)},
        {"x": cW, "y": cH},
        {"x": 0, "y": cH}
    ];
    
    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("fill", "#FAFAD2");

    canvas.append("text")
        .attr("x", canvasProp.getCanvasWidth * 0.475)
        .attr("y", canvasProp.getCanvasHeight * 0.5)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Beach");
    
    return canvas
}

// Draws the aerial view of the dune object
function drawAerialDune(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    var line = [
        {"x": 0, "y": cH * dune.getDuneWidth},
        {"x": 0, "y": 0},
        {"x": cW, "y": 0},
        {"x": cW, "y": cH * dune.getDuneWidth},
        {"x": 0, "y": cH * dune.getDuneWidth}
    ];
    
    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("fill", "#FAFAD2");

    canvas.append("text")
        .attr("x", canvasProp.getCanvasWidth * 0.475)
        .attr("y", canvasProp.getCanvasHeight * 0.1)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Dune");
    
    return canvas
}

function drawAerialSea(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    var line = [
        {"x": 0, "y": cH},
        {"x": 0, "y": cH * (1 - sea.getLength)},
        {"x": cW, "y": cH * (1 - sea.getLength)},
        {"x": cW, "y": cH},
        {"x": 0, "y": cH},
    ];

    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("fill", "#87CEFA")
    
    canvas.append("text")
      .attr("x", canvasProp.getCanvasWidth * 0.475)
      .attr("y", canvasProp.getCanvasHeight * 0.9)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .text("Sea");

    return canvas
}
import {canvasProp, beach, dune, sea, tide, preventions, seaBees} from './object_assets.js';

// Setups up initial canvas as svg to draw on.
// Then calls drawSideCanvas to draw the side view initially
var canvas = d3.select("#canvas")
    .append("svg")
    .attr("width", canvasProp.getCanvasWidth)
    .attr("height", canvasProp.getCanvasHeight);

drawSideCanvas(canvas)
document.getElementById("currYear").innerHTML = 2023;
document.getElementById("budgetRem").innerHTML = preventions.getBudget;

// *************************** Main Draw Functions **********************************

// Draws the side view of the canvas
function drawSideCanvas(canvas) {
    console.log("Drawing the Side")
    canvas = drawBackground(canvas)
    canvas = drawSideSea(canvas)
    var tideOption = getSelectedTide();
    canvas = drawSideTide(canvas, tideOption);
    canvas = drawSidePreventions(canvas)
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
    var tideOption = getSelectedTide();
    if (tideOption != 1) {canvas = drawAerialTide(canvas, tideOption)}
    canvas = drawAerialPreventions(canvas)
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

// *************************** User Input Change Functions **********************************
const sideViewOption = document.getElementById('sideViewButton');
sideViewOption.addEventListener('click', reDrawSideCanvas);

function reDrawSideCanvas() {
    canvasProp.setState = 0
    drawSideCanvas(canvas)
}

const aerialViewOption = document.getElementById('aerialViewButton');
aerialViewOption.addEventListener('click', reDrawAerialCanvas);

function reDrawAerialCanvas() {
    canvasProp.setState = 1
    drawAerialCanvas(canvas)
}

var timeSlider = d3.select("#timeSlider");

timeSlider.on("input", function() {
    if (this.value > canvasProp.getYear) {
        incrementYear();
    }
});

const playForwardOption = document.getElementById('playButton');
playForwardOption.addEventListener('click', skipYears);

function skipYears() {
    for (let i = 0; i < 5; i++) {       // skips 5 years
        if (canvasProp.getYear < 50) {
            incrementYear()
        }
    }
}

function incrementYear() {
    var seaRise = document.getElementById("seaRiseSlider").value;
    canvasProp.incrementYear()
    sea.increaseSeaRise(seaRise / 500);    // meters to cm
    preventions.increaseBudget(1000);
    document.getElementById("timeSlider").value = canvasProp.getYear;
    if (canvasProp.getState == 0) {drawSideCanvas(canvas)}
    else {drawAerialCanvas(canvas)}
    document.getElementById("currYear").innerHTML = (2023 + canvasProp.getYear);
    document.getElementById("budgetRem").innerHTML = preventions.getBudget;
}

// Detects a change in the tide option selected
var tideOptions = document.getElementsByName('tideSelection');
tideOptions.forEach(function(option) {
    option.addEventListener('change', function() {
        if (canvasProp.getState == 0) {drawSideCanvas(canvas)}
        else {drawAerialCanvas(canvas)}
    });
});

// Gets the tide option selected
function getSelectedTide() {
    var options = document.getElementsByName('tideSelection')
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            tide.calculateTideLength(options[i].value);
            return options[i].value;
        }
    }
    return null
}

const preventionPurchase = document.getElementById('confirmedPurchase');
preventionPurchase.addEventListener('click', purchasePrevention);


function purchasePrevention() {
    var prevention = getSelectedPrevention()
    if (prevention != null) {
        if (prevention.value <= preventions.getBudget) {
            preventions.decreaseBudget(prevention.value)
            document.getElementById("budgetRem").innerHTML = preventions.getBudget;
            preventions.addNew(seaBees)
        } else {
            window.alert("You do not have the budget available to make this purchase");
        }
    } else {window.alert("You need to select a prevention to buy!");}
    if (canvasProp.getState == 0) {drawSideCanvas(canvas)}
    else {drawAerialCanvas(canvas)}
}

// Gets the prevention option selected
function getSelectedPrevention() {
    var options = document.getElementsByName('preventionBought')
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            return options[i];
        }
    }
    return null
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
        .attr("fill", "#79B9E1")
    
    if (sea.getHeight > 0 || sea.getLength > 0) {
        canvas.append("text")
            .attr("x", 20)
            .attr("y", ((cH * beach.getBeachMinHeight)) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Sea");
    }    

    return canvas
}

function drawSideTide(canvas, tideOption) {
    var tH = -1;
    if (tideOption == 1) {tH = tide.getLow}
    else if (tideOption == 2) {tH = tide.getAverage()}
    else {tH = tide.getHigh}
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    var line = [
        {"x": 0, "y": cH * (beach.getBeachMinHeight - sea.getHeight)},
        {"x": 0, "y": cH * (beach.getBeachMinHeight - sea.getHeight - tH)},
        {"x": cW * tide.getLength, "y": cH * (beach.getBeachMinHeight - sea.getHeight - tH)},
        {"x": cW * tide.getLength, "y": cH * (beach.getBeachMinHeight - sea.getHeight)},
        {"x": 0, "y": cH * (beach.getBeachMinHeight - sea.getHeight)}
    ];

    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("fill", "#87CEFA")
    
    if (tideOption != 1) {
        canvas.append("text")
            .attr("x", 50)
            .attr("y", (cH * (beach.getBeachMinHeight - sea.getHeight)) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Tide");

    }

    return canvas
}

function drawSidePreventions(canvas) {
    for(var i = 0; i < preventions.bought.length; i++) {
        var prev = preventions.bought[i]
        if (prev.name == "seabees") {
            canvas = drawSideSeaBee(prev, canvas)
        } else {
            console.log("do something")
        }
    }
    return canvas;
}

function drawSideSeaBee(sbee, canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    var line = [
        {"x": cW * (beach.getBeachWidth - 0.05), "y": cH * (beach.getBeachMaxHeight + 0.05)},
        {"x": cW * (beach.getBeachWidth - 0.05), "y": cH * (beach.getBeachMaxHeight + 0.05 - sbee.getHeight)},
        {"x": cW * (beach.getBeachWidth - 0.05 - sbee.getWidth), "y": cH * (beach.getBeachMaxHeight + 0.05 - sbee.getHeight)},
        {"x": cW * (beach.getBeachWidth - 0.05 - sbee.getWidth), "y": cH * (beach.getBeachMaxHeight + 0.05)},
        {"x": cW * (beach.getBeachWidth - 0.05), "y": cH * (beach.getBeachMaxHeight + 0.05)}
    ];
    
    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("fill", "#808080");

    return canvas;
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
        .attr("fill", "#79B9E1")
    
    if (sea.getHeight > 0 || sea.getLength > 0) {
        canvas.append("text")
            .attr("x", canvasProp.getCanvasWidth * 0.475)
            .attr("y", canvasProp.getCanvasHeight * 0.9)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Sea");
    }

    return canvas
}

function drawAerialTide(canvas, tideOption) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    var line = [
        {"x": 0, "y": cH * (1 - sea.getLength)},
        {"x": 0, "y": cH * (1 - tide.getLength)},
        {"x": cW, "y": cH * (1 - tide.getLength)},
        {"x": cW, "y": cH * (1 - sea.getLength)},
        {"x": 0, "y": cH * (1 - sea.getLength)},
    ];

    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("fill", "#87CEFA")
    
    if (tideOption != 1) {
        canvas.append("text")
            .attr("x", cW * 0.475)
            .attr("y", cH * (1 - sea.getLength) - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Tide");
    }

    return canvas
}

function drawAerialPreventions(canvas) {
    for(var i = 0; i < preventions.bought.length; i++) {
        var prev = preventions.bought[i]
        if (prev.name == "seabees") {
            canvas = drawAerialSeaBee(canvas)
        } else {
            console.log("do something")
        }
    }
    return canvas;
}

function drawAerialSeaBee(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth

    for (var i = 0; i < cW; i = i + 25) {
        canvas.append('image')
            .attr("xlink:href", "imgs/seabeeAerial.png")
            .attr('width', 21)
            .attr('height', 21)
            .attr("x", 0 + i)
            .attr("y", cH * (1 - beach.getBeachWidth + 0.1));
    }

    return canvas;
}
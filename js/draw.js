import {canvasProp, beach, dune, sea, tide, maxWave, preventions, seaBees, housesArr, house} from './object_assets.js';

// Setups up initial canvas as svg to draw on.
// Then calls drawSideCanvas to draw the side view initially
var canvas = d3.select("#canvas")
    .append("svg")
    .attr("width", canvasProp.getCanvasWidth)
    .attr("height", canvasProp.getCanvasHeight);

// Creating predefined houses
for (var i = 0; i < 10; i++) {
    const houseT = Object.create(house)
    houseT.createNew(0.16, 0.05, 0.08, (i * 0.1))
    housesArr.getHouses.push(houseT)
}

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
    canvas = drawSideMaxWave(canvas, tideOption)
    canvas = drawSideTide(canvas, tideOption);
    canvas = drawSidePreventions(canvas)
    canvas = drawSideBeach(canvas)
    canvas = drawSideDune(canvas)
    canvas = drawSideHouse(canvas)
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
    canvas = drawAerialHouses(canvas)
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

var waveSlider = d3.select("#maxWaveHeightSlider");

waveSlider.on("input", function() {
    maxWave.setHeight = this.value;
    if (canvasProp.getState == 0) {drawSideCanvas(canvas)}
    else {drawAerialCanvas(canvas)}
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
    sea.increaseSeaRise(seaRise / 100);    // meters to cm
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
            let canvasElem = document.querySelector('#canvas')
            canvasElem.addEventListener("click", function handler(e) {
                var clickPos = getMousePosCanvas(canvasElem, e)
                const seaBee = Object.create(seaBees)
                seaBee.setLength = clickPos + (seaBee.getWidth / 2);
                seaBee.calcYPos();
                preventions.addNew(seaBee)
                sortPreventions()
                if (canvasProp.getState == 0) {
                    canvas = drawSidePreventions(canvas)
                    drawSideCanvas(canvas)
                }
                else {drawAerialCanvas(canvas)}
                e.currentTarget.removeEventListener(e.type, handler)
            })
        } else {
            window.alert("You do not have the budget available to make this purchase");
        }
    } else {window.alert("You need to select a prevention to buy!");}
}

function sortPreventions() {
    if (preventions.bought.length > 1) {
        preventions.bought.sort(compare)
    }
}

function compare(a, b) {
    if (a.getLength < b.getLength) {return -1;}
    if (a.getLength > b.getLength) {return 1;}
    return 0;
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

// Gets position of mouse click from user as % of canvas
function getMousePosCanvas(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) / canvasProp.getCanvasWidth;
    let y = (event.clientY - rect.top) / canvasProp.getCanvasHeight;
    if (canvasProp.getState == 0) {return x}
    else {return (1 - y)}
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

function drawSideMaxWave(canvas, tideOption) {
    var waveHeight = maxWave.getHeight / 4  // factored down by 75%
    var tH = -1;
    if (tideOption == 1) {tH = tide.getLow}
    else if (tideOption == 2) {tH = tide.getAverage()}
    else {tH = tide.getHigh}
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    
    // Before Preventions
    var maxUnbroken = tide.getLength;
    var tempPs = []
    for (var i = 0; i < preventions.bought.length; i++) {
        if (preventions.bought[i].name == "seabees")
            if (maxUnbroken > preventions.bought[i].length) {
                maxUnbroken = preventions.bought[i].length
            }
            tempPs.push(preventions.bought[i])
    }
    
    canvas = drawSideWave(canvas, tH, cW, cH, 0, maxUnbroken, waveHeight)

    var start = 0;
    var end = 0;
    //After preventions
    for (var i = 0; i < tempPs.length; i++) {
        const prev = tempPs[i]
        if (i+1 < tempPs.length){
            end = tempPs[i+1].getLength - (tempPs[i+1].getWidth / 2)
        } else {
            end = beach.getBeachWidth;
        }
        if (prev.name == "seabees") {
            var seaH =  cH * (beach.getBeachMinHeight - sea.getHeight - tH)
            if (cH * (prev.getYPos - prev.getHeight) <= seaH) {
                waveHeight = waveHeight * prev.getWaveDecrease
            }
            canvas = drawSideWave(canvas, tH, cW, cH, prev.length - (prev.getWidth / 2), end, waveHeight)
        }

    }
    
    return canvas
}

function drawSideWave(canvas, tH, cW, cH, xmin, xmax, waveH) {
    var line = [];
    var highLow = 0;
    for (var i = xmin; i < xmax; i = i + 0.05) {
        var variableT = 0;
        if (highLow % 2 != 0) {
            variableT = waveH
        }
        var height = cH * (beach.getBeachMinHeight - sea.getHeight - tH - variableT)
        line[highLow] = {"x": cW * i, "y": height}
        highLow = highLow + 1;
    }
    line.push({"x": cW * xmax, "y": cH * (beach.getBeachMinHeight - sea.getHeight - tH)})

    if (line != []) {
        var lineFunction = d3.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .curve(d3.curveNatural);

        canvas.append("path")
            .attr("d", lineFunction(line))
            .attr("fill", "#ABDCFB")
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
    // var line = [
    //     {"x": cW * sbee.getLength, "y": cH * (beach.getBeachMaxHeight + 0.05)},
    //     {"x": cW * sbee.getLength, "y": cH * (beach.getBeachMaxHeight + 0.05 - sbee.getHeight)},
    //     {"x": cW * (sbee.getLength - sbee.getWidth), "y": cH * (beach.getBeachMaxHeight + 0.05 - sbee.getHeight)},
    //     {"x": cW * (sbee.getLength - sbee.getWidth), "y": cH * (beach.getBeachMaxHeight + 0.05)},
    //     {"x": cW * sbee.getLength, "y": cH * (beach.getBeachMaxHeight + 0.05)}
    // ];

    var line = [
        {"x": cW * sbee.getLength, "y": cH * sbee.getYPos},
        {"x": cW * sbee.getLength, "y": cH * (sbee.getYPos - sbee.getHeight)},
        {"x": cW * (sbee.getLength - sbee.getWidth), "y": cH * (sbee.getYPos - sbee.getHeight)},
        {"x": cW * (sbee.getLength - sbee.getWidth), "y": cH * sbee.getYPos},
        {"x": cW * sbee.getLength, "y": cH * sbee.getYPos}
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

function drawSideHouse(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth

    var xPos = 101.5;
    var yPos = 80;
    
    canvas.append('image')
        .attr("xlink:href", "imgs/sideHouse.png")
        .attr('width', xPos)
        .attr('height', yPos)
        .attr("x", cW * (1 - dune.getDuneWidth + 0.05))
        .attr("y", cH * (1 - beach.getBeachMaxHeight - dune.getDuneHeight - 0.06));

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
        console.log("Here!")
        if (prev.name == "seabees") {
            canvas = drawAerialSeaBee(canvas, prev)
        } else {
            console.log("do something")
        }
    }
    return canvas;
}

function drawAerialSeaBee(canvas, seeB) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth

    console.log(seeB.getLength)

    for (var i = 0; i < cW; i = i + 25) {
        canvas.append('image')
            .attr("xlink:href", "imgs/seabeeAerial.png")
            .attr('width', 21)
            .attr('height', 21)
            .attr("x", 0 + i)
            .attr("y", cH * (1 - seeB.getLength));
    }

    return canvas;
}

function drawAerialHouses(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    for (var i = 0; i < housesArr.getHouses.length; i++) {
        const tempHouse = housesArr.getHouses[i]
        var line = [
            {"x": cW * tempHouse.getXPos, "y": cH * (dune.getDuneWidth - 0.05)},
            {"x": cW * tempHouse.getXPos, "y": cH * (dune.getDuneWidth - 0.05 - tempHouse.getWidth)},
            {"x": cW * (tempHouse.getXPos + tempHouse.getLength), "y": cH * (dune.getDuneWidth - 0.05 - tempHouse.getWidth)},
            {"x": cW * (tempHouse.getXPos + tempHouse.getLength), "y": cH * (dune.getDuneWidth - 0.05)},
            {"x": cW * tempHouse.getXPos, "y": cH * (dune.getDuneWidth - 0.05)}
        ];
    
        var lineFunction = d3.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; });
        
        canvas.append("path")
            .attr("d", lineFunction(line))
            .attr("fill", "#946b4b")
    }
    return canvas
}
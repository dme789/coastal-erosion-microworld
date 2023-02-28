import {canvasProp, beach, dune, sea, tide, maxWave, preventions, seaBees, housesArr, house, seaWalls, sand} from './object_assets.js';

// Gets the client's (user) canvas dimensions to set within our canvasProp
canvasProp.setCanvasHeight = document.getElementById('canvasPlaceHolder').getBoundingClientRect().height;
canvasProp.setCanvasWidth = document.getElementById('canvasPlaceHolder').getBoundingClientRect().width;


// Setups up initial canvas as svg to draw on.
// Then calls drawSideCanvas to draw the side view initially
var canvas = d3.select("#canvas")
    .append("svg")
    .attr("width", canvasProp.getCanvasWidth)
    .attr("height", canvasProp.getCanvasHeight);

// Creating predefined houses - first row
for (var i = 0; i < 10; i++) {
    const houseT = Object.create(house)
    houseT.createNew(0.1, 0.05, 0.08, (i * 0.1), 50000)
    housesArr.getHouses.push(houseT)
}
// Creating predefined houses - second row
for (var i = 0; i < 10; i++) {
    const houseT = Object.create(house)
    houseT.createNew(0.1, 0.05, 0.08, (i * 0.1), 40000)
    housesArr.getHouses.push(houseT)
}

drawSideCanvas(canvas)
document.getElementById("currYear").innerHTML = 2023;
document.getElementById("budgetRem").innerHTML = preventions.getBudget.toLocaleString();
document.getElementById("purchaseAmountTot").innerHTML = 0;


// *************************** Main Draw Functions **********************************

// Draws the side view of the canvas
function drawSideCanvas(canvas) {
    canvas.selectAll("*").remove();
    console.log("Drawing the Side")
    var tideOption = setSelectedTide();
    canvas = drawBackground(canvas)
    canvas = drawSideSea(canvas)
    canvas = drawSideMaxWave(canvas)
    canvas = drawSideTide(canvas);
    canvas = drawSidePreventions(canvas)
    canvas = drawSideBeach(canvas)
    canvas = drawSideDune(canvas)
    canvas = drawSideHouse(canvas)
    return canvas
}

// Draws the side view of the canvas
function drawAerialCanvas(canvas) {
    canvas.selectAll("*").remove();
    console.log("Drawing the aerial")
    var tideOption = setSelectedTide();
    canvas = drawBackground(canvas)
    canvas = drawAerialBeach(canvas)
    canvas = drawAerialDune(canvas)
    canvas = drawAerialSea(canvas)
    if (tideOption != 1) { canvas = drawAerialTide(canvas);}
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

// Detects a change in the tide option selected
var tideOptions = document.getElementsByName('tideSelection');
tideOptions.forEach(function(option) {
    option.addEventListener('change', function() {
        if (canvasProp.getState == 0) {drawSideCanvas(canvas)}
        else {drawAerialCanvas(canvas)}
    });
});

// Gets the tide option selected
function setSelectedTide() {
    var options = document.getElementsByName('tideSelection')
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            tide.calculateTideLength(options[i].value);
            var tH = -1;
            if (options[i].value == 1) {tH = tide.getLow}
            else if (options[i].value == 2) {tH = tide.getAverage()}
            else {tH = tide.getHigh}
            tide.setHeight = tH;
            return options[i].value;
        }
    }
}

const seaWallSelected = document.getElementById('seawall');
seaWallSelected.addEventListener("change", function() {
    if (seaWallSelected.checked) {
        dropdownH.style.display = "block";
    } else {
        dropdownH.style.display = "none";
    }
})

const sandSelected = document.getElementById('sand');
sandSelected.addEventListener("change", function() {
    if (sandSelected.checked) {
        dropdownH.style.display = "block";
    } else {
        dropdownH.style.display = "none";
    }
})

var preventionSelected = document.getElementsByName("preventionBought");
for (var i = 0; i < preventionSelected.length; i++) {
    preventionSelected[i].addEventListener("change", function() {
        if (seaWallSelected.checked) {
            dropdownH.style.display = "block";
        } else if(sandSelected.checked) {
            dropdownH.style.display = "block"
        } else {
            dropdownH.style.display = "none"
        }
    });
}

var preventionOptions = document.getElementsByName('preventionBought');
preventionOptions.forEach(function(option) {
    option.addEventListener('change', updatePurchaseAmount);
});

var seaWallOpt = document.getElementById("preventionHeightOptions");
seaWallOpt.addEventListener('change', updatePurchaseAmount);

const preventionPurchase = document.getElementById('confirmedPurchase');
preventionPurchase.addEventListener('click', purchasePrevention);

function purchasePrevention() {
    var prevention = getSelectedPrevention()
    if (prevention != null) {
        var purchaseCost = parseInt((document.getElementById("purchaseAmountTot").textContent).replace(/\D/g,''));
        console.log(purchaseCost)
        if (purchaseCost <= preventions.getBudget) {
            preventions.decreaseBudget(purchaseCost)
            document.getElementById("budgetRem").innerHTML = preventions.getBudget.toLocaleString();
            let canvasElem = document.querySelector('#canvas')
            canvasElem.addEventListener("click", function handler(e) {
                var clickPos = getMousePosCanvas(canvasElem, e)
                if (prevention.id == "seabees") {
                    const seaBee = Object.create(seaBees)
                    seaBee.setLength = clickPos + (seaBee.getWidth / 2);
                    seaBee.calcYPos();
                    preventions.addNew(seaBee)
                } else if (prevention.id == "seawall") {
                    const seaWall = Object.create(seaWalls)
                    seaWall.setLength = clickPos + (seaWall.getWidth / 2);
                    console.log(seaWall.getHeight)
                    seaWall.setHeight = (getUserPreventionHeight() / canvasProp.getRealHeight)
                    seaWall.calcYPos();
                    preventions.addNew(seaWall)
                } else if (prevention.id == "sand") {
                    const sandNew = Object.create(sand)
                    var sandH = getUserPreventionHeight()
                    sandNew.setHeight = (sandH / canvasProp.getRealHeight);
                    console.log(sandNew.getHeight)
                    sandNew.setWidth = (sandH / 20);
                    sandNew.setLength = clickPos + (sandNew.getWidth / 2);
                    sandNew.calcYPos();
                    sandNew.calcDecreaseRate();
                    preventions.addNew(sandNew)
                }
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

// Gets position of mouse click from user as % of canvas
function getMousePosCanvas(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) / canvasProp.getCanvasWidth;
    let y = (event.clientY - rect.top) / canvasProp.getCanvasHeight;
    if (canvasProp.getState == 0) {return x}
    else {return (1 - y)}
}


// *************************** Main Draw Functions **********************************

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
    document.getElementById("budgetRem").innerHTML = preventions.getBudget.toLocaleString();
    for(var i = 0; i < preventions.bought.length; i++) {
        var prev = preventions.bought[i]
        if (prev.name == "sand") {
            if(prev.getLifeSpan == 1) {
                preventions.bought.splice(i, 1)
            } else {
                prev.decreaseHeight();
            }
        }
    }
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

function getPreventionWaterLevel(length, heightToCheck) {
    for(var i = 0; i < preventions.bought.length; i++) {
        var prev = preventions.bought[i]
        if (prev.name == "seawall") {
            if ((prev.getYPos - prev.getHeight) <= heightToCheck) {
                if (prev.getLength < length) {
                    return prev.getLength;
                } 
                break;
            }
        } else if (prev.name == "sand") {
            if ((prev.getYPos - prev.getHeight) <= heightToCheck) {
                if (prev.getLength < length) {
                    return prev.getLength;
                } 
                break;
            }
        }
    }
    return length;
}

function updatePurchaseAmount() {
    var prevention = getSelectedPrevention();
    if(prevention.id == "seabees") {
        document.getElementById("purchaseAmountTot").innerHTML = (prevention.value * 1).toLocaleString();
    } else if (prevention.id == "seawall") {
        var wallH = getUserPreventionHeight()
        document.getElementById("purchaseAmountTot").innerHTML = (prevention.value * wallH).toLocaleString();
    } else if (prevention.id == "sand") {
        var sandH = getUserPreventionHeight()
        document.getElementById("purchaseAmountTot").innerHTML = (prevention.value * sandH).toLocaleString();
    }
}

function getUserPreventionHeight() {
    var dropdown = document.getElementById("preventionHeightOptions");
    var selectedValue = dropdown.options[dropdown.selectedIndex].value;
    return selectedValue;
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

    var seaLength = getPreventionWaterLevel(sea.getLength, (beach.getBeachMinHeight - sea.getHeight - tide.getHeight))
    
    var line = [
        {"x": 0, "y": cH},
        {"x": 0, "y": cH * (beach.getBeachMinHeight - sea.getHeight)},
        {"x": cW * seaLength, "y": cH * (beach.getBeachMinHeight - sea.getHeight)},
        {"x": cW * seaLength, "y": cH},
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

function drawSideTide(canvas) {
    var tH = tide.getHeight
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth

    var tideLength = getPreventionWaterLevel(tide.getLength, (beach.getBeachMinHeight - sea.getHeight - tH))

    var line = [
        {"x": 0, "y": cH * (beach.getBeachMinHeight - sea.getHeight)},
        {"x": 0, "y": cH * (beach.getBeachMinHeight - sea.getHeight - tH)},
        {"x": cW * tideLength, "y": cH * (beach.getBeachMinHeight - sea.getHeight - tH)},
        {"x": cW * tideLength, "y": cH * (beach.getBeachMinHeight - sea.getHeight)},
        {"x": 0, "y": cH * (beach.getBeachMinHeight - sea.getHeight)}
    ];

    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("fill", "#87CEFA")
    
    if (tH != 0) {
        canvas.append("text")
            .attr("x", 50)
            .attr("y", (cH * (beach.getBeachMinHeight - sea.getHeight)) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Tide");

    }

    return canvas
}

function drawSideMaxWave(canvas) {
    var waveHeight = maxWave.getHeight / 4  // factored down by 75%
    var tH = tide.getHeight
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    
    var seaH =  cH * (beach.getBeachMinHeight - sea.getHeight - tH)
    // Before Preventions
    var maxUnbroken = tide.getLength;
    var j = 0
    for (var j; j < preventions.bought.length; j++) {
        if (maxUnbroken > preventions.bought[j].getLength) {
            if (cH * (preventions.bought[j].getYPos - preventions.bought[j].getHeight) <= seaH) {
                maxUnbroken = preventions.bought[j].getLength
                break;
            }
        }
    }
    
    canvas = drawSideWave(canvas, tH, cW, cH, 0, maxUnbroken, waveHeight)

    var end = 0;
    //After preventions
    for (var i = j; i < preventions.bought.length; i++) {
        const prev = preventions.bought[i]
        if (i+1 < preventions.bought.length){
            end = preventions.bought[i+1].getLength - (preventions.bought[i+1].getWidth / 2)
        } else {
            end = beach.getBeachWidth;
        }
        if (prev.name == "seabees") {
            if (cH * (prev.getYPos - prev.getHeight) <= seaH) {
                waveHeight = waveHeight * prev.getWaveDecrease
            }
        } else if (prev.name == "seawall" || prev.name == "sand") {
            if (cH * (prev.getYPos - prev.getHeight) <= seaH) {
                waveHeight = 0
            }
        }
        canvas = drawSideWave(canvas, tH, cW, cH, prev.length - (prev.getWidth / 2), end, waveHeight)
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
        } else if (prev.name == "seawall") {
            canvas = drawSideSeaWall(prev, canvas)
        } else if (prev.name == "sand") {
            canvas = drawSideSand(prev, canvas)
        }
    }
    return canvas;
}

function drawSideSeaBee(sbee, canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth

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

function drawSideSeaWall(seawall, canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth

    var line = [
        {"x": cW * seawall.getLength, "y": cH * seawall.getYPos},
        {"x": cW * seawall.getLength, "y": cH * (seawall.getYPos - seawall.getHeight)},
        {"x": cW * (seawall.getLength - seawall.getWidth), "y": cH * (seawall.getYPos - seawall.getHeight)},
        {"x": cW * (seawall.getLength - seawall.getWidth), "y": cH * seawall.getYPos},
        {"x": cW * seawall.getLength, "y": cH * seawall.getYPos}
    ];
    
    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("fill", "#595959");

    return canvas;
}

function drawSideSand(sand, canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    console.log("Height: " + sand.getHeight)
    
    canvas.append("circle")
        .attr('cx', (cW * sand.getLength))
        .attr('cy', (cH * sand.getYPos))
        .attr('r', (cH * sand.getHeight))
        .attr('stroke', 'black')
        .attr("stroke-width", 0.5)
        .attr('fill', '#FAFAD2');

    return canvas;
}

function drawSideHouse(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth

    var distRow = 0;
    var fillColour = "#946b4b"
    for(var i = 0; i < 2; i ++) {
        const tempHouse = housesArr.getHouses[i * 10]
        if (i > 0) {distRow = 0.1; fillColour = "#a9886e"}
        var line = [
            {"x": cW * (beach.getBeachWidth + dune.getDuneBankLength + distRow), "y": cH * (beach.getBeachMaxHeight - dune.getDuneHeight)},
            {"x": cW * (beach.getBeachWidth + dune.getDuneBankLength + distRow), "y": cH * (beach.getBeachMaxHeight - dune.getDuneHeight - tempHouse.getHeight)},
            {"x": cW * (beach.getBeachWidth + dune.getDuneBankLength + distRow + tempHouse.getWidth), "y": cH * (beach.getBeachMaxHeight - dune.getDuneHeight - tempHouse.getHeight)},
            {"x": cW * (beach.getBeachWidth + dune.getDuneBankLength + distRow + tempHouse.getWidth), "y": cH * (beach.getBeachMaxHeight - dune.getDuneHeight)},
            {"x": cW * (beach.getBeachWidth + dune.getDuneBankLength + distRow), "y": cH * (beach.getBeachMaxHeight - dune.getDuneHeight)}
        ];
        
        var lineFunction = d3.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; });
            
        canvas.append("path")
            .attr("d", lineFunction(line))
            .attr("fill", fillColour)
    }

    // var xPos = 101.5;
    // var yPos = 80;
    
    // canvas.append('image')
    //     .attr("xlink:href", "imgs/sideHouse.png")
    //     .attr('width', yPos)
    //     .attr('height', 10)
    //     .attr("x", cW * (1 - dune.getDuneWidth + 0.025))
    //     .attr("y", cH * (1 - beach.getBeachMaxHeight - dune.getDuneHeight - ((yPos/2) /cH)));

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

    var seaLength = getPreventionWaterLevel(sea.getLength, (beach.getBeachMinHeight - sea.getHeight - tide.getHeight))

    var line = [
        {"x": 0, "y": cH},
        {"x": 0, "y": cH * (1 - seaLength)},
        {"x": cW, "y": cH * (1 - seaLength)},
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

function drawAerialTide(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth

    var tideLength = getPreventionWaterLevel(tide.getLength, (beach.getBeachMinHeight - sea.getHeight - tide.getHeight))

    if (tideLength > sea.getLength) {
        var line = [
            {"x": 0, "y": cH * (1 - sea.getLength)},
            {"x": 0, "y": cH * (1 - tideLength)},
            {"x": cW, "y": cH * (1 - tideLength)},
            {"x": cW, "y": cH * (1 - sea.getLength)},
            {"x": 0, "y": cH * (1 - sea.getLength)},
        ];
        console.log(line)
    
        var lineFunction = d3.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; });
        
        canvas.append("path")
            .attr("d", lineFunction(line))
            .attr("fill", "#87CEFA")
        
        if (tide.getHeight != 0) {
            canvas.append("text")
                .attr("x", cW * 0.475)
                .attr("y", cH * (1 - sea.getLength) - 10)
                .attr("text-anchor", "middle")
                .style("font-size", "24px")
                .text("Tide");
        }
    }

    return canvas
}

function drawAerialPreventions(canvas) {
    for(var i = 0; i < preventions.bought.length; i++) {
        var prev = preventions.bought[i]
        if (prev.name == "seabees") {
            canvas = drawAerialSeaBee(prev, canvas)
        } else if (prev.name == "seawall") {
            var seaH =  beach.getBeachMinHeight - sea.getHeight - tide.getHeight
            if (prev.getYPos - prev.getHeight <= seaH) {
                canvas = drawAerialSeaWall(prev, canvas)
            }
        }
    }
    return canvas;
}

function drawAerialSeaBee(seeB, canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth

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

function drawAerialSeaWall (seaWall, canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    var line = [
        {"x": 0, "y": cH * (1 - seaWall.getLength + (seaWall.getWidth / 2))},
        {"x": 0, "y": cH * (1 - seaWall.getLength - (seaWall.getWidth / 2))},
        {"x": cW, "y": cH * (1 - seaWall.getLength - (seaWall.getWidth / 2))},
        {"x": cW, "y": cH * (1 - seaWall.getLength + (seaWall.getWidth / 2))},
        {"x": 0, "y": cH * (1 - seaWall.getLength + (seaWall.getWidth / 2))}
    ];
    
    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
    
    canvas.append("path")
        .attr("d", lineFunction(line))
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("fill", "#595959");
    
    return canvas
}

function drawAerialHouses(canvas) {
    const cH = canvasProp.getCanvasHeight
    const cW = canvasProp.getCanvasWidth
    var distRow = 0;
    var fillColour = "#946b4b"
    for (var i = 0; i < housesArr.getHouses.length; i++) {
        const tempHouse = housesArr.getHouses[i]
        if (i >= 10) {distRow = 0.1; fillColour = "#a9886e"}
        var line = [
            {"x": cW * tempHouse.getXPos, "y": cH * (dune.getDuneWidth - dune.getDuneBankLength - distRow)},
            {"x": cW * tempHouse.getXPos, "y": cH * (dune.getDuneWidth - dune.getDuneBankLength - tempHouse.getWidth - distRow)},
            {"x": cW * (tempHouse.getXPos + tempHouse.getLength), "y": cH * (dune.getDuneWidth - dune.getDuneBankLength - tempHouse.getWidth - distRow)},
            {"x": cW * (tempHouse.getXPos + tempHouse.getLength), "y": cH * (dune.getDuneWidth - dune.getDuneBankLength - distRow)},
            {"x": cW * tempHouse.getXPos, "y": cH * (dune.getDuneWidth - dune.getDuneBankLength - distRow)}
        ];
    
        var lineFunction = d3.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; });
        
        canvas.append("path")
            .attr("d", lineFunction(line))
            .attr("fill", fillColour)
    }
    return canvas
}
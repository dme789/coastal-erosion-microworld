// Propeties of the visualisation element and microworld rules.
export const canvasProp = {
    height: 0, // div element height
    width: 0,   // div element width
    realHeight: 15,
    realWidth: 1000,
    realLength: 100,
    state: 0,   // 0 = side view, 1 = aerial view
    year: 0,    // year of sim    
    dimensions: 0,  // 0 = dimensions not shown
    wavesState: 1,  // 1 = waves shown
    weatherStatus: false, // true once weather is set by user
    budgetStatus: false, // true once weather is set by user
    simStatus: false,   // true once simulation is over   
    housesDestroyed: false,     // true when all houses destroyed

    get getCanvasHeight() {
        return this.height;
    },
    set setCanvasHeight(val) {
        this.height = val;
    },
    get getCanvasWidth() {
        return this.width;
    },
    set setCanvasWidth(val) {
        this.width = val;
    },
    get getRealHeight() {
        return this.realHeight;
    },
    get getRealWidth() {
        return this.realWidth;
    },
    get getRealLength() {
        return this.realLength;
    },
    get getState() {
        return this.state;
    },
    set setState(val) {
        this.state = val;
    },
    get getYear() {
        return this.year;
    },
    get getStateDim() {
        return this.dimensions;
    },
    set setStateDim(val) {
        this.dimensions = val;
    },
    get getStateWaves() {
        return this.wavesState;
    },
    set setStateWaves(val) {
        this.wavesState = val;
    },
    get getWeatherStatus() {
        return this.weatherStatus;
    },
    set setWeatherStatus(val) {
        this.weatherStatus = val
    },
    get getBudgetStatus() {
        return this.budgetStatus;
    },
    set setBudgetStatus(val) {
        this.budgetStatus = val
    },
    get getSimFinished() {
        return this.simStatus;
    },
    set setSimFinished(val) {
        this.simStatus = val;
    },
    get getHousesDestroyed() {
        return this.housesDestroyed;
    },
    set setHousesDestroyed(val) {
        this.housesDestroyed = val;
    },
    incrementYear: function() {
        this.year = this.year + 1;
    },
};

// Beach object and relevant functions
// Attributes in terms of % of canvas
export const beach = {
    width: 0.7,
    slopeWidth: 0.7,     
    minHeight: 0.85,
    maxHeight: 0.55,
    slope: 0.428571,      // rise/run => min
    absMinHeight: 0.85,
    absMaxHeight: 0.55,
    lifeSpan: 0,
    heightDecreaseRate: 0,

    get getBeachWidth() {
        return this.width;
    },
    set setBeachWidth(val) {
        this.width = val;
        this.reCalculateSlope();
    },
    get getSlopeWidth() {
        return this.slopeWidth;
    },
    set setSlopeWidth(val) {
        this.slopeWidth = val;
    },
    get getBeachSlope() {
        return this.slope;
    },
    reCalculateSlope: function() {
        this.slope = (this.minHeight - this.maxHeight) / this.width;
    },
    get getBeachMaxHeight() {
        return this.maxHeight;
    },
    set setBeachMaxHeight(val) {
        if (val < this.absMaxHeight) {
            this.maxHeight = val;
            this.reCalculateSlope();
        }
    },
    get getBeachMinHeight() {
        return this.minHeight;
    },
    set setBeachMinHeight(val) {
        if (val < this.absMinHeight) {
            this.minHeight = val;
            this.reCalculateSlope();
        }
    },
    get getAbsMinHeight() {
        return this.absMinHeight
    },
    set setAbsMinHeight(val) {
        this.absMinHeight = val;
        this.reCalculateSlope();
    },
    get getAbsMaxHeight() {
        return this.absMaxHeight
    },
    set setAbsMaxHeight(val) {
        this.absMaxHeight = val;
        this.reCalculateSlope();
    },
    get getLifeSpan() {
        return this.lifeSpan;
    },
    set setLifeSpan(val) {
        this.lifeSpan = val;
    },
    get getHeightDecreaseRate() {
        return this.heightDecreaseRate;
    },
    calcDecreaseRate: function() {
        this.heightDecreaseRate = (this.maxHeight - this.absMaxHeight) / this.lifeSpan;
        dune.reCalculateSlope(this.heightDecreaseRate * this.lifeSpan) 
    },
    decreaseHeight: function() {
        this.maxHeight = this.maxHeight - this.heightDecreaseRate;
        this.minHeight = this.minHeight - this.heightDecreaseRate;
        this.lifeSpan = this.lifeSpan - 1;
        dune.reCalculateSlope(this.heightDecreaseRate * this.lifeSpan)
    },
};

// Beach object and relevant functions
// Attributes in terms of % of canvas
export const dune = {
    height: 0.08333,
    bankLength: 0.05,
    absBankLength: 0.05,
    width: 0.25,
    slope: 1.66666,
    lengthLost: 0,

    get getDuneHeight() {
        return this.height
    },
    set setDuneHeight(val) {
        this.height = val
    },
    get getDuneBankLength() {
        return this.bankLength
    },
    set setDuneBankLength(val) {
        this.bankLength = val
        this.reCalcSlope()
    },
    get getAbsBankLength() {
        return this.absBankLength;
    },
    get getDuneWidth() {
        return this.width
    },
    get getSlope() {
        return this.slope;
    },
    get getLengthLost() {
        return this.lengthLost;
    },
    increaseLengthLost: function(val) {
        this.lengthLost = this.lengthLost + val;
    },
    reCalcSlope: function() {
        this.slope = this.height / this.bankLength
    },
    reCalculateSlope: function(decrease) {
        this.slope = (this.height + decrease) / this.bankLength;
    },
    // this function erodes the dune by the given erosionRate
    // two erosion types occur, 
    erode: function(erosionRate) {
        if(this.slope <= -1) {
            this.setDuneBankLength = 0;
        } else if (tide.getLength > beach.getSlopeWidth) {                  // Normal Erosion
            this.setDuneBankLength = this.getDuneBankLength - erosionRate;
            beach.setBeachWidth = beach.getBeachWidth + erosionRate;
            this.increaseLengthLost(erosionRate)
        } else if (beach.getBeachWidth + maxWave.getWashLength > beach.getSlopeWidth) {     // Wave Erosion
            var erosionRate = erosionRate / 5;          // 80% erosion reduction due to being storm erosion
            this.setDuneBankLength = this.getDuneBankLength - erosionRate;
            beach.setBeachWidth = beach.getBeachWidth + erosionRate;
            this.increaseLengthLost(erosionRate)
        }
    }
};

export const sea = {
    totalSeaRise: 0,    // % of canvas
    length: 0.35,        // % of canvas
    height: 0.15,     // % of canvas

    get getSeaRise() {
        return this.totalSeaRise;
    },
    set setSeaRise(val) {
        this.totalSeaRise = val;
    },
    get getLength() {
        return this.length;
    },
    set setLength(val) {
        this.baseHeight = val;
    },
    get getHeight() {
        return this.height;
    },
    // this function takes in a value as meters, and calculates the result as % of canvas
    increaseSeaRise: function(val) {
        var tempSeaRise = (1 / canvasProp.getRealHeight) * val;
        this.totalSeaRise = this.totalSeaRise + tempSeaRise;
        this.height = this.height + tempSeaRise;
        this.calcSeaLength();
    },
    calcSeaLength: function() {
        if ((beach.getAbsMinHeight - this.height) >= beach.getBeachMinHeight) {
            this.length = 0;
        } else if ((beach.getAbsMinHeight - this.height) >= beach.getBeachMaxHeight) {
            this.length = (this.height - (beach.getAbsMinHeight - beach.getBeachMinHeight)) / beach.getBeachSlope;
        } else if ((beach.getAbsMinHeight - this.height) >= (beach.getBeachMaxHeight - dune.getDuneHeight)) {
            var duneWaterLine = beach.getBeachMaxHeight - (beach.getAbsMinHeight - this.height);
            this.length = beach.getBeachWidth + (duneWaterLine/ dune.getSlope);
        } else {
            this.length = 1
        }
    }
}

export const tide = {
    low: 0,
    high: 0.1,
    length: 0,
    height: -1,
    currHeight: -1,

    get getLow() {
        return this.low;
    },
    set setLow(val) {
        this.low = val;
    },
    get getHigh() {
        return this.high;
    },
    set setHigh(val) {
        this.high = val;
    },
    get getLength() {
        return this.length;
    },
    set setLength(val) {
        this.length = val;
    },
    get getHeight() {
        return this.height;
    },
    set setHeight(val) {
        this.height = val;
    },
    get getCurrHeight() {
        return this.currHeight;
    },
    set setCurrHeight(val) {
        this.currHeight = val;
    },
    getAverage: function() {
        return ((this.high - this.low) / 2) + this.low
    },
    setTidalHeight: function(tideOption) {
        if (tideOption == 1) {this.currHeight = this.getLow}
        else if (tideOption == 2) {this.currHeight = this.getAverage()}
        else {this.currHeight = this.getHigh}
        this.calculateTideLength()
    },
    calculateTideLength: function() {
        var height = sea.getHeight + this.currHeight;
        if ((beach.getAbsMinHeight - sea.getHeight - this.currHeight) >= beach.getBeachMaxHeight) {
            this.length = (height - (beach.getAbsMinHeight - beach.getBeachMinHeight)) / beach.getBeachSlope;
        } else if ((beach.getAbsMinHeight - sea.getHeight - this.currHeight) >= (beach.getAbsMaxHeight - dune.getDuneHeight)) {
            var duneWaterLine = beach.getBeachMaxHeight - (beach.getBeachMinHeight - height);
            this.length = beach.getBeachWidth + (duneWaterLine/ dune.getSlope);
        } else {
            this.length = 1
        }
    }
}

export const maxWave = {
    height: 0,
    length: 0,
    washLength: 0,

    get getHeight() {
        return this.height;
    },
    set setHeight(val) {
        this.height = (1 / canvasProp.getRealHeight) * val;
        this.length = tide.getLength
    },
    get getWashLength() {
        return this.washLength;
    },
    set setWashLength(val) {
        this.washLength = val;
    },
    calculateWaveWashLength: function() {
        var height = sea.getHeight + tide.getHeight;
        if ((beach.getAbsMinHeight - sea.getHeight - tide.getCurrHeight) >= beach.getBeachMaxHeight) {
            this.washLength = 0;
        } else if ((beach.getAbsMinHeight - sea.getHeight - tide.getCurrHeight) >= (beach.getAbsMaxHeight - dune.getDuneHeight)) {
            var duneWaterLine = beach.getBeachMaxHeight - (beach.getBeachMinHeight - height);
            this.washLength = duneWaterLine/dune.getSlope;
        } else {
            this.washLength = 1 - beach.getBeachWidth
        }
    }
}

export const preventions = {
    budget: 0,
    totalSpent: 0,
    // budget: 100000000,
    bought: [],

    get getBudget() {
        return this.budget;
    },
    set setBudget(val) {
        this.budget = val;
    },
    get getTotalSpent() {
        return this.totalSpent;
    },
    increaseBudget: function(val) {
        this.budget = this.budget + val;
    },
    decreaseBudget: function(val) {
        this.totalSpent = this.totalSpent + val;
        this.budget = this.budget - val;
    },
    get getBought() {
        return this.bought;
    },
    set setBought(val) {
        this.bought = val;
    },
    addNew: function(newPrevention) {
        this.bought.push(newPrevention)
    }
}

export const seaBees = {
    name: "seabees",
    height: 0.066667,
    width: 0.02,
    length: 0,          // x-position of sea-bees
    waveDecrease: 0.5,
    yPos: 0,

    get getName() {
        return this.name;
    },
    get getHeight() {
        return this.height;
    },
    set setHeight(val) {
        this.height = val;
    },
    get getWidth() {
        return this.width
    },
    set setWidth(val) {
        this.width = val;
    },
    get getLength() {
        return this.length
    },
    set setLength(val) {
        this.length = val;
    },
    get getWaveDecrease() {
        return this.waveDecrease;
    },
    get getYPos() {
        return this.yPos;
    },
    set setYPos(val) {
        this.yPos = val;
    },
    calcYPos: function() {
        var rise = (this.length - (this.width/2) - 0.005) * beach.getBeachSlope;
        this.yPos = beach.getBeachMinHeight - rise;
    }
}

export const seaWalls = {
    name: "seawall",
    height: 0.08,
    width: 0.02,
    length: 0,
    yPos: 0,

    get getName() {
        return this.name;
    },
    get getHeight() {
        return this.height;
    },
    set setHeight(val) {
        this.height = val;
    },
    get getWidth() {
        return this.width;
    },
    set setWidth(val) {
        this.width = val;
    },
    get getLength() {
        return this.length;
    },
    set setLength(val) {
        this.length = val;
    },
    get getYPos() {
        return this.yPos;
    },
    set setYPos(val) {
        this.yPos = val;
    },
    calcYPos: function() {
        var rise = (this.length - (this.width/2) - 0.005) * beach.getBeachSlope;
        this.yPos = beach.getBeachMinHeight - rise;
    },
    createNew: function(h, w, l) {
        this.height = h;
        this.width = w;
        this.length = l;
    }
}

export const housesArr = {
    houses: [],
    numHousesDestroyed: 0,

    get getHouses() {
        return this.houses;
    },
    get getNumHousesDestroyed() {
        return this.numHousesDestroyed;
    },
    incrNumHousesDestroyed: function() {
        this.numHousesDestroyed = this.numHousesDestroyed + 1;
    }
}

export const house = {
    height: 0,
    width: 0,
    length: 0,
    xPos: 0,
    value: 0,
    dunePos: 0.03,
    fallen: false,

    get getHeight() {
        return this.height;
    },
    set setHeight(val) {
        this.height = val;
    },
    get getWidth() {
        return this.width;
    },
    set setWidth(val) {
        this.width = val;
    },
    get getLength() {
        return this.length;
    },
    set setLength(val) {
        this.length = val;
    },
    get getXPos() {
        return this.xPos;
    },
    set setXPos(val) {
        this.xPos = val
    },
    get getValue() {
        return this.value;
    },
    set setValue(val) {
        this.value = val;
    },
    get getDunePos() {
        return this.dunePos;
    },
    set setDunePos(val) {
        this.dunePos = val;
    },
    get getStatus() {
        return this.fallen;
    },
    set setStatus(val) {
        this.fallen = val;
    },
    createNew: function(h, w, l, x, a) {
        this.height = h;
        this.width = w;
        this.length = l;
        this.xPos = x;
        this.value = a;
    }
}
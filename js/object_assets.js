// Canvas properties
export const canvasProp = {
    height: 0,
    width: 0,
    realHeight: 15,
    state: 0,       // 0 = side view, 1 = aerial view
    year: 0,

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
    get getState() {
        return this.state;
    },
    set setState(val) {
        this.state = val;
    },
    get getYear() {
        return this.year;
    },
    incrementYear: function() {
        this.year = this.year + 1;
    },
};

// Beach object and relevant functions
// Attributes in terms of % of canvas
export const beach = {
    width: 0.8,     
    minHeight: 0.65,
    maxHeight: 0.55,
    slope: 0.125,      // rise/run => min
    absMinHeight: 0.65,
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
    },
    decreaseHeight: function() {
        this.maxHeight = this.maxHeight - this.heightDecreaseRate;
        this.minHeight = this.minHeight - this.heightDecreaseRate;
        this.lifeSpan = this.lifeSpan - 1;
    },
};

// Beach object and relevant functions
// Attributes in terms of % of canvas
export const dune = {
    height: 0.15,
    bankLength: 0.01,
    width: 1 - beach.getBeachWidth,
    slope: 15,

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
    },
    get getDuneWidth() {
        return this.width
    },
    get getSlope() {
        return this.slope;
    },
    reCalculateSlope: function() {
        this.slope = this.height / this.bankLength;
    },
};

export const sea = {
    totalSeaRise: 0,    // % of canvas
    length: 0,        // % of canvas
    height: 0,     // % of canvas

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
            console.log("I'm here 1")
            this.length = 0;
        } else if ((beach.getAbsMinHeight - this.height) >= beach.getBeachMaxHeight) {
            console.log("I'm here 2")
            this.length = (this.height - (beach.getAbsMinHeight - beach.getBeachMinHeight)) / beach.getBeachSlope;
            console.log("L2 " + this.length)
        } else if ((beach.getAbsMinHeight - this.height) >= (beach.getBeachMaxHeight - dune.getDuneHeight)) {
            console.log("I'm here 3")
            var duneWaterLine = beach.getAbsMinHeight - (beach.getAbsMinHeight - this.height);
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
    getAverage: function() {
        return ((this.high - this.low) / 2) + this.low
    },
    calculateTideLength: function(tideOption) {
        var tideHeight = -1;
        if (tideOption == 1) {tideHeight = this.getLow}
        else if (tideOption == 2) {tideHeight = this.getAverage()}
        else {tideHeight = this.getHigh}
        if ((beach.getBeachMinHeight - sea.getHeight - tideHeight) >= beach.getBeachMaxHeight) {
            var height = sea.getHeight + tideHeight;
            this.length = height / beach.getBeachSlope;
        } else if ((beach.getBeachMinHeight - sea.getHeight - tideHeight) >= (beach.getBeachMaxHeight - dune.getDuneHeight)) {
            var height = sea.getHeight + tideHeight;
            var duneWaterLine = beach.getBeachMaxHeight - (beach.getBeachMinHeight - sea.getHeight - height);
            this.length = beach.getBeachWidth + (duneWaterLine/ dune.getSlope);
        } else {
            this.length = 1
        }
    }
}

export const maxWave = {
    height: 0,
    length: 0,

    get getHeight() {
        return this.height;
    },
    set setHeight(val) {
        this.height = (1 / canvasProp.getRealHeight) * val;
        this.length = tide.getLength
    }
}

export const preventions = {
    budget: 500000,
    bought: [],

    get getBudget() {
        return this.budget;
    },
    set setBudget(val) {
        this.budget = val;
    },
    increaseBudget: function(val) {
        this.budget = this.budget + val;
    },
    decreaseBudget: function(val) {
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
    height: 0.08,
    width: 0.05,
    length: 0,          // x-position of sea-bees
    waveDecrease: 0.3,
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
    width: 0.025,
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

    get getHouses() {
        return this.houses;
    }
}

export const house = {
    height: 0,
    width: 0,
    length: 0,
    xPos: 0,
    value: 0,

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
    createNew: function(h, w, l, x, a) {
        this.height = h;
        this.width = w;
        this.length = l;
        this.xPos = x;
        this.value = a;
    }
}
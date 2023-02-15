// Canvas properties
export const canvasProp = {
    height: 500,
    width: 950,
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
    minHeight: 0.75,
    maxHeight: 0.5,
    slope: 0.3125,      // rise/run => min

    get getBeachWidth() {
        return this.width;
    },
    set setBeachWidth(val) {
        this.width = val;
    },
    get getBeachSlope() {
        return this.slope;
    },
    reCalculateSlope: function() {
        this.slope = (this.maxHeight - this.minHeight) / this.width;
    },
    get getBeachMaxHeight() {
        return this.maxHeight;
    },
    set setBeachMaxHeight(val) {
        this.maxHeight = val;
    },
    get getBeachMinHeight() {
        return this.minHeight;
    },
    set setBeachMinHeight(val) {
        this.minHeight = val;
    }
};

// Beach object and relevant functions
// Attributes in terms of % of canvas
export const dune = {
    height: 0.15,
    bankLength: 0.01,
    width: 1- beach.getBeachWidth,
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
    length: 0.2,        // % of canvas
    height: 0.0625,     // % of canvas

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
        var tempSeaRise = (1 / canvasProp.getRealHeight) * (this.totalSeaRise + val);
        this.totalSeaRise = this.totalSeaRise + tempSeaRise;
        if ((beach.getBeachMinHeight - this.height) >= beach.getBeachMaxHeight) {
            this.height = this.height + tempSeaRise;
            this.length = this.height / beach.getBeachSlope;
        } else if ((beach.getBeachMinHeight - this.height) >= (beach.getBeachMaxHeight - dune.getDuneHeight)) {
            this.height = this.height + tempSeaRise;
            var duneWaterLine = beach.getBeachMaxHeight - (beach.getBeachMinHeight - this.height);
            this.length = this.length + (duneWaterLine/ dune.getSlope);
        } else {
            this.height = this.height + tempSeaRise;
            this.length = 1
        }
    }
}

export const tide = {
    low: 0,
    high: 0.1,
    length: 0,

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
    getAverage: function() {
        return ((this.high - this.low) / 2) + this.low
    },
    calculateTideLength: function(tideOption) {
        var tideHeight = -1;
        if (tideOption == 1) {tideHeight = this.getLow}
        else if (tideOption == 2) {tideHeight = this.getAverage()}
        else {tideHeight = this.getHigh}
        if ((beach.getBeachMinHeight - sea.height - tideHeight) >= beach.getBeachMaxHeight) {
            var height = sea.height + tideHeight;
            this.length = height / beach.getBeachSlope;
        } else if ((beach.getBeachMinHeight - sea.height - tideHeight) >= (beach.getBeachMaxHeight - dune.getDuneHeight)) {
            var height = sea.height + tideHeight;
            var duneWaterLine = beach.getBeachMaxHeight - (beach.getBeachMinHeight - sea.height - tideHeight);
            this.length = this.length + (duneWaterLine/ dune.getSlope);
        } else {
            this.length = 1
        }
    }
}
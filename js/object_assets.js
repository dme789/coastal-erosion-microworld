// Canvas properties
export const canvasProp = {
    height: 500,
    width: 950,

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
    }
};

// Beach object and relevant functions
// Attributes in terms of % of canvas
export const beach = {
    width: 0.8,
    length: 0,
    slope: 0.15,
    minHeight: 0.75,
    maxHeight: 0.5,

    get getBeachWidth() {
        return this.width;
    },
    set setBeachWidth(val) {
        this.width = val;
    },
    get getBeachLength() {
        return this.length;
    },
    set setBeachLength(val) {
        this.length = val;
    },
    get getBeachSlope() {
        return this.slope;
    },
    set setBeachSlope(val) {
        this.slope = val
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
    }
};
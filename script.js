var percentDaysChecked;

var daysPerBoatVisit;
var numberOfArtsOnBoat = 4;

var numberofArtsInMuseum;
var purchasesPerVisit;

var maxSimulatableDays;
var simulationItterations;

var museum;
var daysElapsed;

function log(msg) {
    document.getElementById("console").innerHTML += msg+"\n";
}

function postResults(msg) {
    document.getElementById("results").innerHTML = msg;
}

function parseIntArg(elName) {
    val = parseInt(document.getElementById(elName).value);
    if (isNaN(val)) {
        alert("Invalid argument for "+elName)
    }
    return val;
}

function parseFloatArg(elName) {
    val = parseFloat(document.getElementById(elName).value);
    if (isNaN(val)) {
        alert("Invalid argument for "+elName)
    }
    return val;
}

function loadOptions() {
    percentDaysChecked = parseFloatArg("percentDaysChecked");

    daysPerBoatVisit = parseIntArg("daysPerBoatVisit");

    numberofArtsInMuseum = parseIntArg("numberofArtsInMuseum");
    purchasesPerVisit = parseIntArg("purchasesPerVisit");

    maxSimulatableDays = parseIntArg("maxSimulatableYears")*365;
    simulationItterations = parseIntArg("simulationItterations");
}

function simulate() {
    museum = new Array(numberofArtsInMuseum).fill(false);
    museum[Math.floor(Math.random() * numberofArtsInMuseum)] = true; // freebie on day 0, is always real.
    daysElapsed = 0;

    while (true) {
        daysElapsed += daysPerBoatVisit;
        if (Math.random() > percentDaysChecked) {
            log("Day " + daysElapsed + " - Missed a Redd visit :(");
        } else {
            simulateVisit();
        }

        if (!museum.some((art) => art === false)) {
            log("Day " + daysElapsed + " - Got all the art!");
            break;
        }
        if (daysElapsed > maxSimulatableDays) {
            log("Day " + daysElapsed + " - Ran out of time...");
            break;
        }
    }
    return daysElapsed;
}

function simulateVisit() {
    //this was refactored poorly
    //used datamined info from https://www.gamespot.com/articles/is-redds-art-in-animal-crossing-fake-or-real-datam/1100-6477508/
    var arts = new Array(numberOfArtsOnBoat);

    var artDistribution = Math.random();
    var numFakes;
    if (artDistribution <= 0.1) {
        numFakes = 1;
    } else if (artDistribution <= 0.4) {
        numFakes = 2;
    } else if (artDistribution <= 0.9) {
        numFakes = 3;
    } else {
        numFakes = 4;
    }

    var purchasesMade = 0;
    for (let i = 0; i < numberOfArtsOnBoat; i++) {
        if (i < numFakes) {
            arts[i] = "fake";
            continue; //art is fake, skip
        }
        var artID = Math.floor(Math.random() * numberofArtsInMuseum); //get random art ID
        arts[i] = artID;

        if (purchasesMade < purchasesPerVisit && museum[artID] === false) {
            purchasesMade++;
            museum[artID] = true;
            arts[i] = artID + " (purchased)";
        }
    }
    log("Day " + daysElapsed + " - Redd had: " + arts.join(", "));
}

function runSimulations() {
    loadOptions();

    var results = [];
    for (let i = 0; i < simulationItterations; i++) {
        results.push(simulate());
    }
    var resultsAvg = results.reduce((a, b) => a + b, 0) / results.length;
    log("average = " + resultsAvg / 365 + " years");
    postResults("On average it took " + (resultsAvg / 365).toFixed(2) + " years to get all the art.");
}

document.getElementById("run").onclick = runSimulations;
var numberOfArtsOnBoat = 4;
var options;

var museum;
var daysElapsed;

function log(msg) {
    postMessage({ type: "log", message: msg });
}

function postResults(msg) {
    postMessage({ type: "result", message: msg });
}

function simulate() {
    museum = new Array(options.numberofArtsInMuseum).fill(false);
    museum[Math.floor(Math.random() * options.numberofArtsInMuseum)] = true; // freebie on day 0, is always real.
    daysElapsed = 0;

    while (true) {
        daysElapsed += options.daysPerBoatVisit;
        if (Math.random() > options.percentDaysChecked) {
            if (options.detailedLogs) {
                log("Day " + daysElapsed + " - Missed a Redd visit :(");
            }
        } else {
            simulateVisit();
        }

        if (!museum.some((art) => art === false)) {
            log("Day " + daysElapsed + " - Got all the art!");
            break;
        }
        if (daysElapsed > options.maxSimulatableDays) {
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
        var artID = Math.floor(Math.random() * options.numberofArtsInMuseum); //get random art ID
        arts[i] = artID;

        if (purchasesMade < options.purchasesPerVisit && museum[artID] === false) {
            purchasesMade++;
            museum[artID] = true;
            arts[i] = artID + " (purchased)";
        }
    }
    if (options.detailedLogs) {
        log("Day " + daysElapsed + " - Redd had: " + arts.join(", "));
    }
}

function runSimulations() {
    var results = [];
    for (let i = 0; i < options.simulationItterations; i++) {
        var result = simulate();
        log("Finished simulation in " + (result / 365).toFixed(2) + " years.")
        results.push(result);
    }
    var resultsAvg = results.reduce((a, b) => a + b, 0) / results.length;
    log("Finished " + options.simulationItterations + " Runs. Average time was " + (resultsAvg / 365).toFixed(2) + " years");
    postResults("On average it took " + (resultsAvg / 365).toFixed(2) + " years to get all the art. Worst-case was " + (Math.max(...results) / 365).toFixed(2) + " years, while the best-case was only " + (Math.min(...results) / 365).toFixed(2) + " years.");
}

onmessage = function (e) {
    console.log('Message received from main script');
    options = e.data;
    runSimulations();
}
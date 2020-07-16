
var options = {
    percentDaysChecked: undefined,
    daysPerBoatVisit: undefined,
    numberofArtsInMuseum: undefined,
    purchasesPerVisit: undefined,
    maxSimulatableDays: undefined,
    simulationItterations: undefined,
    detailedLogs: undefined
};

var console = document.getElementById("console")

function log(msg) {
    console.innerHTML = msg+"\n"+console.innerHTML;
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
    options.percentDaysChecked = parseFloatArg("percentDaysChecked");

    options.daysPerBoatVisit = parseIntArg("daysPerBoatVisit");

    options.numberofArtsInMuseum = parseIntArg("numberofArtsInMuseum");
    options.purchasesPerVisit = parseIntArg("purchasesPerVisit");

    options.maxSimulatableDays = parseIntArg("maxSimulatableYears")*365;
    options.simulationItterations = parseIntArg("simulationItterations");
    options.detailedLogs = (document.getElementById("loglevel").value=="detailed");
}


var simWorker = new Worker('worker.js');
log("Worker setup!");
document.getElementById("run").onclick = function() {
    loadOptions();
    log("Sending start to worker...");
    simWorker.postMessage(options);
};

simWorker.onmessage = function(e) {
    if (e.data.type == "result") {
        postResults(e.data.message);
    } else {
        log("> "+ e.data.message);
    } 
}
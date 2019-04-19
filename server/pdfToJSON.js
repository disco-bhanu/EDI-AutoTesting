
const uuid = require('uuid/v4');
const fs = require('fs');
let PDFParser = require("pdf2json");

let state = {
    atSegment: false,
    atDesc: false,
    atDetails: false
};

function parser(file, cb) {
    let pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", data => handlePDFJSONData(data, file.id, cb));
    pdfParser.parseBuffer(file.data);
}

function handlePDFJSONData(pdfData, testID, cb) {
    //let textArray = [];
    let specJSON = [];
    let segmentName = null;
    let extractElements = false;
    let elements = [];
    let eachElementObj = {};
    let index = -1;
    let fieldDataIdx = 0;
    state = {
        atSegment: false,
        atDesc: false,
        atDetails: false
    };
    let skip = false;
    let range = 0;
    let loopID = null;

        pdfData.formImage.Pages.forEach((page, idx) => {
            if (idx > 3) {
                page.Texts.forEach(text => {
                    if (text.y > 4.5 && text.y < 45) {
                        let record = text.R[0];
                        switch (true) {
                            case (record.TS[1] > 800):
                                setState(true, false, false);
                                specJSON.push({ name: record.T });
                                segmentName = record.T;
                                if (Object.keys(eachElementObj).length > 0) {
                                    elements.push(eachElementObj);
                                }
                                if (extractElements) {
                                    specJSON[index]["list"] = elements;
                                    elements = [];
                                    eachElementObj = {};
                                }
                                extractElements = false;
                                index++;
                                break;
                            case (record.TS[1] > 700 && record.TS[1] < 800):
                                if (replaceText(record.T).toLowerCase().includes("loop")) {
                                    loopID = uuid();
                                    skip = true;
                                    break;
                                }
                                skip = false;
                                if (state.atSegment) {
                                    specJSON[index]["description"] = replaceText(record.T);
                                }
                                if (state.atDesc) {
                                    specJSON[index]["description"] = specJSON[index]["description"] + " " + replaceText(record.T);
                                }
                                setState(false, true, true);
                                break;
                            case (skip):
                                break;
                            case (state.atDetails):
                                setState(false, false, true);
                                if (record.T.includes("Mandatory")) {
                                    specJSON[index]["required"] = true;
                                } else if (record.T.includes("Optional")) {
                                    specJSON[index]["required"] = false;
                                } else if (record.T.toLowerCase().includes("loop%3a")) {
                                    let filterText = replaceText(record.T);
                                    specJSON[index]["loop"] = filterText.split(": ")[1];
                                    if(filterText.split(": ")[1] !== 'N/A') {
                                        specJSON[index]["loopID"] = loopID;
                                    } else {
                                        specJSON[index]["loopID"] = null;
                                    }
                                } else if (record.T.toLowerCase().includes("max%3a")) {
                                    let filterText = replaceText(record.T);
                                    specJSON[index]["max"] = filterText.split(": ")[1];
                                } else if (record.T.includes(segmentName) && replaceText(record.T).length < 10) {
                                    if (Object.keys(eachElementObj).length > 0) {
                                        elements.push(eachElementObj);
                                    }
                                    fieldDataIdx = 0;
                                    eachElementObj = {};
                                    extractElements = true;
                                    eachElementObj["name"] = replaceText(record.T);
                                    eachElementObj["id"] = 'NA';
                                    eachElementObj["desc"] = 'NA';
                                    eachElementObj["required"] = 'NA';
                                    eachElementObj["datatype"] = 'NA';
                                    eachElementObj["limit"] = 'NA';
                                    eachElementObj["testID"] = uuid();
                                    fieldDataIdx++;
                                } else if (extractElements) {
                                    switch (fieldDataIdx) {
                                        case (1):
                                            range = 8;
                                            if(Math.floor(text.x) === range || Math.floor(text.x) === range - 1 || Math.floor(text.x) === range + 1) {
                                                eachElementObj["id"] = replaceText(record.T);
                                            }
                                            fieldDataIdx++;
                                            break;
                                        case (2):
                                            range = 10;
                                            if(Math.floor(text.x) === range || Math.floor(text.x) === range - 1 || Math.floor(text.x) === range + 1) {
                                                eachElementObj["desc"] = replaceText(record.T);
                                            }
                                            fieldDataIdx++;
                                            break;
                                        case (3):
                                            range = 21;
                                            if(Math.floor(text.x) === range || Math.floor(text.x) === range - 1 || Math.floor(text.x) === range + 1) {
                                                eachElementObj["required"] = replaceText(record.T);
                                            }
                                            fieldDataIdx++;
                                            break;
                                        case (4):
                                            range = 23;
                                            if(Math.floor(text.x) === range || Math.floor(text.x) === range - 1 || Math.floor(text.x) === range + 1) {
                                                eachElementObj["datatype"] = replaceText(record.T);
                                            }
                                            fieldDataIdx++;
                                            break;
                                        case (5):
                                            range = 26;
                                            if(Math.floor(text.x) === range || Math.floor(text.x) === range - 1 || Math.floor(text.x) === range + 1) {
                                                eachElementObj["limit"] = replaceText(record.T);
                                            }
                                            fieldDataIdx++;
                                            break;
                                        default:
                                            eachElementObj["other"] = replaceText(record.T);
                                    }
                                }
                                break;
                            default:
                        }
                        //textArray.push(replaceText(record.T))
                    }
                })

            }
        });
        elements.push(eachElementObj);
        specJSON[index]["list"] = elements;
        fs.writeFile("./edi.json", JSON.stringify(specJSON, undefined, 2), (err) => {
            console.log(err);
        });
        cb(specJSON);
}

function replaceText(text) {
    return text.split("%20").join(" ")
        .split("%2F").join("/")
        .split("%3A").join(":")
        .split("%3E").join(">")
        .split("%2C").join(",");
}

function setState(s1, s2, s3) {
    state = {
        atSegment: s1,
        atDesc: s2,
        atDetails: s3
    }
}

module.exports = parser;

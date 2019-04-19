const specJSON = require('../edi');
const fs = require('fs');

let data;
data = fs.readFileSync('../sampleData.txt');
let splitData = data.toString().split('\r\n').join('').split("~");
//console.log(splitData);
let dataIndex = 3;
let looping = null;
let currentLoopId = null;
let tempJSON = [];
let currLoop = null;
let prevLoop = null;
let temp = [];

specJSON.forEach( (s, i) => {
    if(s.loopID === null) {
        tempJSON.push(s);
    } else {
        currLoop = s.loopID;
        if(currLoop !== prevLoop) {
            let temp = specJSON.filter(key => {
                return key.loopID === s.loopID
            })
            tempJSON.push(temp);
        }
        prevLoop = currLoop;
        /*currLoop = s.loopID;
        temp.push(s);
        prevLoop = currLoop;
        if(tempJSON[s.loopID] === undefined) {
            tempJSON[s.loopID] = [];
            tempJSON[s.loopID].push(s);
        } else {
            tempJSON[s.loopID].push(s);
        } */
    }
});

fs.writeFile('../new.json', JSON.stringify(tempJSON, undefined, 2), (err) => {
    console.log(err);
})

console.log(JSON.stringify(tempJSON, undefined, 2));

for (const segment of specJSON) {
    if(segment.name !== 'ISA' && segment.name !== 'GS' && segment.name !== 'ST' && segment.name !== 'SE' && segment.name !== 'GE' && segment.name !== 'IEA') {
        //console.log(segment.name);
        currentLoopId = segment.loopID;
        console.log(segment.name);
        if(currentLoopId === null) {
            looping = false;
            console.log(splitData[dataIndex]);
            segment.list.forEach( (f, idx) => {
                if(f.required === 'M') {
                    console.log(splitData[dataIndex].split("*")[idx]);
                }
            })
        } else {
            looping = true;
            console.log('here');
        }
    }
}

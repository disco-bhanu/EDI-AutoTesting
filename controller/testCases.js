const specJSON = require('../edi');
const fs = require('fs');

let data;
data = fs.readFileSync('../sampleData.txt');
let split = data.toString().split('\r\n').join('').split("~");
let splitData = split.reduce( (a, c) => [...a, c.split("*")], []);
fs.writeFileSync('./splitdata.txt', JSON.stringify(splitData, undefined, 2));
//console.log(split.reverse());

splitData.forEach( (s, i, a) => {
    let segmentName = s[0];
    if(segmentName !== 'ISA' && segmentName !== 'GS' && segmentName !== 'ST' && segmentName !== 'SE' && segmentName !== 'GE' && segmentName !== 'IEA') {
        let specSegmentIndex = specJSON.findIndex(e => e.name === segmentName);
        if(specSegmentIndex > -1) {
            let fieldIndex = specJSON[specSegmentIndex].list.reduce( (a, c, j) => {
                if(c.required === 'M') {
                    a.push(j+1);
                }
                return a;
            }, [] );
            fieldIndex.forEach(k => {
                let copy = a.reduce( (a, c) =>  [...a, [...c]], []);
                copy[i][k] = '';
                for(let l = copy[i].length - 1; l > 0; l--) {
                    if(copy[i][l].length === 0) {
                        copy[i].pop();
                    } else {
                        break;
                    }
                }
                let withDelimiter = copy.map(e => e.join('*')).join('~\n');
                fs.writeFileSync('./files/'+ Date.now() + '_' + i +'.txt', withDelimiter);
            })
        }
    }
});

/* let copy = [];
a.forEach( a1 => {
    copy.push([...a1]);
}); */

//let withSegmentDelimiter = withFieldDelimiter.join('~\n');
/*copy.forEach((e, l) => {
    copy[l] = copy[l].join('*');
});*/
//copy = copy.join('~\n');

//console.log(splitData);
let dataIndex = 3;
let looping = null;
let currentLoopId = null;
let tempJSON = [];
let currLoop = null;
let prevLoop = null;
let temp = [];

/*specJSON.forEach( (s, i) => {
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
        prevLoop = currLoop; */
        /*currLoop = s.loopID;
        temp.push(s);
        prevLoop = currLoop;
        if(tempJSON[s.loopID] === undefined) {
            tempJSON[s.loopID] = [];
            tempJSON[s.loopID].push(s);
        } else {
            tempJSON[s.loopID].push(s);
        } */
/*    }
}); */
/*
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
} */

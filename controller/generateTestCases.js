const mongoose = require('mongoose');
const mongooseClient = require('../server/mongooseDB');
const FileIDModel = require('../model/fileIDModel');
const TestCasesModel = require('../model/testCasesModel');
const fs = require('fs');
const path = require('path');

class Generate {
    constructor(testid) {
        this.testID = testid;
    }

    async process(req, res) {
        
        const getFileId = await FileIDModel.find({'test_id': req.cookies.testID, 'file_type': { $ne: 'txo'}}, {'file_id': 1, _id: 0});
        //console.log(getFileId);
        const conn = mongooseClient.conn;
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'edi_test_inputs'});

        var spec = new Promise((resolve, reject) => {
            let specFile = '';
            bucket.openDownloadStream(mongoose.Types.ObjectId(getFileId[0].file_id))
                .on('data', data => specFile = specFile + data.toString())
                .on('end', () => resolve(JSON.parse(specFile)))
                .on('error', err => reject(err));
        })

        var data = new Promise((resolve, reject) => {
            let dataFile = '';
            bucket.openDownloadStream(mongoose.Types.ObjectId(getFileId[1].file_id))
                .on('data', data => dataFile = dataFile + data.toString())
                .on('end', () => resolve(dataFile))
                .on('error', err => reject(err));
        })

        Promise.all([spec, data]).then(d => {
            this.testCases(d[0], d[1]);
            //console.log(d);
        })

        res.json({'message': 'Good'});        
    }

    async testCases(specJSON, dataFile) {
        let data = dataFile;
        //data = fs.readFileSync('../sampleData.txt');

        let split = data.toString().split('\r\n').join('').split("~");
        let splitData = split.reduce( (a, c) => [...a, c.split("*")], []);
        //fs.writeFileSync('./splitdata.txt', JSON.stringify(splitData, undefined, 2));
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
                        //console.log(copy[i]);
                        for(let l = copy[i].length - 1; l > 0; l--) {
                            if(copy[i][l].length === 0) {
                                copy[i].pop();
                            } else {
                                break;
                            }
                        }
                        if(copy[i].length === 1) {
                            copy.splice(i, 1);
                        }
                        let withDelimiter = copy.map(e => e.join('*')).join('~\n');
                        fs.writeFileSync( './controller/files/' + Date.now() + '_' + i +'.txt', withDelimiter);
                    })
                }
            }
        });
    }
}

module.exports = Generate;

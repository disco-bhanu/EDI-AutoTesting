const mongoose = require('mongoose');
const mongooseClient = require('../server/mongooseDB');
const FileIDModel = require('../model/fileIDModel');
const TestCasesModel = require('../model/testCasesModel');
const fs = require('fs');

class Generate {
    constructor(testid) {
        this.testID = testid;
    }

    async process(req, res) {
        let spec = '';
        const getFileId = await FileIDModel.findOne({'test_id': req.cookies.testID, 'file_type': 'pdf'}, {'file_id': 1, _id: 0});
        const conn = mongooseClient.conn;
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'edi_test_inputs'});
        console.log(getFileId.file_id);
        bucket.openDownloadStream(mongoose.Types.ObjectId(getFileId.file_id))
            .on('data', data => {
                spec = spec + data.toString();
            })
            .on('end', () => {
                let specJSON = JSON.parse(spec);
                specJSON.forEach(segment => {
                    segment.list.forEach(field => {
                        if(field.required === 'M') {
                            console.log(field.name);
                            const TestCases = new TestCasesModel({
                                test_id: req.cookies.testID,
                                testcase_id: field.testID,
                                test_data: ''
                            })
                        }
                    })
                })
            })
            .on('error', err => console.log(err));
        res.json({'message': 'Good'});        
    }

    testCases() {
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
                        fs.writeFileSync('./files/'+ Date.now() + '_' + i +'.txt', withDelimiter);
                    })
                }
            }
        });
    }
}

module.exports = Generate;

const mongoose = require('mongoose');
const mongooseClient = require('../server/mongooseDB');
const FileIDModel = require('../model/fileIDModel');
const TestCasesModel = require('../model/testCasesModel');

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
                    segment.list.map(field => {
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
}

module.exports = Generate;
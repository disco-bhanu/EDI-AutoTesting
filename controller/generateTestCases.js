'use strict';

const mongoose = require('mongoose');
const mongooseClient = require('../server/mongooseDB');
const FileIDModel = require('../model/fileIDModel');

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
        //bucket.openDownloadStreamByName('TestData3_1555445783725.txt')
        bucket.openDownloadStream(mongoose.Types.ObjectId(getFileId.file_id))
            .on('data', data => spec + data.toString())
            .on('error', err => console.log(err));
        res.json({'message': 'Good'});
        console.log(spec);
        let specJSON = JSON.parse(spec);
        specJSON.forEach(segment => {
            console.log(segment.name)
        })
        
    }
}

module.exports = Generate;
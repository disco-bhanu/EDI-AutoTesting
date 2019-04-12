'use strict';
const uuid = require("uuid/v4");
const stream = require('stream');
const mongoose = require('mongoose');

const mongooseClient = require('../server/mongooseDB');
const pdfProcess = require('../server/pdfToJSON');
const TestFileModel = require('../model/testFileModel');

class Process {

    constructor() {
        this.pdfjson = null;
        this.uid = uuid();
        this.txosaved = false;
        this.datasaved = false;
    }

    processfiles(req, res) {
        req.files.map(f => {
            console.log('inside');
            console.log(f);
            switch (true) {
                case f.originalname.search(/.pdf$/) > -1:
                    pdfProcess(f.buffer, this.pdfProcessCB.bind(this));
                    break;
                case f.originalname.search(/.txo$/) > -1:
                    this.savefiles({
                        name: f.originalname,
                        data: f.buffer,
                        type: "txo"});
                    break;
                case f.originalname.search(/.data$/) > -1:
                case f.originalname.search(/.dat$/) > -1:
                case f.originalname.search(/.doc$/) > -1:
                case f.originalname.search(/.txt$/) > -1:
                    this.savefiles({
                        name: f.originalname,
                        data: f.buffer.toString(),
                        type: "data"});
                    break;
                default:
                    console.log(f);
                    res.sendStatus(404);
                    break;
            }
        });
        console.log(this.txosaved);
        console.log(this.datasaved);
        res.send(JSON.stringify(this.pdfjson, undefined, 2));
    }
    
    pdfProcessCB(edijson) {
        this.pdfjson = edijson;
        //this.res.send(JSON.stringify(this.pdfjson, undefined, 2));
    }
    
    savefiles(file) {
        var datastream = new stream.PassThrough();
        datastream.end(file.data);
        const conn = mongooseClient.conn;
        if(true) {
            const bucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'edi_test_inputs'});        
            datastream.pipe(
                bucket.openUploadStream(newFileNameWithTimestamp(file.name), {contentType: file.type}))
                .on('error', err => console.log(err))
                .once('finish', record => {
                    console.log('finish');
                    const testfileModel = new TestFileModel({
                        file_id: record.md5,
                        test_id: this.uid
                    });
                    try {
                        const result = testfileModel.save();
                        result.then(() => {
                            file.type === 'txo' ? this.txosaved = true : '';
                            file.type === 'data' ? this.datasaved = true : '';
                        })
                    }
                    catch(err) {
                        throw err;
                    }
                    //res.send({fileType: file.type});
                });
        }
    }
}

function newFileNameWithTimestamp(filename) {
    const extension = filename.split('.').reverse()[0];
    const newfilename = filename.substr(0, filename.indexOf('.' + extension)) + '_' +Date.now() + '.' + extension;
    return newfilename;
}


module.exports = Process;

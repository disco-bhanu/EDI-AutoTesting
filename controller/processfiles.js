const uuid = require("uuid/v4");
const stream = require('stream');
const mongoose = require('mongoose');

const mongooseClient = require('../server/mongooseDB');
const pdfProcess = require('../server/pdfToJSON');
const FileIDModel = require('../model/fileIDModel');

class Process {

    constructor() {
        this.testID = uuid();
        this.handlepdf = {};
        this.handletxo = {};
        this.handledata = {};
        this.response = {
            pdf: { processed: false, data: null },
            txo: { processed: false },
            data: { processed: false }
        }
    }

    async processfiles(req, res) {
        console.log('express', req.headers.cookie);
        console.log('Got cookie', req.cookies);
        req.files.map(f => {
            console.log('inside');
            console.log(f);
            switch (true) {
                case f.originalname.search(/.pdf$/) > -1:
                    this.handlepdf = {
                        data: f.buffer,
                        type: 'pdf',
                        name: f.originalname,
                        id: this.testID
                    };
                    break;
                case f.originalname.search(/.txo$/) > -1:
                    this.handletxo = {
                        data: f.buffer,
                        type: 'txo',
                        name: f.originalname
                    };
                    break;
                case f.originalname.search(/.data$/) > -1:
                case f.originalname.search(/.dat$/) > -1:
                case f.originalname.search(/.doc$/) > -1:
                case f.originalname.search(/.txt$/) > -1:
                    this.handledata = {
                        data: f.buffer.toString(),
                        type: 'data',
                        name: f.originalname
                    };
                    break;
                default:
                    console.log(f);
                    res.sendStatus(404);
                    break;
            }
        });

        pdfProcess(this.handlepdf, async (data) => {
            this.response.pdf.data = data;
            this.handlepdf.data = JSON.stringify(data);
            this.handlepdf.name = this.testID + '.json';
            try {
                await this.savefiles(this.handlepdf);
                await this.savefiles(this.handletxo);
                await this.savefiles(this.handledata);
                res.cookie('testID', this.testID, {maxAge: 900000, httpOnly: true});
                res.json(this.response);
            }
            catch(e) {
                console.log(e);
                res.json({error: 'unable to process request'});
            }
            /* this.savefiles(this.handlepdf)
                .then(() => {
                    this.response.pdf.processed = true;
                    this.savefiles(this.handletxo)
                        .then(() => {
                            this.response.txo.processed = true; 
                            this.savefiles(this.handledata)
                                .then(() => {
                                    this.response.data.processed = true;
                                    res.cookie('testID', this.testID, {maxAge: 900000, httpOnly: true});
                                    res.json(this.response);
                                })
                                .catch((err) => {
                                    res.json(this.response);
                                })
                        })
                        .catch((err) => {
                            res.json(this.response);
                        })
                })
                .catch(err => {
                    res.json(this.response);
                })*/
        })
    }
    
    savefiles(file) {
        var datastream = new stream.PassThrough();
        datastream.end(file.data);
        const conn = mongooseClient.conn;
        if(true) {
            const bucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'edi_test_inputs'}); 
            return new Promise((resolve, reject) => {
                datastream.pipe(bucket.openUploadStream(newFileNameWithTimestamp(file.name), {contentType: file.type}))
                    .on('error', err => console.log(err))
                    .once('finish', record => {
                        const FileID = new FileIDModel({
                            file_id: record._id,
                            test_id: this.testID,
                            file_type: file.type
                        });
                        try {
                            const result = FileID.save();
                            result.then(() => {
                                this.response[file.type].processed = true;
                                resolve('saved');
                            })
                        }
                        catch(err) {
                            reject('failed');
                            throw err;
                        }
                    });
            })  
        }
    }
}

function newFileNameWithTimestamp(filename) {
    const extension = filename.split('.').reverse()[0];
    return filename.substr(0, filename.indexOf('.' + extension)) + '_' + Date.now() + '.' + extension;
}


module.exports = Process;

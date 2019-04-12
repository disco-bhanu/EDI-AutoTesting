const express = require('express');

const request = require('request');

const router = express.Router();

const mongoClient = require('./mongoDB.js');

const Process = require('../controller/processfiles');

let txofile = null;

let testdata = null;

router.post('/', (req, res) => {
    const ProcessFiles = new Process();
    ProcessFiles.processfiles(req, res);
})

router.get('/test', (req, res) => {

    var options = { 
        method: 'POST',
        url: 'http://ln0487.homedepot.com:45538/maptest',
        headers: {
            'Content-Type': 'multipart/related;',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Host:'ln0487.homedepot.com:45538',
            Connection: 'keep-alive',
            Authorization: 'Basic QlhTODQ3NjpUQ1NmZWJAMTk=',
        },
        formData: {
            'soap': '<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"><SOAP-ENV:Header/><SOAP-ENV:Body><ns1:MapTest xmlns:ns1=\"urn:/maptest\"/></SOAP-ENV:Body></SOAP-ENV:Envelope>',
            'txo': {
                value: txofile,
                options: {
                    filename: 'txo_file'
                }
            },
            'data': {
                value: testdata,
                options: {
                    contentType: 'application/octet-stream'
                }
            }
        }

    }

    request(options, function (error, response, body) {
        if (error) throw new Error(error); 
        console.log(body)
      })

    
   /* multipart: [
        {
            'content-type': 'text/xml charset=utf-8',
            body: '<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"><SOAP-ENV:Header/><SOAP-ENV:Body><ns1:MapTest xmlns:ns1=\"urn:/maptest\"/></SOAP-ENV:Body></SOAP-ENV:Envelope>'
        },
        {
            'content-type': 'application/octet-stream',
            body: txofile
        },
        {
            'content-type': 'application/octet-stream',
            body: testdata
        }
    ] */
  

  res.send();
    
})

router.get('/mongo', (req, res) => {
    mongoClient.conn();
    res.send('mongo')
})

module.exports = router;

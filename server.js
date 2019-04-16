const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const mongooseclient = require('./server/mongooseDB');

const app = express();
const upload = multer();
const router = require('./server/router.js');

app.options('*', cors()) ;
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/build'));
app.use("/upload",upload.any(), router);
app.use("/server", router);

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
});

/*
app.post('/upload', upload.any() ,(req, res) => {
    console.log(req.files);
    req.files.map(f => {
        console.log(f.originalname)
        console.log(f.mimetype)
    })
    res.send('hllo');
})
*/

app.listen('8080', () => {
    console.log('listening....');
    mongooseclient.connection();
});

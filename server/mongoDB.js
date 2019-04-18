const mongo = require('mongodb').MongoClient,
    Grid = require('mongodb').GridFSBucket;

const stream = require('stream');
const _client = null;

function connection() {
    if(_client === null) {
        mongo.connect('mongodb://localhost:27017', (err, client) => {
            console.log(err);
            console.log('Connected!');
            _client = client;
        }); 
    }
}

function save(file, uid, res) {

    var datastream = new stream.PassThrough();

    datastream.end(file.data);

    const db = _client.db('local');
    if(db !== null) {
        const bucket = new Grid(db, {bucketName: 'edi_test_inputs'});
        /* var upload = bucket.openUploadStream('./server/mongoDB.js');
        
        upload.on('error', err => console.log(err))
            .once('finish', doc => {
                console.log('done!');
                console.log(doc);
                let lookForEntry = db.collection('edi_test_inputs').findOne({uuid: uid});
                console.log(lookForEntry);               
            });  */
        
        datastream.pipe(bucket.openUploadStream(file.name))
            .on('error', err => console.log(err))
            .once('finish', record => {
                db.collection('edi_test_inputs').findOne({file_id: record.md5})
                    .then(doc => {
                        if(doc === null) {
                            db.collection('edi_test_inputs').insertOne({
                                file_id: record.md5,
                                file_type: file.type,
                                test_id: uid
                            });        
                        }
                    });
                res.send({fileType: file.type});
            });             
    
    /* fs.createReadStream('./server/router.js')
        .pipe(bucket.openUploadStream('router.js'))
        .on('error', (err) => {
            console.log(err);
        })
        .on('finish', (d) => {
            console.log('done!');
            console.log(d);
            db.collection('edi_test_inputs.files').find().toArray((err, doc) => {
                console.log(err);
                // console.log(doc);
            })
        })*/
    }
}


const mongoClient = {
    conn: connection,
    upload: save
};

module.exports = mongoClient;

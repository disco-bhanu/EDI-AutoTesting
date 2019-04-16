const mongoose = require('mongoose');

var conn = null;

async function connection() {
    await mongoose.connect('mongodb://localhost:27017/local', { useNewUrlParser: true });
}
/*
function save(file, uid, res) {
    var datastream = new stream.PassThrough();
    datastream.end(file.data);
    mongoose.connect('mongodb://localhost:27017/local', { useNewUrlParser: true }, err => {})
    if(conn.db !== null && conn.db !== undefined) {
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'edi_test_inputs'});        
        datastream.pipe(bucket.openUploadStream(file.name, {contentType: file.type}))
            .on('error', err => console.log(err))
            .on('finish', record => {
                console.log('finish');
                TestFileModel.findOne({'file_id': record.md5}, function(err, doc) {
                    if(err) throw err;
                    if(doc === null) {
                        var testfileModel = new TestFileModel({
                            file_id: record.md5,
                            test_id: uid,
                        });
                        testfileModel.save((err) => {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log('Saved!!!')
                            }
                        })
                    }
                })
                res.send({fileType: file.type});
            });
    }

}
*/
mongooseClient = {
    connection: connection,
    conn: mongoose.connection
}

module.exports = mongooseClient;
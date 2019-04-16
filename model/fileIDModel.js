const mongoose = require('mongoose');

const Schema = mongoose.Schema;

mongoose.set('debug', true);

const FileID = new Schema({
    file_id: {
        type: String,
        required: true
    },
    test_id: {
        type: String,
        required: true
    },
    file_type: {
        type: String,
        required: true
    }
}, {collection: 'edi_test_inputs', timestamps: true});

module.exports = mongoose.model('FileIDModel', FileID);
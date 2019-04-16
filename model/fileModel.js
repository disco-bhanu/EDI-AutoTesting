const mongoose = require('mongoose');

const Schema = mongoose.Schema;

mongoose.set('debug', true);

const File = new Schema({
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
}, {collection: 'edi_test_inputs.files', timestamps: true});

module.exports = mongoose.model('FileModel', File);
'use strict';

const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const TestCasesSchema = new Schema({
    test_id: {
        type: String,
        required: true
    },
    testcase_id: {
        type: String,
        required: true
    },
    test_data: {
        type: String,
        required: true
    }
}, { collection: 'edi_test_cases', timestamps: true });

module.exports = mongoose.model('TestCasesModel', TestCasesSchema);
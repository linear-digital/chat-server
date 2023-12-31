const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    questions: {
        type: Array,
        required: true
    },
    answers: {
        type: Array,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Store = mongoose.model('Data', schema)

module.exports = Store
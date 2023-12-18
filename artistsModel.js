const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let artistsSchema = Schema({
    Artist: {
        type: String,
        required: true,
        minlength: 1,
        match: /[A-Za-z0-9]+/,
        trim: true
    },
    Art: {
        type: [String],
        required: false,
        match: /[A-Za-z0-9]+/,
        trim: true
    },
    Workshops: {
        type: [String],
        required: false,
        match: /[A-Za-z0-9]+/,
        trim: true
    }
});

module.exports = mongoose.model('artists', artistsSchema);
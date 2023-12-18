const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30,
        trim: true
    },
    Artists: {
        type: Boolean,
        required: false,
        trim: true
    },
    liked : {
        type: [String],
        required: false,
        trim: true
    },
    following: {
        type: [String],
        required: false,
        trim: true
    },
    reviews: {
        type: [String],
        required: false,
        trim: true
    },
    workshops: {
        type: [String],
        required: false,
        trim: true
    }
});

module.exports = mongoose.model("User", userSchema);
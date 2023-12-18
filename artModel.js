const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let artSchema = Schema({
  Title: {
    type: String,
    required: true,
    minlength: 1,
    match: /[A-Za-z0-9]+/,
    trim: true,
  },
  Artist: {
    type: String,
    required: true,
    minlength: 1,
    match: /[A-Za-z0-9]+/,
    trim: true,
  },
  Year: {
    type: Number,
    required: true,
    minlength: 4,
    maxlength: 4,
    match: /[0-9]+/,
    trim: true,
  },
  Category: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    match: /[A-Za-z0-9]+/,
    trim: true,
  },
  Medium: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    match: /[A-Za-z0-9]+/,
    trim: true,
  },
  Description: {
    type: String,
    required: false,
    match: /[A-Za-z0-9]+/,
    trim: true,
  },
  Poster: {
    type: String,
    required: true,
    minlength: 1,
    match: /[A-Za-z0-9]+/,
    trim: true,
  },
  Reviews: {
    type: [String],
    required: false,
  },
  Likes: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Art", artSchema);

const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'A code is required.'],
        maxlength: [20, 'A code cannot be longer than 20 characters.'],
        minlength: [2, 'A code must be at least 2 characters long.']
    },
    content: {
        type: String,
        required: [true, 'Content is required.'],
        maxlength: [1_000_000, 'Content cannot be longer than 1,000,000 characters.'],
        minlength: [1, 'Content must be at least 1 character long.']
    },
    title: {
        type: String,
        required: [true, 'A title is required.'],
        maxlength: [100, 'A title cannot be longer than 100 characters.'],
        minlength: [2, 'A title must be at least 2 characters long.']
    },
    author: {
        type: String,
        required: [true, 'An author is required.'],
        maxlength: [20, 'An author cannot be longer than 20 characters.'],
        minlength: [2, 'An author must be at least 2 characters long.']
    },
    read_key: {
        type: String,
        default: null,
        maxlength: [20, 'A read key cannot be longer than 20 characters.'],
        minlength: [2, 'A read key must be at least 2 characters long.']
    },
    edit_key: {
        type: String,
        default: null,
        maxlength: [20, 'An edit key cannot be longer than 20 characters.'],
        minlength: [2, 'An edit key must be at least 2 characters long.']
    },
    syntax: {
        type: String,
        required: [true, 'A syntax is required.'],
    },
    max_reads: {
        type: Number,
        required: [true, 'A max reads is required.'],
    },
    reads: {
        type: Number,
        default: 0
    },
});

const Paste = mongoose.model('Paste', pasteSchema);

module.exports = Paste;
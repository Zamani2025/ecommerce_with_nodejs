const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title field is required']
    },
    slug: {
        type: String
    },
    content: {
        type: String,
        required: [true, 'Description field is required']      
    },
    sorting: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('pages', PageSchema);
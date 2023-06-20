const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String
    },
    desc: {
        type: String,
        required: true,    
    },
    category: {
        type: String,
        required: true     
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('products', ProductSchema);
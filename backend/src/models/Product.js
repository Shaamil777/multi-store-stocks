const mongoose = require('mongoose')

const productSchema =new mongoose.Schema({
    sku:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type:Boolean,
        default:true
    }
},{timestamps:true})

module.exports = mongoose.model("Product",productSchema)
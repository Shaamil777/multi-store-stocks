const mongoose = require('mongoose')

const StoreSchema = new mongoose.Schema({
    name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        district: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        manager: {
            type: String,
            required: true,
            trim: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
})

module.exports = mongoose.model("Store",StoreSchema)
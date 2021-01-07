const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 50
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true
    },
    postalCode: {
        type: String, 
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    cityDistrict: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
})

const userAddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: [addressSchema]
}, {timeStamps: true})

module.exports = mongoose.model('UserAddress', userAddressSchema)
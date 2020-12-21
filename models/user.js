const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 20
    },
    email: {
        type: String,
        required: true
    },
    hash_password: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {timestamps: true})

userSchema.methods = {
    authenticate: function (password, hash) {
        return bcrypt.compare(password, hash)
    }
}

module.exports = mongoose.model('User', userSchema)
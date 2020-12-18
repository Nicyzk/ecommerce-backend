const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    cartItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1, required: true },
            price: { type: Number, required: true }
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model('Cart', cartSchema)
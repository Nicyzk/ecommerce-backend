const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            purchasedPrice: {
                type: Number,
                required: true
            }
        }
    ],
    address: {
       type: mongoose.Schema.Types.ObjectId,
       required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'refund'],
        required: true
    }
})

module.exports = mongoose.model('Order', orderSchema)
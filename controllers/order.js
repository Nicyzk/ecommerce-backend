const Order = require('../models/order')
const Cart = require('../models/cart')

exports.addOrder = (req, res, next) => {
    req.body.user = req.user._id
    const order = new Order(req.body)
    Cart.deleteOne({user: req.user._id})
    .then(() => {
        return order.save()
    })
    .then(order => {
        res.status(200).json({
            order
        })
    })
    .catch(err => next(err))
}

exports.getOrders = (req, res, next) => {
    Order.find({user: req.user._id})
    .select('_id paymentStatus items')
    .populate('items.productId', '_id name productPictures')
    .then(orders => {
        res.status(200).json({
            orders
        })
    })
    .catch(err => next(err))
}
const Cart = require('../models/cart')

//3 scenarios: 
//1) When user logs in, update cart in database with items in local storage
//2) When user is logged in and adds to cart, update database
//3) When user is signed out, clear the local storage and redux state. So that if he logs in, the cart will not be double counted.
//Note: if user not logged in, items will be stored in local storage and redux. 
// getCart + addItemsToCart will solve scenarion 1. addItems alone will solve 2. 


exports.getCart = (req, res, next) => {
    Cart.findOne({user: req.user._id}).populate('cartItems.productId', '_id name price productPictures').exec()
    .then(cart => {
        if (cart) {
            const cartItems = {}
            cart.cartItems.forEach(item => {
                cartItems[item.productId._id] = {
                    _id: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.price, 
                    img: item.productId.productPictures,
                    qty: item.quantity
                }
            })
            return res.status(200).json({
                cartItems
            })
        } else {
            return res.status(200).json({
                message: "User does not have a cart"
            })
        }
    })
    .catch(err => next(err))
}

exports.addItemsToCart = (req, res, next) => {
    Cart.findOne({ user: req.user._id }).exec()
        .then(cart => {
            //payload must be in form of product: {productId, quantity}
            const cartItems = req.body.cartItems // [{}, {}]
            if (!cart) {
                cart = new Cart({
                    user: req.user._id,
                    cartItems: []
                })
            }
            if (!cartItems || cartItems.length === 0) {
                return cart.save()
            }
            cartItems.forEach(item => {
                const productIndex = cart.cartItems.findIndex(i => {
                    return i.productId == item.productId
                })
                if (productIndex >= 0) {
                    cart.cartItems[productIndex].quantity += item.quantity
                } else {
                    cart.cartItems.push({
                        productId: item.productId,
                        quantity: item.quantity
                    })
                }
            })
            return cart.save()
        })
        .then(cart => {
            res.status(200).json({
                cart: cart
            })
        })
        .catch(err => {
            next(err)
        })
}

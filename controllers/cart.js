const Cart = require('../models/cart')

exports.addToCart = (req, res, next) => {
    Cart.findOne({user: req.user._id})
    .then(cart => {
        //payload must be in form of product: {productId, price}
        const productId = req.body.product.productId
        const price = req.body.product.price
        if (cart) {
            const productIndex = cart.cartItems.findIndex(i => {
                return i.productId == productId
            })
            if (productIndex >= 0) {
                cart.cartItems[productIndex].quantity += 1
                return cart.save()
            } else {
                cart.cartItems.push({productId, price})
                return cart.save()
            }
        } else {
            cart = new Cart({
                user: req.user._id,
                cartItems: [{
                    productId: productId,
                    price: price
                }]
            })
        }
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

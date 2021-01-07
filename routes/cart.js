const express = require('express')
const router = express.Router()
const { addItemsToCart, getCart } = require('../controllers/cart.js')
const { isAuth } = require('../middlewares/isAuth')

router.get('/getcart', isAuth, getCart)

router.post('/add-to-cart', isAuth, addItemsToCart)

module.exports = router
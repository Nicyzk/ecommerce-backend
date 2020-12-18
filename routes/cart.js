const express = require('express')
const router = express.Router()
const { addToCart } = require('../controllers/cart.js')
const { isAuth } = require('../middlewares/isAuth')


router.post('/add-to-cart', isAuth, addToCart)

module.exports = router
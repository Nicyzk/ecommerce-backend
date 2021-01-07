const express = require('express')
const router = express.Router()
const { addOrder, getOrders } = require('../controllers/order')
const { isAuth } = require('../middlewares/isAuth')

router.post('/addorder', isAuth, addOrder)

router.get('/getorders', isAuth, getOrders)

module.exports = router
const express = require('express')
const router = express.Router()
const { getAddress, addAddress, editAddress} = require('../controllers/address')
const { isAuth } = require('../middlewares/isAuth')
const { validateAddresses, handleInvalidity} = require('../validators/auth')

router.get('/getaddress', isAuth, getAddress)

router.post('/addaddress', isAuth, validateAddresses, handleInvalidity, addAddress)

router.post('/editaddress', isAuth, validateAddresses, handleInvalidity, editAddress)

module.exports = router
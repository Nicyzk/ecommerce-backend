const express = require('express')

const authControllers = require('../controllers/auth')
const { validateSignupRequest, validateSigninRequest, handleInvalidity } = require('../validators/auth')

const router = express.Router()

router.post('/signup', validateSignupRequest, handleInvalidity, authControllers.signup)

router.post('/signin',  validateSigninRequest, handleInvalidity, authControllers.signin)

router.post('/signout', authControllers.signout)

module.exports = router
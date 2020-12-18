const express = require('express')

const authControllers = require('../../controllers/admin/auth')
const { validateSignupRequest, validateSigninRequest, handleInvalidity } = require('../../validators/auth')
const { isAuth, isAuthAdmin } = require('../../middlewares/isAuth')

const router = express.Router()

router.post('/signup', validateSignupRequest, handleInvalidity, authControllers.signup)
router.post('/signin',  validateSigninRequest, handleInvalidity, authControllers.signin)
router.post('/signout', isAuth, isAuthAdmin, authControllers.signout)

module.exports = router
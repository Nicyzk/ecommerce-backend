const { body, validationResult } = require('express-validator')

exports.validateSignupRequest = [
    body('firstName').trim().notEmpty().withMessage("Please enter your first name").isLength({min: 2, max: 20}).withMessage("First name should be more than 2 but less than 20 characters"),
    body('lastName').trim().notEmpty().withMessage("Please enter your last name").isLength({min: 2, max: 20}).withMessage("Last name should be more than 2 but less than 20 characters"),
    body('email').normalizeEmail().isEmail().withMessage('Please enter a valid email'),
    body('password').trim().isLength({min: 6}).withMessage('Password must be at least 6 characters long')
]

exports.validateSigninRequest = [
    body('email').normalizeEmail().isEmail().withMessage('Please enter a valid email'),
    body('password').trim().isLength({min: 6}).withMessage('Password must be at least 6 characters long')
]

exports.handleInvalidity = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg
        })
    }
    next()
}
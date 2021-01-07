const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.signup = async (req, res, next) => {
    try {
        const userRetrieved = await User.findOne({email: req.body.email, type: "user"})
        if (userRetrieved) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }
        const hashPassword = await bcrypt.hash(req.body.password, 12) 
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const email = req.body.email
        const hash_password = hashPassword
        const user = new User({
            firstName: firstName,
            lastName: lastName, 
            email: email,
            hash_password: hash_password,
            userName: email.split('@')[0]
        })
        await user.save()
        return res.json({
            message: "signup succeeded"
        })
    } catch (err) {
        err.statusCode = 500
        next(err)
    }
}


exports.signin = (req, res, next) => {
    let userFound
    User.findOne({email: req.body.email, type: "user"})
    .then(user => {
        if (!user) {
            const err = new Error('User does not exist')
            err.statusCode = 422
            throw err
        }
        userFound = user
        return user.authenticate(req.body.password, user.hash_password)
    })
    .then(isValid => {
        if (isValid) {
            const token = jwt.sign({_id: userFound._id, type: userFound.type}, process.env.JWT_SECRET, {expiresIn: '1h'})
            const { firstName, lastName, type, email } = userFound
            res.status(200).json({
                token: token,
                user: {
                    firstName,
                    lastName,
                    type,
                    email
                }
            })
        } else {
            res.status(400).json({
                message: "Password is invalid"
            })
        }
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.signout = (req, res, next) => {
    res.status(200).json({
        message: "user signed out successfully"
    })
}
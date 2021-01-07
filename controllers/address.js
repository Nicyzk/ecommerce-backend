const UserAddress = require('../models/address')

exports.addAddress = (req, res, next) => {
    const { address } = req.body
    if (address) {
        UserAddress.findOneAndUpdate({user: req.user._id}, {
            $push: {
                address: address
            }
        }, { new: true, upsert: true })
        .then(userAddress => {
            res.status(200).json({
                userAddress
            })
        })
        .catch(err => next(err))
    } else {
        res.status(422).json({
            message: "Address is required"
        })
    }
}

exports.editAddress = (req, res, next) => {
    const { address } = req.body
    if (address) {
        UserAddress.findOne({user: req.user._id})
        .then(userAddress => {
            if (userAddress) {
                const index = userAddress.address.findIndex(item => item._id.toString() === address._id )
                userAddress.address[index] = address
                return userAddress.save()
            }
        })
        .then(userAddress => {
            res.status(200).json({
                userAddress
            })
        })
        .catch(err => {
            next(err)
        })
    } else {
        res.status(422).json({
            message: "Address is required"
        })
    }
}

exports.getAddress = (req, res, next) => {
    UserAddress.findOne({user: req.user._id})
    .then( userAddress => {
        if (userAddress) {
            return res.status(200).json({
                userAddress
            })
        } else {
            return res.status(200).json({
                userAddress,
                message: "No address found for this user"
            })
        }
    })
    .catch(err => next(err))
}
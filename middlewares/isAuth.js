const jwt = require('jsonwebtoken')

exports.isAuth = (req, res, next) => {
    try {
        const token = req.header('Authorization').split(" ")[1]
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (err) {
        err.statusCode = 400
        err.message = "Authorization failed"
        throw err
    }
}

exports.isAuthUser = (req, res, next) => {

}

exports.isAuthAdmin = (req, res, next) => {
    if (req.user.type !== "admin") {
        return res.status(400).json({
            message: "Access denied"
        })
    }
    next()
}
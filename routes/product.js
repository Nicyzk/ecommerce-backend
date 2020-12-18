const express = require('express')
const router = express.Router()
const { isAuth, isAuthAdmin } = require('../middlewares/isAuth')
const { createProduct } = require('../controllers/product')
const multer = require('multer')
const { nanoid } = require('nanoid')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + '-' + file.originalname)
    }
})
const upload = multer({storage: storage})


router.post('/create', isAuth, isAuthAdmin, upload.array('productPicture'), createProduct)


module.exports = router
const express = require('express')
const router = express.Router()
const { isAuth, isAuthAdmin } = require('../middlewares/isAuth')
const { createProduct, getProductsBySlug, getProductDetailsById } = require('../controllers/product')
const multer = require('multer')
const { nanoid } = require('nanoid')
const slugify = require('slugify')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + '-' + slugify(file.originalname))
    }
})
const upload = multer({storage: storage})


router.post('/create', isAuth, isAuthAdmin, upload.array('productPicture'), createProduct)
router.get('/getproducts/:slug', getProductsBySlug)
router.get('/getproductdetails/:id', getProductDetailsById)


module.exports = router
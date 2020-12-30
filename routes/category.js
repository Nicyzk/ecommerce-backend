const express = require('express')
const router = express.Router()
const { createCategory, getCategories, updateCategories, deleteCategories } = require('../controllers/category')
const { isAuth, isAuthAdmin } = require('../middlewares/isAuth')
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

const upload = multer( {storage: storage} )

router.post('/create', /*isAuth, isAuthAdmin, */upload.single('categoryImage'), createCategory)
router.get('/getcategories', getCategories)
router.post('/updatecategories', /*isAuth, isAuthAdmin,*/ upload.array('categoryImage'), updateCategories)
router.post('/delete', /*isAuth, isAuthAdmin,*/ deleteCategories)

module.exports = router
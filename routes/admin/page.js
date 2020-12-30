const express = require('express')

const pageController = require('../../controllers/admin/page')
const { isAuth, isAuthAdmin } = require('../../middlewares/isAuth')
const upload = require('../../middlewares/upload')

const router = express.Router()

router.post('/create', isAuth, upload.fields([
    {name: 'banners'}, 
    {name: 'products'}
]), pageController.createPage)

router.get('/getpage/:category/:type', pageController.getPage)

module.exports = router
const express = require('express')

const initialDataController = require('../../controllers/admin/initialData')
const { isAuth, isAuthAdmin } = require('../../middlewares/isAuth')

const router = express.Router()

router.post('/', initialDataController.initialData)

module.exports = router
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

module.exports = upload
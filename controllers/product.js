const Product = require('../models/product')
const slugify = require('slugify')
exports.createProduct = (req, res, next) => {
    const { name, price, quantity, description, category } = req.body

    let imagesPath
    if (req.files.length > 0) {
        imagesPath = req.files.map(file => {
            return {
                img: /*process.env.API + '/public/' + */file.filename
            }
        })
    }

    const product = new Product({
        name: name,
        slug: slugify(name),
        price: price,
        description: description,
        quantity,
        productPictures: imagesPath,
        category: category,
        createdBy: req.user._id 
    })

    product.save()
    .then(() => {
        res.status(200).json({
            product: product
        })
    })
    .catch(err => {
        next(err)
    })
}
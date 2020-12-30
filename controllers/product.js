const Product = require('../models/product')
const Category = require('../models/category')
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
    .then((prod) => {
        return Product.findOne({_id: prod._id})
        .select("_id name slug price quantity description productPictures category")
        .populate('category', '_id name')
    })
    .then((prod) => {
        res.status(200).json({
            product: prod
        })
    })
    .catch(err => {
        next(err)
    })
}


exports.getProductsBySlug = (req, res, next) => {
    const slug = req.params.slug
    Category.findOne({slug: slug})
    .then(cat => {
        return Product.find({category: cat._id})
    })
    .then(products => {
        if (products.length > 0) {
            res.status(200).json({
                products,
                productsByPrice: {
                    under500: products.filter(p => p.price < 500),
                    under1000: products.filter(p => p.price > 500 && p.price < 1000),
                    under1500: products.filter(p => p.price > 1000 && p.price < 1500),
                    under2000: products.filter(p => p.price > 1500 && p.price < 2000),
                    under2500: products.filter(p => p.price > 2000 && p.price < 2500)
                }
            })
        } else {
            res.status(200).json({
                message: "No products in this category"
            })
        }
    })
    .catch( err => next(err))
}

exports.getProductDetailsById = (req, res, next) => {
    const { id } = req.params
    Product.findById(id)
    .then(product => {
        res.status(200).json({
            product
        })
    })
    .catch(err => next(err))
} 
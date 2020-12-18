const Category = require('../models/category')
const slugify = require('slugify')
const multer = require('multer')


exports.createCategory = (req, res, next) => {
    const categoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name)
    }
    if (req.file) {
        categoryObj.imagePath = process.env.API + '/public/' + req.file.filename
    }
    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId
    }
    const category = new Category(categoryObj)
    category.save()
    .then(() => {
        return res.status(200).json({
            message: "category created"
        })
    })
    .catch(err => {
        err.statusCode = 500
        next(err)
    })
}

const createNestedList = (categories, parentId) => {
    const list = []
    const childrenArray = categories.filter(cat => cat.parentId == parentId)

    for (let i of childrenArray) {
        const nestedList = createNestedList(categories, i._id)
        const item = {
            id: i._id,
            name: i.name,
            slug: i.slug,
            children: nestedList
        }
        list.push(item)
    }

    //base case: above is skipped, return [] as list
    return list
}

exports.getCategories = (req, res, next) => {
    Category.find()
    .then((categories) => {
        if (categories) {
            const nestedCategoryList = createNestedList(categories)
            res.status(200).json({
                categoryList: nestedCategoryList
            })
        } else {
            res.status(200).json({
                message: "No categories yet"
            })
        }
    })
    .catch(err => {
        err.statusCode = 500
        next(err)
    })
}
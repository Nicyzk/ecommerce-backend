const Category = require('../models/category')
const slugify = require('slugify')
const { nanoid } = require('nanoid')


exports.createCategory = (req, res, next) => {
    const categoryObj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${nanoid()}`
    }
    if (req.file) {
        categoryObj.imagePath = /*process.env.API + '/public/' + */ req.file.filename
    }
    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId
    }
    const category = new Category(categoryObj)
    category.save()
        .then((cat) => {
            catObj = {
                id: cat._id,
                name: cat.name,
                slug: cat.slug,
                type: cat.type,
                parentId: cat.parentId,
                children: []
            }
            return res.status(200).json({
                category: catObj,
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
            type: i.type,
            parentId: i.parentId,
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

exports.updateCategories = async (req, res, next) => {
    const { id, name, parentId, type } = req.body
    if (name instanceof Array) {
        const updatedCategories = []
        const promiseArr = []
        for (let i = 0; i < name.length; i++) {
            const cat = {
                name: name[i],
                slug: `${slugify(name[i])}-${nanoid()}`,
                type: type[i]
            }
            if (parentId[i] !== "") {
                cat.parentId = parentId[i]
            }
            const promise = Category.findOneAndUpdate({ _id: id[i] }, cat, { new: true, overwrite: true })
            promise.then(updatedCat => {
                updatedCategories.push(updatedCat)
            })
            promiseArr.push(promise)
        }
        Promise.all(promiseArr)
            .then(result => {
                res.status(201).json({
                    updatedCategories
                })
            })
            .catch(err => next(err))
    } else {
        const cat = {
            name,
            slug: `${slugify(name)}-${nanoid()}`,
            type
        }
        if (parentId !== "") {
            cat.parentId = parentId
        }
        const updatedCat = await Category.findOneAndUpdate({_id: id}, cat, { new: true })
        res.status(201).json({
            updatedCat
        })
    }
}

exports.deleteCategories = (req, res, next) => {
    const ids = req.body
    const deletedCategories = []
    const promisesArr = []
    for (let i = 0; i < ids.length; i++) {
        const removePromise = Category.findByIdAndRemove(ids[i])
        removePromise.then(deletedCat => deletedCategories.push(deletedCat))
        promisesArr.push(removePromise)
    }
    Promise.all(promisesArr)
    .then(result => {
        res.status(200).json({
            deletedCategories,
            message: "categories deleted successfully"
        })
    })
    .catch(err => next(err))
}
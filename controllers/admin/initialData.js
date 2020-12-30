const Product = require('../../models/product')
const Category = require('../../models/category')

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

exports.initialData = async (req, res, next) => {
    const categories = await Category.find({}).exec()
    const products = await Product.find({})
    .select("_id name slug price quantity description productPictures category")
    .populate('category', '_id name')
    .exec()

    const nestedCategoryList = createNestedList(categories)

    res.status(200).json({
        categoryList: nestedCategoryList, 
        products
    })
}

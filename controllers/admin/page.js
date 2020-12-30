const Page = require('../../models/page') 

exports.createPage = (req, res, next) => {
    const { banners, products } = req.files 
    if (banners instanceof Array) {
        req.body.bannerImages = banners.map(item => {
            return {
                img: `${process.env.API}/public/${item.filename}`,
                navigateTo: `/banner/Clicked?categoryId=${req.body.category}&type=${req.body.type}`
            }
        })
    }
    if (products instanceof Array) {
        req.body.productImages = products.map(item => {
            console.log(item.filename)
            return {
                img: `${process.env.API}/public/${item.filename}`,
                navigateTo: `/product/Clicked?categoryId=${req.body.category}&type=${req.body.type}`
            }
        })
    }
    req.body.createdBy = req.user._id
    Page.findOne({category: req.body.category})
    .then(page => {
        if (page) {
            return Page.findOneAndUpdate({category: req.body.category}, req.body, {new: true})
        } else {
            const page = new Page(req.body)
            return page.save()
        }
    })
    .then(page => {
        return res.status(201).json({
            page
        })
    })
    .catch( err => next(err))
}


exports.getPage = (req, res, next) => {
    const { category, type } = req.params
    if (type === "Page") {
        Page.findOne({category})
        .then(page => {
            if(page) {
                res.status(200).json({
                    page
                })
            } else {
                res.status(404).json({
                    message: "Page does not exist"
                })
            }
        })
        .catch(err => next(err))
    }
}
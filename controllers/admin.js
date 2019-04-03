const Product = require('../models/product')
const User   = require('../models/user')
exports.getAddProducts = (req, res) =>
{
    res.render('admin/edit-product', {
         'title': 'Add Product',
         'path': 'admin.add-product',
         csrfToken: req.csrfToken(),
         editing: false,
         action: "/admin/add-product"
        })
}
exports.postAddProducts = (req, res) => {

    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product({title:title, price:price, description:description, imageUrl:imageUrl, userId: req.user})
    product.save()
        .then( result => {
        console.log("product created !!")
        res.redirect('/')
    })
    .catch( err => {
        console.log(err)
    })
}

exports.getEditProducts = (req, res) => {
    const editMode = req.query.edit
    if(!editMode){
        return res.redirect('/')
    }
    const prodId = req.params.productId
    Product.findById(prodId)
   // Product.findByPk(prodId)
    .then(product => {
        if (!product) {
            return res.redirect('/')
        }
        res.render('admin/edit-product', {
            'title': 'Edit Product',
            'path': 'admin.edit-product',
            csrfToken: req.csrfToken(),
            editing: editMode,
            action: "/admin/edit-product",
            product: product
        })

    }).catch(err => console.log(err))
}

exports.postEditProducts = (req, res) => {
    console.log(req.body)
    const prodId = req.body.prodId
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    Product.findById(prodId).then( product => {
        product.title = title
        product.price = price
        product.description = description
        product.imageUrl = imageUrl
        return product.save()

    })
      .then( result => {
            console.log("UPDATED PRODUCT")
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postDeleteProducts = (req, res) => {
    const prodId = req.body.prodId
    Product.findByIdAndDelete(prodId)
        .then(() => {
            //User.deleteItemFromOrders(prodId)
            console.log('DELETED !')
            res.redirect('/')
        })
        .catch(err => {
            console.log(err)
        })

}

exports.getAllProducts = (req, res, next) => {
             console.log('==>',req.user)
    Product.find()
        /*
        .select('price -_id title')
        .populate('userId','name')*/
        .then( products => {
            res.render('admin/products', {
                'prods': products,
                'title': 'Admin Products',
                'path': 'admin.products',
                csrfToken: req.csrfToken(),
            })
         }).catch(err => console.log(err))
}


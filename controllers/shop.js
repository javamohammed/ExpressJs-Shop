const Product = require('../models/product')
const Order = require('../models/order')
exports.getAllProducts = (req, res) => {

     Product.find().then( products => {
        res.render('shop/products-list', {
            'prods': products,
            'title': 'Shop',
            'path': 'products'
    })
    }).catch( err => console.log(err))
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId).then(product => {
        res.render('shop/product-details', {
            product: product,
            title: product.title,
            path: 'products'
        })
    }).catch( err => console.log(err))
    //console.log(prodId)
    //res.redirect('/')
}


exports.getIndex =  (req, res , next) => {
    Product.find().then( products => {
        res.render('shop/index', {
            'prods': products,
            'title': 'Home',
            'path': 'index'
        })
    }).catch( err => console.log(err))
}

exports.postDeleteCartProduct = (req, res) => {
    const prodId = req.body.prodId
    req.user.deleteItemFromCart(prodId)
        .then(result => {
            console.log("Deleted from Cart!!")
           res.redirect('/cart')
        })
        .catch( err=> {
            console.log(err)
        })

}

exports.getCart = (req, res, next) => {

    req.user
        .populate()
        .execPopulate()
                .then(user => {
                    //console.log(products)
                    products = user.cart.items
                    res.render('shop/cart', {
                        'title': 'Your Cart',
                        'path': 'cart',
                        products: products,
                        csrfToken: req.csrfToken(),
                    })
                })
                .catch(err => {
                    console.log(err)
                })
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId)
        .then(product => {
            return req.user.addCart(product)
        })
        .then(result => {
            console.log(result)
            res.redirect('/cart')
        })
        .catch(err => {
                console.log(err)
        })
}

exports.postOrders = ((req, res, next) => {

    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then((user) => {
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: {...i.productId._doc}}
            })
            const order = new Order({
                user:{
                    name: req.user.name,
                    userId:req.user
                },
                products: products
            })
            return order.save()
            })
            .then((result) => {
                return req.user.clearCart()
            })
            .then(() => {
                res.redirect('/orders')
            })
            .catch(err => {
                console.log(err)
            })
})

exports.getOrders = (req, res, next) => {
    Order.find({"user.userId":req.user._id})
        .then(orders => {
            res.render('shop/orders', {
                'title': 'Your Orders',
                'path': 'orders',
                orders: orders
            })
            })
        .catch(err => {
            console.log(err)
        })
}

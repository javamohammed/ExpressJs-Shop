const express = require('express')
const shopController = require('../controllers/shop')
const csrf = require('csurf')

const router = express.Router()
const csrfProtection = csrf({
    cookie: true
})

router.get('/', shopController.getIndex)

router.get('/products', shopController.getAllProducts)


router.get('/products/:productId', shopController.getProduct)

router.post('/cart', shopController.postCart)
router.get('/cart', csrfProtection, shopController.getCart)
router.post('/cart-delete-item', csrfProtection, shopController.postDeleteCartProduct)

router.post('/create-order', shopController.postOrders)
router.get('/orders', shopController.getOrders)


module.exports = router

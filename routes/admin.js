const express = require('express')
const adminController = require('../controllers/admin')
const csrf = require('csurf')

const router = express.Router()
const csrfProtection = csrf({ cookie: true })

router.get('/add-product', csrfProtection, adminController.getAddProducts)
router.post('/add-product', csrfProtection, adminController.postAddProducts)


router.get('/edit-product/:productId', csrfProtection, adminController.getEditProducts)
router.post('/edit-product', csrfProtection, adminController.postEditProducts)

router.post('/delete-product', csrfProtection, adminController.postDeleteProducts)

router.get('/products', csrfProtection, adminController.getAllProducts)



module.exports = router
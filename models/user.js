const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    cart:{
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
})
userSchema.methods.addCart = function(product){
    const cartProductIndex = this.cart.items.findIndex( pr => {
            return pr.productId.toString() == product._id.toString()
        })

        let newQuantity = 1
        let cartProducts = [...this.cart.items]

        if(cartProductIndex >= 0){
            newQuantity = cartProducts[cartProductIndex].quantity + 1
            cartProducts[cartProductIndex].quantity =  newQuantity
        }else{
            cartProducts.push({
                productId: product._id,
                quantity: 1
            })
        }
        const cartUpdated = { items: cartProducts}
        this.cart = cartUpdated
        return this.save()
}
userSchema.methods.deleteItemFromCart = function (productId) {
    const updatedCart = this.cart.items.filter(i => {
        return i.productId.toString() !== productId.toString()
    })

    this.cart.items = updatedCart
    return this.save()

}

userSchema.methods.clearCart = function () {
    this.cart = {items:[]}
    return this.save()
}
module.exports = mongoose.model('User', userSchema)
/*
const getDb = require('../utils/database').getDb
const mongodb = require('mongodb')
class User {
    constructor(username, email, cart, id){
        this.name = username
        this.email = email
        this.cart = cart
        this._id = id
    }
    save(){
        const db = getDb()
        return db.collection('users').insertOne(this)
    }

    addCart(product){

        const cartProductIndex = this.cart.items.findIndex( pr => {
            return pr.productId.toString() == product._id.toString()
        })

        let newQuantity = 1
        let cartProducts = [...this.cart.items]

        if(cartProductIndex >= 0){
            newQuantity = cartProducts[cartProductIndex].quantity + 1
            cartProducts[cartProductIndex].quantity =  newQuantity
        }else{
            cartProducts.push({ productId: new mongodb.ObjectId(product._id), quantity: 1 })
        }
        const cartUpdated = { items: cartProducts}
        const db = getDb()
        return db.collection('users').updateOne({
            _id: new mongodb.ObjectId(this._id)
        }, {
            $set: {
                cart: cartUpdated
            }
        })

    }

    getCart(){
        const db = getDb();
        const productsIds = this.cart.items.map( i => {
            return i.productId
        })
        return db.collection('products')
            .find({_id: {$in: productsIds}})
            .toArray()
            .then( products => {
                return products.map( p => {
                    return {...p, quantity: this.cart.items.find( i=>{
                        return i.productId.toString() == p._id.toString()
                    }).quantity}
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    deleteItemFromCart(productId){
        const updatedCart = this.cart.items.filter( i => {
            return i.productId.toString() !== productId.toString()
        })
        const db = getDb()
        return db.collection('users').updateOne({
            _id: new mongodb.ObjectId(this._id)
        }, {
            $set: {
                cart: { items: updatedCart}
            }
        })

    }
    static deleteItemFromOrders(productId){
        const db = getDb()
        return db.collection('orders')
                .find()
                .toArray()
                .then(orders => {
                    return orders.map( order => {
                        let id_order = order._id
                        let items = order.items.filter(i => {
                            return i._id.toString() != productId.toString()
                        })
                        return db.collection('orders').updateOne({_id: new mongodb.ObjectId(id_order)},{$set: {items: items}})
                    })
                })
                .then( result => {
                    this.cleanOrders()
                    .then(() => {
                        console.log('Orders cleaned !!')
                        console.log(result ," ===== Order deleted !!")
                    }).catch(err => {
                        console.log(err)
                    })
                })
                .catch(err => {
                    console.log(err)
                })

    }
    static cleanOrders(){
        const db = getDb()
        return db.collection('orders')
            .find()
            .toArray()
            .then(orders => {
                return orders.map( order => {
                    let id_order = order._id
                    console.log('===========', order.items.length)
                    if (order.items.length == 0) {
                        return db.collection('orders').deleteOne({_id: new mongodb.ObjectId(id_order)})
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    addOrder(){
        const db = getDb()
      return  this.getCart()
        .then(products => {
            const order = {
                items: products,
                user: {
                    _id: new mongodb.ObjectId(this._id),
                    name: this.name
                }
                }
             return db.collection('orders').insertOne(order)
        })
        .then(() => {
            return db.collection('users').updateOne({
                    _id: new mongodb.ObjectId(this._id)
                }, {
                    $set: {cart: { items: []}
                }
        })
        })
        .catch(err => {
            console.log(err)
        })
    }

    getOrders(){
        const db = getDb()
        return db.collection('orders').find({'user._id': new mongodb.ObjectId(this._id)}).toArray()
    }


    static findById(userId){
        const db = getDb()
        return db.collection('users')
            .find({
                _id: new mongodb.ObjectId(userId)
            })
            .next()
            .then(user => {
                console.log(user)
                return user
            })
            .catch(err => {
                console.log(err)
            })

    }
}

module.exports = User
*/
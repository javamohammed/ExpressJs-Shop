const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const adminRoutes = require('./routes/admin')
const shopRouters = require('./routes/shop')

const errorsController = require('./controllers/errors')

const User = require('./models/user')


const app = express()


app.use((req, res, next) => {
     User.findById('5ca486de771f210afcb18c7b')
        .then(user => {
             req.user = user
        //console.log(Object.keys(req.user.__proto__));
            next()
        }).catch(err => console.log(err))
})

/*
require('express-debug')(app, {

});*/

app.set('view engine', 'ejs')
app.set('views', 'views')

// we need this because "cookie" is true in csrfProtection
app.use(cookieParser())

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/admin', adminRoutes)
app.use(shopRouters)


app.use(errorsController.get404Page)

const uri = "mongodb+srv://nodejs_test:gebY1FajvcIYDHPG@cluster0-kmqgy.mongodb.net/shop?retryWrites=true";
mongoose.connect(uri,{useNewUrlParser: true}).then( () =>
{
    /*
    const user = new User({name:'Mido', email:'mido@gmail.com',items:[]})
    user.save()
    */
    console.log('connected to Mongodb...ok')
    app.listen(3000)

}).catch(err => {

    console.log(err)
})
const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
class Cart extends Sequelize.Model {}

Cart.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
}, {
    sequelize
})

module.exports = Cart
const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
class CartItem extends Sequelize.Model {}

CartItem.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    quantity: Sequelize.INTEGER
}, {
    sequelize
})

module.exports = CartItem
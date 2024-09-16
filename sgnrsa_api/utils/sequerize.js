const { Sequelize } = require('sequelize');
const dotenv = require('dotenv')

dotenv.config()
const sequelize = new Sequelize({
    host: process.env.BD_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'mysql'
})

module.exports = sequelize
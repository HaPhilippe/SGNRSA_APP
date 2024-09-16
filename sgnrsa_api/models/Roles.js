
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');


/**
* fonction model pour la creation de la table  roles
* @author leonard <habiyakareleonard2019@gmail.bi>
* @date 23/03/2024
* @returns 
*/

const Roles = sequelize.define("roles", {
    ID_ROLE: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
     ROLE:{
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue:null
    },
    DATE_INSERTION:{
        type: DataTypes.DATE,
        allowNull:true,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    tableName: 'roles',
    timestamps: false
})


module.exports = Roles
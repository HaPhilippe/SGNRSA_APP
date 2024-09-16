
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
/**
* fonction model pour la creation de la service
* @author Philippe <hphilip@inoviatech.com>
* @date 08/07/2024
* @returns 
*/

const Service = sequelize.define("service", {
    ID_SERVICE: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    NOM_SERVICE: {
        type: DataTypes.STRING(90),
        allowNull: false,
        defaultValue: null
    },
    DESCRIPTION_SERVICE: {
        type: DataTypes.STRING(250),
        allowNull: false,
        defaultValue: null
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    tableName: 'service',
    timestamps: false
})

module.exports = Service
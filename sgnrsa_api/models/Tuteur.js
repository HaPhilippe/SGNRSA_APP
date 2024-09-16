
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
/**
* fonction model pour la creation de la table  Tuteur
* @author Philippe <philippehatangimana.29dg@gmail.com>
* @date 07/08/2024
* @returns 
*/

const Tuteur = sequelize.define("tuteur", {
    ID_TUT: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    NOM: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    PRENOM: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    EMAIL: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    TELEPHONE:{
        type: DataTypes.STRING(20),
        allowNull: false
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    tableName: 'tuteur',
    timestamps: false
})
module.exports = Tuteur

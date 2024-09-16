
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Personne = require('./Personne');
const Entreprise = require('./Entreprise');
/**
* fonction model pour la creation de la table  Encadrant
* @author Philippe <philippehatangimana.29dg@gmail.com>
* @date 07/08/2024
* @returns 
*/

const Encadrant = sequelize.define("encadrant", {
    ID_ENCA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ID_PERS: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TITRE: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    ID_ENTREPRISE: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    tableName: 'encadrant',
    timestamps: false
})

Encadrant.belongsTo(Personne,{ foreignKey: "ID_PERS", as: 'personne' })
Encadrant.belongsTo(Entreprise,{ foreignKey: "ID_ENTREPRISE", as: 'entreprise' })
module.exports = Encadrant


const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
/**
* fonction model pour la creation de la table  Entreprise
* @author Philippe <philippehatangimana.29dg@gmail.com>
* @date 07/08/2024
* @returns 
*/

const Entreprise = sequelize.define("entreprise", {
    ID_ENTREPR: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    NOM_E: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ADRESSE_E: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    SECTEUR: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    tableName: 'entreprise',
    timestamps: false
})
module.exports = Entreprise

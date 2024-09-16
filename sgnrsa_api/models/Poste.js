
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Departement = require('./Departement');

/**
* fonction model pour la creation de la table  poste
* @author Philippe <philippehatangimana.29dg@gmail.com>
* @date 07/08/2024
* @returns 
*/

const Poste = sequelize.define("poste", {
    ID_POST: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    INTITULE_POST: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: null
    },
    DESCRIPTION_POST: {
        type: DataTypes.STRING(250),
        allowNull: false,
        defaultValue: null
    },
    ID_DEPARTEMENT: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    tableName: 'poste',
    timestamps: false
})
Poste.belongsTo(Departement,{foreignKey:"ID_DEPARTEMENT",as:"departement"});
module.exports = Poste
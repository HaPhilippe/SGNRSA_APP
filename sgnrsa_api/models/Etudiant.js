
const { Sequelize, DataTypes, STRING } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Departement = require('./Departement');


/**
* fonction model pour la creation de la table  etudiant
* @author Philippe <philippehatangimana.29dg@gmail.com>
* @date 07/08/2024
* @returns 
*/

const Etudiant = sequelize.define("etudiant", {
    ID_ETUD: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    NOM: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    PRENOM: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    EMAIL: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    ID_DEPARTEMENT: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    NUMERO_CARTE: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    GENRE:{
        type:DataTypes.STRING(10),
        allowNull:false
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'etudiant',
    timestamps: false
})

module.exports = Etudiant

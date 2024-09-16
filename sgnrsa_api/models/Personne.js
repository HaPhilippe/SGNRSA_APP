
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
/**
* fonction model pour la creation de la table  Personne
* @author Philippe <hphilip@inoviatech.com>
* @date 24/06/2024
* @returns 
*/

const Personne= sequelize.define("personne", {
    ID_PERS: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    NOM:{
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue:null
    },
    PRENOM:{
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue:null
    },	
    EMAIL:{
        type: DataTypes.STRING(90),
        allowNull: false,
        defaultValue:null
    },
    ADRESS:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    TELEPHONE:{
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue:null
    },
    CNI:{
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue:null
    },
    IMAGE:{
        type: DataTypes.STRING(90),
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
    tableName: 'personne',
    timestamps: false
})

module.exports = Personne
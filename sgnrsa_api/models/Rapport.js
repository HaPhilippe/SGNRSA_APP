
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Etudiant = require('./Etudiant');
const Encadrant = require('./Encadrant');


/**
* fonction model pour la creation de la table  Stage
* @author Philippe <philippehatangimana.29dg@gmail.com>
* @date 07/08/2024
* @returns 
*/

const Rapport = sequelize.define("rapport", {
    ID_RAPPORT: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ID_ETUD:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ID_ENCA: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  
    DATE_DEBUT:{
        type: DataTypes.DATE,
        allowNull: false
    },
    DATE_FIN:{
        type: DataTypes.DATE,
        allowNull: false
    },
    SUJET:{
     type:DataTypes.STRING(200),
     allowNull:false
    },
    RAPPORT:{
        type:DataTypes.STRING(200),
        allowNull:false
    },
    EVALUATION:{
        type:DataTypes.STRING(200),
        allowNull:false
    },
    COMMENTAIRE:{
        type:DataTypes.TEXT,
        allowNull:true,
        defaultValue:null
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    tableName: 'rapport',
    timestamps: false
})

Rapport.belongsTo(Etudiant,{foreignKey:"ID_ETUD",as:"etudiant"});
Rapport.belongsTo(Encadrant,{foreignKey:"ID_ENCA",as:"encadrant"});

module.exports = Rapport


const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');

/**
* fonction model pour la creation de la table  etudiant
* @author Philippe <philippehatangimana.29dg@gmail.com>
* @date 07/08/2024
* @returns 
*/

const Faculte = sequelize.define("faculte", {
    ID_FAC: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
  
    NOM: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    DESCRIPTION:{
     type:DataTypes.STRING(250),
     allowNull:true
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'faculte',
    timestamps: false
})


module.exports = Faculte


const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Personne = require('./Personne');

/**
* fonction model pour la creation de la table  Employeur
* @author Philippe <hphilip@inoviatech.com>
* @date 24/06/2024
* @returns 
*/	

const Employeur= sequelize.define("employeur", {
    ID_EMPLOYEUR: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
   
    NOM_EMPLOYEUR:{
    type:DataTypes.STRING(150),
    allowNull:false
    },
    ID_PERS:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NIF:{
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue:null
    },
    RC:{
        type: DataTypes.STRING(70),
        allowNull: false,
        defaultValue:null
    },
    DATE_INSERTION:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue:DataTypes.NOW
    }
}, {
    freezeTableName: true,
    tableName: 'employeur',
    timestamps: false
})

Employeur.belongsTo(Personne, { foreignKey: "ID_PERS", as: 'personne' })
module.exports = Employeur
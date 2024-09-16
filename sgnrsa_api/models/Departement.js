
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Employeur = require('./Employeur');
/**
* fonction model pour la creation de la table  Departement
* @author Philippe <hphilip@inoviatech.com>
* @date 26/06/2024
* @returns 
*/

const Departement= sequelize.define("departement", {
    ID_DEPARTEMENT: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    NOM_DEPARTEMENT:{
     type:DataTypes.STRING(50),
     allowNull:false
    },
    DESCRIPTION:{
        type: DataTypes.STRING(250),
        allowNull: false
    },
    ID_EMPLOYEUR:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DATE_INSERTION:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue:DataTypes.NOW
    },
}, {
    freezeTableName: true,
    tableName: 'departement',
    timestamps: false
})
Departement.belongsTo(Employeur,{foreignKey:"ID_EMPLOYEUR",as:"employeur"});
module.exports = Departement
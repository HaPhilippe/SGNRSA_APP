
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Departement = require('./Departement');
const Personne = require('./Personne');

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
    ID_PERS:{
        type: DataTypes.INTEGER,
        allowNull: false,
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
    tableName: 'etudiant',
    timestamps: false
})
Etudiant.belongsTo(Personne,{foreignKey:"ID_PERS",as:"personne"});
Etudiant.belongsTo(Departement,{foreignKey:"ID_DEPARTEMENT",as:"departement"});
module.exports = Etudiant

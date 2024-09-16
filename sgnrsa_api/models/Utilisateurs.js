const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Profil = require('./Profil');

const Utilisateurs = sequelize.define('utilisateurs', {
    ID_UTILISATEUR: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    USERNAME: {
        type: DataTypes.STRING(245),
        allowNull: false
    },
    PASSWORD: {
        type: DataTypes.STRING(245),
        allowNull: false
    },
    IMAGE: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ID_PROFIL: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TELEPHONE: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    EMAIL: {
        type: DataTypes.STRING(245),
        allowNull: false
    },
    NOM: {
        type: DataTypes.STRING(245),
        allowNull: false
    },
    PRENOM: {
        type: DataTypes.STRING(245),
        allowNull: false
    },
    MATRICULE: {
        type: DataTypes.STRING(245),
        allowNull: true
    },
    IS_ACTIF: {
        type: DataTypes.INTEGER(245),
        allowNull: false,
        defaultValue: "1"
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
},
    {
        freezeTableName: true,
        tableName: 'utilisateurs',
        timestamps: false
    }
);
Utilisateurs.belongsTo(Profil, { foreignKey: "ID_PROFIL", as: 'PROFIL' })

module.exports = Utilisateurs;
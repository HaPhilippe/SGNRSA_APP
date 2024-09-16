
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Profil = require('./Profil');
const Roles = require('./Roles');


/**
* fonction model pour la creation de la table profiles roles
* @author leonard <habiyakareleonard2019@gmail.bi>
* @date 23/03/2024
* @returns 
*/

const Profil_roles = sequelize.define("profil_roles", {
    ID_PROFIL_ROLE: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ID_PROFIL: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null
    },
    ID_ROLE: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null
    },
    CAN_READ: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: null
    },
    CAN_WRITE: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: null
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    tableName: 'profil_roles',
    timestamps: false
})

Profil_roles.belongsTo(Profil,{foreignKey:"ID_PROFIL",as :'profil'})
Profil_roles.belongsTo(Roles, { foreignKey: "ID_ROLE", as: "role" })
Profil.hasMany(Profil_roles, { foreignKey: "ID_PROFIL", as: "profil_roles" })

module.exports = Profil_roles
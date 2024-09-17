const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');


const Profil = sequelize.define('profil', {
    ID_PROFIL: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    DESCRIPTION: {
        type: DataTypes.STRING(245),
        allowNull: false
    },
},
    {
        freezeTableName: true,
        tableName: 'profil',
        timestamps: false
    });

module.exports = Profil;
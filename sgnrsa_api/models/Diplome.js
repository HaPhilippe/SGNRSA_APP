
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
/**
* fonction model pour la creation de la table diplome
* @author Philippe <hphilip@inoviatech.com>
* @date 08/07/2024
* @returns 
*/
	
const Diplome = sequelize.define("diplome", {
    ID_DIPLOME: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    NOM_DIPLOME: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: null
    },
    DESCRIPTION_DIPLOME: {
        type: DataTypes.STRING(250),
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
    tableName: 'diplome',
    timestamps: false
})

module.exports = Diplome
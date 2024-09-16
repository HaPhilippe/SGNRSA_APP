
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Personne = require('./Personne');
const Diplome = require('./Diplome');
const Service = require('./Service');
const Poste = require('./Poste');

/**
* fonction model pour la creation de la table  Employe
* @author Philippe <hphilip@inoviatech.com>
* @date 26/06/2024
* @returns 
*/

const Employe = sequelize.define("employe", {

    ID_EMPLOYE: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ID_PERS: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_POST:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_DIPLOME: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ID_SERVICE: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NUMERO_MATRICULE: {
        type: DataTypes.STRING(30),
        allowNull: false ?
            defaultValue : null
    },
    DATE_INSERTION: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    tableName: 'employe',
    timestamps: false
})

Employe.belongsTo(Personne, { foreignKey: "ID_PERS", as: 'personne' })
Employe.belongsTo(Diplome, { foreignKey: "ID_DIPLOME", as: 'diplome' })
Employe.belongsTo(Service, { foreignKey: "ID_SERVICE", as: 'service' })
Employe.belongsTo(Poste, { foreignKey: "ID_POST", as: 'poste' })
module.exports = Employe
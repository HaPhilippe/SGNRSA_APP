
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');
const Utilisateurs = require('./Utilisateurs');

/**
* fonction model pour utilisateur_tokens
* @author leonard<habiyakareleonard2019@gmail.com>
* @date 18/02/2024
* @returns 
*/

const Utilisateurs_tokens = sequelize.define('utilisateurs_tokens', {
          ID_UTILISATEUR_TOKEN: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
          },
          ID_UTILISATEUR: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
          },
          NOTIFICATION_TOKEN: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                    defaultValue: null
          },
          LOCALE: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                    defaultValue: 'fr'
          },
          REFRESH_TOKEN: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                    defaultValue: null
          },
          IS_ACTIVE: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: 1
          },
          userAgent: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
          },
          vendor: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
          },
          platform: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
          },
          appCodeName: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
          },
          appName: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
          },
          appVersion: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
          },
          browserName: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
          },
          browserVersion: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
          },
          osName: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
          },
          osVersion: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
          },
          mobile: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: null
          },
          DATE_INSERTION: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW
          }
}, {
          freezeTableName: true,
          tableName: 'utilisateurs_tokens',
          timestamps: false
})

Utilisateurs_tokens.belongsTo(Utilisateurs, { foreignKey: "ID_UTILISATEUR", as: "utilisateur" });
module.exports = Utilisateurs_tokens
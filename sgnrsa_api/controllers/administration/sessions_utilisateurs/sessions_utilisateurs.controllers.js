
const express = require("express")
const { Op } = require("sequelize")
const RESPONSE_STATUS = require("../../../constants/RESPONSE_STATUS")
const RESPONSE_CODES = require("../../../constants/RESPONSE_CODES")
const Utilisateurs_tokens = require("../../../models/Utilisateurs_tokens")
const Utilisateurs = require("../../../models/Utilisateurs")


/**
 * fonction permettant de lister les sessions d'un utilisateur
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const findAllsessionutilisateurs = async (req, res) => {
    try {
        const { Utilisateurstatut, utilisateur, rows = 10, first = 0, sortField, sortOrder, search } = req.query
        const defaultSortField = "utilisateurs_tokens.DATE_INSERTION"
        const defaultSortDirection = "desc"
        const sortColumns = {
            utilisateurs_tokens: {
                as: "utilisateurs_tokens",
                fields: {
                    ID_UTILISATEUR_TOKEN: 'ID_UTILISATEUR_TOKEN',
                    NOTIFICATION_TOKEN: 'NOTIFICATION_TOKEN',
                    LOCALE: 'LOCALE',
                    REFRESH_TOKEN: 'REFRESH_TOKEN',
                    IS_ACTIVE: 'IS_ACTIVE',
                    userAgent: 'userAgent',
                    vendor: 'vendor',
                    platform: 'platform',
                    appCodeName: 'appCodeName',
                    appName: 'appName',
                    appVersion: 'appVersion',
                    browserName: 'browserName',
                    browserVersion: 'browserVersion',
                    osName: 'osName',
                    osVersion: 'osVersion',
                    mobile: 'mobile'

                }
            },
            utilisateurs: {
                as: "utilisateur",
                fields: {
                    ID_UTILISATEUR: 'ID_UTILISATEUR',
                    NOM: 'NOM',
                    PRENOM: 'PRENOM'

                }
            }

        }

        var orderColumn, orderDirection

        // sorting
        var sortModel
        if (sortField) {
            for (let key in sortColumns) {
                if (sortColumns[key].fields.hasOwnProperty(sortField)) {
                    sortModel = {
                        model: key,
                        as: sortColumns[key].as
                    }
                    orderColumn = sortColumns[key].fields[sortField]
                    break
                }
            }
        }
        if (!orderColumn || !sortModel) {
            orderColumn = defaultSortField
            sortModel = {
                model: 'utilisateurs_tokens',
                as: sortColumns.utilisateurs_tokens.as
            }
        }

        // ordering
        if (sortOrder == 1) {
            orderDirection = 'ASC'
        } else if (sortOrder == -1) {
            orderDirection = 'DESC'
        } else {
            orderDirection = defaultSortDirection
        }

        // searching
        const globalSearchColumns = [
            'NOTIFICATION_TOKEN',
            'LOCALE',
            'REFRESH_TOKEN',
            'IS_ACTIVE',
            'userAgent',
            'vendor',
            'platform',
            'appCodeName',
            'appName',
            'appVersion',
            'browserName',
            'browserVersion',
            'osName',
            'osVersion',
            'mobile',
            'DATE_INSERTION',
            '$utilisateur.NOM$',
            '$utilisateur.PRENOM$'
        ]
        var globalSearchWhereLike = {}
        if (search && search.trim() != "") {
            const searchWildCard = {}
            globalSearchColumns.forEach(column => {
                searchWildCard[column] = {
                    [Op.substring]: search
                }
            })
            globalSearchWhereLike = {
                [Op.or]: searchWildCard
            }
        }

        var statutInfo = {}
        if (Utilisateurstatut) {
            var IS_ACTIVE = null
            if (Utilisateurstatut == 0) {
                IS_ACTIVE = 0
            } else if (Utilisateurstatut == 1) {
                IS_ACTIVE = 1
            }
            if (IS_ACTIVE != null) {
                statutInfo = { IS_ACTIVE: IS_ACTIVE }
            }
        }

        var utilisateurs = {}

        if (utilisateur) {
            utilisateurs = { ID_UTILISATEUR: utilisateur }
        }

        const result = await Utilisateurs_tokens.findAndCountAll({
            limit: parseInt(rows),
            offset: parseInt(first),
            order: [
                [sortModel, orderColumn, orderDirection]
            ],
            attributes: [
                'ID_UTILISATEUR_TOKEN',
                'ID_UTILISATEUR',
                'NOTIFICATION_TOKEN',
                'LOCALE',
                'REFRESH_TOKEN',
                'IS_ACTIVE',
                'userAgent',
                'vendor',
                'platform',
                'appCodeName',
                'appName',
                'appVersion',
                'browserName',
                'browserVersion',
                'osName',
                'osVersion',
                'mobile',
                'DATE_INSERTION'
            ],

            where: {
                ...globalSearchWhereLike,
                ...statutInfo,
                ...utilisateurs
            },
            include: {
                model: Utilisateurs,
                as: 'utilisateur',
                required: true,
                attributes: ['ID_UTILISATEUR', 'NOM', 'PRENOM', 'IMAGE', 'TELEPHONE'],

            }
        })
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des sessions des utilisateurs",
            result: {
                data: result.rows,
                totalRecords: result.count
            }
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}


/**
 * Permet  de  mettre a jour le statut d'une session d'un utilisateur
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const change_status = async (req, res) => {
    try {
        const { ID_UTILISATEUR_TOKEN } = req.params;
        const UtiObject = await Utilisateurs_tokens.findByPk(ID_UTILISATEUR_TOKEN, {
            attributes: ["ID_UTILISATEUR_TOKEN", "IS_ACTIVE"],
        });
        const utilsateurnotication = UtiObject.toJSON();
        let IS_ACTIVE = 1;
        if (utilsateurnotication.IS_ACTIVE) {
            IS_ACTIVE = 0;
        } else {
            IS_ACTIVE = 1;
        }

        await Utilisateurs_tokens.update(
            { IS_ACTIVE: IS_ACTIVE },
            {
                where: { ID_UTILISATEUR_TOKEN: ID_UTILISATEUR_TOKEN },
            }
        );
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès",
        });
    } catch (error) {
        console.log(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};


/**
* Permet de  supprimer  une session d'un utilisateur
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const deleteItems = async (req, res) => {
    try {
        const { ids } = req.body;
        const ID_UTILISATEUR_TOKEN = JSON.parse(ids);
        await Utilisateurs_tokens.destroy({
            where: {
                ID_UTILISATEUR_TOKEN: {
                    [Op.in]: ID_UTILISATEUR_TOKEN,
                },
            },
        });
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Les elements ont ete supprimer avec success",
        });
    } catch (error) {
        console.log(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        });
    }
};


/**
 * fonction Permet  de trouver le nom et prenom d'un utilisateurs sur la filtre d'un session d'un utilisateur
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const utilisateurall = async (req, res) => {
    try {
        const { rows = 10, first = 0, sortField, sortOrder, search } = req.query
        const defaultSortField = "NOM "
        const defaultSortDirection = "ASC"
        const sortColumns = {
            utilisateurs: {
                as: "utilisateurs",
                fields: {
                    ID_UTILISATEUR: "ID_UTILISATEUR",
                    NOM: "NOM",
                    PRENOM: "PRENOM"

                }
            },
        }

        var orderColumn, orderDirection

        // sorting
        var sortModel
        if (sortField) {
            for (let key in sortColumns) {
                if (sortColumns[key].fields.hasOwnProperty(sortField)) {
                    sortModel = {
                        model: key,
                        as: sortColumns[key].as
                    }
                    orderColumn = sortColumns[key].fields[sortField]
                    break
                }
            }
        }
        if (!orderColumn || !sortModel) {
            orderColumn = sortColumns.utilisateurs.fields.NOM
            sortModel = {
                model: 'utilisateurs',
                as: sortColumns.utilisateurs
            }
        }
        // ordering
        if (sortOrder == 1) {
            orderDirection = 'ASC'
        } else if (sortOrder == -1) {
            orderDirection = 'DESC'
        } else {
            orderDirection = defaultSortDirection
        }

        // searching
        const globalSearchColumns = [
            'ID_UTILISATEUR',
            'NOM',
            'PRENOM',

        ]
        var globalSearchWhereLike = {}
        if (search && search.trim() != "") {
            const searchWildCard = {}
            globalSearchColumns.forEach(column => {
                searchWildCard[column] = {
                    [Op.substring]: search
                }
            })
            globalSearchWhereLike = {
                [Op.or]: searchWildCard
            }
        }

        const result = await Utilisateurs.findAndCountAll({
            limit: parseInt(rows),
            offset: parseInt(first),
            order: [
                [sortModel, orderColumn, orderDirection]
            ],
            where: {
                ...globalSearchWhereLike

            },
            attributes: ['ID_UTILISATEUR', 'NOM', 'PRENOM']
        })
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des utilisateurs",
            result: {
                data: result.rows,
                totalRecords: result.count
            }
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
};

module.exports = {
    findAllsessionutilisateurs,
    change_status,
    deleteItems,
    utilisateurall
}



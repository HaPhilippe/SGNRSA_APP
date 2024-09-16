const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
// const Corporates = require("../../models/admin/Corporates")
// const Utilisateurs = require("../../models/admin/Utilisateurs")
const md5 = require("md5")
// const Profil = require("../../models/admin/Profil")
const generateToken = require('../../utils/generateToken');
const TOKENS_CONFIG = require("../../constants/TOKENS_CONFIG")
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken")
// const PROFILS = require("../../constants/PROFILS")
// const Utilisateurs_tokens = require("../../models/admin/Utilisateurs_tokens")
const { DEFAULT_JWT_REFRESH_PRIVATE_KEY } = require("../../config/app")
const Utilisateurs = require("../../models/Utilisateurs")
const Utilisateurs_tokens = require("../../models/Utilisateurs_tokens")
const Profil = require("../../models/Profil")
const Profil_roles = require("../../models/Profil_roles")

dotenv.config()


/**
 * Permet de vérifier la connexion d'un utilisateur
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const login = async (req, res) => {
    try {
        const { EMAIL, PASSWORD, deviceInfo: deviceInfoStr } = req.body;
        var deviceInfo
        if (deviceInfoStr) {
            deviceInfo = JSON.parse(deviceInfoStr)
        }
        const validation = new Validation(
            req.body,
            {
                EMAIL: {
                    required: true,
                    email: true
                },
                PASSWORD:
                {
                    required: true,
                },
            },
            {
                PASSWORD:
                {
                    required: "Le mot de passe est obligatoire",
                },
                EMAIL: {
                    required: "L'email est obligatoire",
                    email: "Email invalide"
                }
            }
        );
        await validation.run();
        const isValid = await validation.isValidate()
        const errors = await validation.getErrors()
        if (!isValid) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Probleme de validation des donnees",
                result: errors
            })
        }
        const userObject = await Utilisateurs.findOne({
            where: { EMAIL: EMAIL, IS_ACTIF: 1 },
            attributes: ['ID_UTILISATEUR', 'PASSWORD', 'ID_PROFIL', 'TELEPHONE', 'EMAIL', 'NOM', 'PRENOM', 'IS_ACTIF', 'IMAGE'],
            include:[
                {model:Profil,
                as:"PROFIL",
                attributes:["ID_PROFIL","DESCRIPTION"],
                required:true,
                include:[
                    {
                        model: Profil_roles,
                        attributes:["ID_ROLE","CAN_READ","CAN_WRITE"],
                        as: "profil_roles",
                        required: false,  
                    }
                ]
            }
            // ,
            // {
            //     model:Utilisateur_roles,
            //     as: "utilisateur_roles",
            //     attributes: ["ID_ROLE","CAN_READ","CAN_WRITE"],
            //     separate: true, // Sépare les résultats des rôles de l'utilisateur
            //     order: [['ID_ROLE', 'ASC']] // Ordonne par l'ID_ROLE du modèle Utilisateur_roles
            // }
            ],
            order: [
                [{ model: Profil, as: "PROFIL" }, { model: Profil_roles, as: "profil_roles" }, "ID_ROLE", "ASC"]
              ]
        
        })

        if (userObject) {
            const user = userObject.toJSON()
            const pass = md5(PASSWORD)
            if (user.PASSWORD == pass) {
                const tokenData = {
                    user: user.ID_UTILISATEUR,
                    // ID_PROFIL:ID_PROFIL
                }
                // const token = generateToken(tokenData, TOKENS_CONFIG.APP_ACCESS_TOKEN_MAX_AGE)
                const token = generateToken({ user: user.ID_UTILISATEUR }, 3 * 12 * 30 * 24 * 3600)
                const JWT_REFRESH_PRIVATE_KEY = process.env.JWT_REFRESH_PRIVATE_KEY || "\L/@B8?o4@vp-3MCt!,*\S@,e7+-TK]'a5M8o!t)!\cMqhw|aO4i8}Uq*L7,46)--}4c-]\[el/3D-G-F#pg4*FPP.xoYqa-W3,s|8.(tCa(s@uC;:L"
                const refreshToken = jwt.sign(tokenData, JWT_REFRESH_PRIVATE_KEY, {
                    expiresIn: TOKENS_CONFIG.REFRESH_TOKEN_MAX_AGE
                })
                // saving notification token and refresh token
                await Utilisateurs_tokens.create({
                    ID_UTILISATEUR: user.ID_UTILISATEUR,
                    REFRESH_TOKEN: refreshToken,
                    userAgent: deviceInfo?.userAgent,
                    vendor: deviceInfo?.vendor,
                    platform: deviceInfo?.platform,
                    appCodeName: deviceInfo?.appCodeName,
                    appName: deviceInfo?.appName,
                    appVersion: deviceInfo?.appVersion,
                    browserName: deviceInfo?.browserName,
                    browserVersion: deviceInfo?.browserVersion,
                    osName: deviceInfo?.osName,
                    osVersion: deviceInfo?.osVersion,
                    mobile: deviceInfo?.mobile
                })
                const { PASSWORD, ...other } = user
                res.status(RESPONSE_CODES.CREATED).json({
                    statusCode: RESPONSE_CODES.CREATED,
                    httpStatus: RESPONSE_STATUS.CREATED,
                    message: "Vous êtes connecté avec succès",
                    result: {
                        ...other,
                        token,
                        REFRESH_TOKEN: refreshToken
                    }
                })
            } else {
                validation.setError('main', 'Identifiants incorrects')
                const errors = await validation.getErrors()
                res.status(RESPONSE_CODES.NOT_FOUND).json({
                    statusCode: RESPONSE_CODES.NOT_FOUND,
                    httpStatus: RESPONSE_STATUS.NOT_FOUND,
                    message: "Utilisateur n'existe pas",
                    result: errors
                })
            }
        } else {
            validation.setError('main', 'Identifiants incorrects')
            const errors = await validation.getErrors()
            res.status(RESPONSE_CODES.NOT_FOUND).json({
                statusCode: RESPONSE_CODES.NOT_FOUND,
                httpStatus: RESPONSE_STATUS.NOT_FOUND,
                message: "Utilisateur n'existe pas",
                result: errors
            })
        }
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
 * Marque l'utilisateur comme deconnecte
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const logout = async (req, res) => {
    try {
        const { PUSH_NOTIFICATION_TOKEN, REFRESH_TOKEN, user } = req.body;
        // return console.log(req.body)
        const sessionObject = await Utilisateurs_tokens.findOne({
            where: {
                IS_ACTIVE: 1,
                REFRESH_TOKEN: REFRESH_TOKEN,
                ID_UTILISATEUR: user
            },
            attributes: ['ID_UTILISATEUR_TOKEN']
        })
        if (sessionObject) {
            const session = sessionObject.toJSON()
            await Utilisateurs_tokens.update({
                IS_ACTIVE: 0
            }, {
                where: {
                    ID_UTILISATEUR_TOKEN: session.ID_UTILISATEUR_TOKEN
                }
            })
        }
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Utilisateur deconnecte avec succes",
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
 * Permet de retourner un nouveau access token
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const getNewAccessToken = async (req, res) => {
    try {
        const bearer = req.headers.authorization;
        const bearerToken = bearer && bearer.split(" ")[1];
        const accessToken = bearerToken;
        const refreshToken = req.headers['x-refresh-token']
        const validation = new Validation({ accessToken, refreshToken }, {
            accessToken: {
                required: true
            },
            refreshToken: {
                required: true
            }
        })
        const isValid = await validation.isValidate()
        if (!isValid) {
            const errors = await validation.getErrors()
            return res.status(422).json({ errors });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_PRIVATE_KEY || DEFAULT_JWT_REFRESH_PRIVATE_KEY, async (error, refreshPayload) => {
            try {
                if (error) {
                    return res.status(422).json({ message: "Invalid refresh token", authStatus: req.authStatus })
                }
                const userObject = await Utilisateurs_tokens.findOne({
                    attributes: ['ID_UTILISATEUR_TOKEN'],
                    where: {
                        REFRESH_TOKEN: refreshToken,
                        IS_ACTIVE: 1,
                    },
                    include: [{
                        model: Utilisateurs,
                        required: true,
                        as: 'utilisateur',
                        attributes: ['ID_UTILISATEUR']
                    }]
                })
                if (!userObject) {
                    return res.status(422).json({ message: "Invalid refresh token", authStatus: req.authStatus })
                }
                const user = await userObject.toJSON()
                var maxAge = TOKENS_CONFIG.APP_ACCESS_TOKEN_MAX_AGE
                const tokenData = {
                    user: user.utilisateur.ID_UTILISATEUR,
                    ID_PROFIL: PROFILS.admin
                }
                res.status(RESPONSE_CODES.OK).json({
                    statusCode: RESPONSE_CODES.OK,
                    httpStatus: RESPONSE_STATUS.OK,
                    message: "Nouveau access token",
                    result: generateToken(tokenData, maxAge)
                })
            } catch (error) {
                console.log(error)
                res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                    statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                    httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                    message: "Erreur interne du serveur, réessayer plus tard",
                })
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


module.exports = {
    login,
    logout,
    getNewAccessToken
}
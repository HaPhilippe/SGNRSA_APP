const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const md5 = require('md5')
const { Op } = require("sequelize")
const Etats_conge = require("../../models/Etats_conge")

/**
 * fonction  Permet de creer un etats_conge
 * @date  10/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const createEtats_conge = async (req, res) => {
  try {
    const {
      LIBELLE
    } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      LIBELLE: {
        required: true,
        length: [1, 20],
        alpha: true
      }
    }, {
      LIBELLE: {
        required: "Ce champ est obligatoire",
        length: "La libelle ne doit pas depasser max(20 caracteres)",
        alpha: "La libelle est invalide"
      }
    })
    await validation.run()
    const isValid = await validation.isValidate()
    if (!isValid) {
      const errors = await validation.getErrors()
      return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
        message: "Probleme de validation des donnees",
        result: errors
      })
    }

    const etat_c = await Etats_conge.create({
      LIBELLE
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'etat a bien ete cree avec succes",
      result: etat_c
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
 * Permet de modifier l'etat_conge'
* @date  10/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const updateEtats_conge = async (req, res) => {

  try {
    const {ID_ETAT_CONGE} = req.params;
    const {
      LIBELLE
    } = req.body

    const data = { ...req.body };
    const validation = new Validation(data, {
      LIBELLE: {
        required: true,
        length: [1, 20],
        alpha: true
      }
    }, {
      LIBELLE: {
        required: "Ce champ est obligatoire",
        length: "La libelle ne doit pas depasser max(20 caracteres)",
        alpha: "La libelle est invalide"
      }
    })
    await validation.run()
    const isValid = await validation.isValidate()
    if (!isValid) {
      const errors = await validation.getErrors()
      return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
        message: "Probleme de validation des donnees",
        result: errors
      })
    }


    const etats_conge = await Etats_conge.update(
      {
       LIBELLE
      },
      {
        where: { ID_ETAT_CONGE: ID_ETAT_CONGE }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'etat a été modifie avec succes",
      result: etats_conge
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
 * Permet d'afficher tous les etats_conge
 * @date  10/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const findAll = async (req, res) => {
  try {
    const { rows = 10, first = 0, sortField, sortOrder, search } = req.query
    const defaultSortField = "DATE_INSERTION"
    const defaultSortDirection = "DESC"
    const sortColumns = {
      etats_conge: {
        as: "etats_conge",
        fields: {
         LIBELLE:'LIBELLE',
          DATE_INSERTION: 'DATE_INSERTION'
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
      orderColumn = sortColumns.etats_conge.fields.DATE_INSERTION
      sortModel = {
        model: 'etats_conge',
        as: sortColumns.etats_conge.as
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
      'LIBELLE',
      'DATE_INSERTION'
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
    const result = await Etats_conge.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      }
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des etats_conges",
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
 * Permet pour la suppressiuon d'un etat_conge sur la liste.
* @date  10/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Etats_conge.destroy({
      where: {
        ID_ETAT_CONGE: {
          [Op.in]: itemsIds
        }
      }
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Les elements ont ete supprimer avec success",
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
 * Permet pour recuperer un service selon l'id
* @date  08/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const findOneEtats_conge = async (req, res) => {
  try {
    const { ID_ETAT_CONGE } = req.params
    const etats_con = await Etats_conge.findOne({
      where: {
        ID_ETAT_CONGE
      }
    })

    if (etats_con) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "L'etat congé",
        result: etats_con
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Le etat conge non trouve",
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

module.exports = {
  createEtats_conge,
  findAll,
  deleteItems,
  findOneEtats_conge,
  updateEtats_conge
}
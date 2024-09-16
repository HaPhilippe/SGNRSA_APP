const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const Conges_payant = require("../../models/Conge_payant")

/**
 * fonction  Permet de creer un conge payant
 * @date  15/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const createconge_payant = async (req, res) => {
  try {
    const {
      CONGES_PAYANT,
      DESCRIPTION_PAYANT
    } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      CONGES_PAYANT: {
        required: true,
        length: [1, 100],
        alpha: true
      },
      DESCRIPTION_PAYANT: {
        required: true,
        length: [1, 250],
        alpha: true
      }
    }, {
      CONGES_PAYANT: {
        required: "Ce champ est obligatoire",
        length: "Le conge payant ne doit pas depasser max(100 caracteres)",
        alpha: "Le conge payant est invalide"
      },
      DESCRIPTION_PAYANT: {
        required: "Ce champ est obligatoire",
        length: "Le conge payant  ne doit pas depasser max(250 caracteres)",
        alpha: "Le conge payant  est invalide"
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

    const conges_payant = await Conges_payant.create({
      CONGES_PAYANT,
      DESCRIPTION_PAYANT
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le congé payant a bien ete cree avec succes",
      result: conges_payant
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

const updateconge_payant = async (req, res) => {

  try {
    const { ID_CONGES_PAYANT } = req.params;
    const {
      CONGES_PAYANT,
      DESCRIPTION_PAYANT
    } = req.body

    const data = { ...req.body };
    const validation = new Validation(data, {
      CONGES_PAYANT: {
        required: true,
        length: [1, 100],
        alpha: true
      },
      DESCRIPTION_PAYANT: {
        required: true,
        length: [1, 250],
        alpha: true
      }
    }, {
      CONGES_PAYANT: {
        required: "Ce champ est obligatoire",
        length: "Le conge payant ne doit pas depasser max(100 caracteres)",
        alpha: "Le conge payant est invalide"
      },
      DESCRIPTION_PAYANT: {
        required: "Ce champ est obligatoire",
        length: "Le conge payant  ne doit pas depasser max(250 caracteres)",
        alpha: "Le conge payant  est invalide"
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


    const conges_payant = await Conges_payant.update(
      {
        CONGES_PAYANT,
        DESCRIPTION_PAYANT
      },
      {
        where: { ID_CONGES_PAYANT: ID_CONGES_PAYANT }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le conge payant a été modifie avec succes",
      result: conges_payant
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
 * Permet d'afficher tous les conges_payant
 * @date  15/07/2024
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
      conges_payant: {
        as: "conges_payant",
        fields: {
          CONGES_PAYANT: 'CONGES_PAYANT',
          DESCRIPTION_PAYANT: 'DESCRIPTION_PAYANT',
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
      orderColumn = sortColumns.conges_payant.fields.DATE_INSERTION
      sortModel = {
        model: 'conges_payant',
        as: sortColumns.conges_payant.as
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
      'CONGES_PAYANT',
      'DESCRIPTION_PAYANT',
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
    const result = await Conges_payant.findAndCountAll({
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
      message: "Liste des conges payants",
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
 * Permet pour la suppressiuon d'un conge payant sur la liste.
* @date  15/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Conges_payant.destroy({
      where: {
        ID_CONGES_PAYANT: {
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
 * Permet pour recuperer un conge payant selon l'id
* @date  15/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const findOneconge_payant = async (req, res) => {
  try {
    const { ID_CONGES_PAYANT } = req.params
    const conge_payant = await Conges_payant.findOne({
      where: {
        ID_CONGES_PAYANT
      }
    })

    if (conge_payant) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Le congé payant",
        result: conge_payant
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Le conge payant non trouve",
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
  createconge_payant,
  findAll,
  deleteItems,
  findOneconge_payant,
  updateconge_payant
}
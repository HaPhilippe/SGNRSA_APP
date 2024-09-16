const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const Conges_n_payant = require("../../models/Conge_n_payant")

/**
 * fonction  Permet de creer les conges non payants
 * @date  15/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const createconge_non_payant = async (req, res) => {
  try {
    const {
      CONGES_N_PAYANT,
      DESCRIPTION_N_C_P
    } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      CONGES_N_PAYANT: {
        required: true,
        length: [1, 100],
        alpha: true
      },
      DESCRIPTION_N_C_P: {
        required: true,
        length: [1, 250],
        alpha: true
      }
    }, {
      CONGES_N_PAYANT: {
        required: "Ce champ est obligatoire",
        length: "Le conge non payant ne doit pas depasser max(100 caracteres)",
        alpha: "Le conge non payant est invalide"
      },
      DESCRIPTION_N_C_P: {
        required: "Ce champ est obligatoire",
        length: "La description de conge non payant ne doit pas depasser max(250 caracteres)",
        alpha: "La description de conge non payant est invalide"
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

    const conge_non_payant = await Conges_n_payant.create({
      CONGES_N_PAYANT,
      DESCRIPTION_N_C_P
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "La description de conge non payanta bien ete cree avec succes",
      result: conge_non_payant
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
 * Permet de modifier la description de conge non payant'
* @date  15/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const updateconge_non_payant = async (req, res) => {

  try {
    const { ID_CONGE_N_PAYANT } = req.params;
    const {
      CONGES_N_PAYANT,
      DESCRIPTION_N_C_P
    } = req.body

    const data = { ...req.body };
    const validation = new Validation(data, {
      CONGES_N_PAYANT: {
        required: true,
        length: [1, 100],
        alpha: true
      },
      DESCRIPTION_N_C_P: {
        required: true,
        length: [1, 250],
        alpha: true
      }
    }, {
      CONGES_N_PAYANT: {
        required: "Ce champ est obligatoire",
        length: "Le conge non payant ne doit pas depasser max(100 caracteres)",
        alpha: "Le conge non payant est invalide"
      },
      DESCRIPTION_N_C_P: {
        required: "Ce champ est obligatoire",
        length: "La description de conge non payant ne doit pas depasser max(250 caracteres)",
        alpha: "La description de conge non payant est invalide"
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


    const conge_non_payant = await Conges_n_payant.update(
      {
        CONGES_N_PAYANT,
        DESCRIPTION_N_C_P
      },
      {
        where: { ID_CONGE_N_PAYANT: ID_CONGE_N_PAYANT }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "La description de conge non payant a été modifie avec succes",
      result: conge_non_payant
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
 * Permet d'afficher tous les description de conge non payant
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
      conges_n_payant: {
        as: "conges_n_payant",
        fields: {
          CONGES_N_PAYANT: 'CONGES_N_PAYANT',
          DESCRIPTION_N_C_P: 'DESCRIPTION_N_C_P',
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
      orderColumn = sortColumns.conges_n_payant.fields.DATE_INSERTION
      sortModel = {
        model: 'conges_n_payant',
        as: sortColumns.conges_n_payant.as
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
      'CONGES_N_PAYANT',
      'DESCRIPTION_N_C_P',
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
    const result = await Conges_n_payant.findAndCountAll({
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
      message: "Liste des conges non payants",
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
 * Permet pour la suppressiuon d'un conge non payant sur la liste.
* @date  15/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Conges_n_payant.destroy({
      where: {
        ID_CONGE_N_PAYANT: {
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
 * Permet pour recuperer un conge non payant selon l'id
* @date  15/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const findOneconge_non_payant = async (req, res) => {
  try {
    const { ID_CONGE_N_PAYANT } = req.params
    const conge_non_payant = await Conges_n_payant.findOne({
      where: {
        ID_CONGE_N_PAYANT
      }
    })

    if (conge_non_payant) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Le congé non payant",
        result:conge_non_payant
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Le conge non payant non trouve",
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
  createconge_non_payant,
  findAll,
  deleteItems,
  findOneconge_non_payant,
  updateconge_non_payant
}
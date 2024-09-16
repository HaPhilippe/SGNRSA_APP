const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const Diplome = require("../../models/Diplome")

/**
 * fonction  Permet d' enregistrer un diplome.
 * @date  08/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const createDiplome = async (req, res) => {
  try {
    const {NOM_DIPLOME,DESCRIPTION_DIPLOME} = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      NOM_DIPLOME: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      DESCRIPTION_DIPLOME: {
        required: true,
        length: [1, 250],
        alpha: true
      }
    }, {
      NOM_DIPLOME: {
        required: "Ce champ est obligatoire",
        length: "Le diplome ne doit pas depasser max(50 caracteres)",
        alpha: "Le diplome est invalide"
      },
      DESCRIPTION_DIPLOME: {
        required: "Ce champ est obligatoire",
        length: "La description du diplome ne doit pas depasser max(250 caracteres)",
        alpha: "La description du diplome est invalide"
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

    const diplome = await Diplome.create({
      NOM_DIPLOME,DESCRIPTION_DIPLOME
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le diplome a bien ete cree avec succes",
      result: diplome
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
 * Permet de modifier l'enregistrement du diplome.
* @date  08/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const updateDiplome = async (req, res) => {

  try {
    const {ID_DIPLOME} = req.params;
    const {
      NOM_DIPLOME,DESCRIPTION_DIPLOME
    } = req.body

    const data = { ...req.body };
    const validation = new Validation(data, {
      NOM_DIPLOME: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      DESCRIPTION_DIPLOME: {
        required: true,
        length: [1, 250],
        alpha: true
      }
    }, {
      NOM_DIPLOME: {
        required: "Ce champ est obligatoire",
        length: "Le dipome ne doit pas depasser max(50 caracteres)",
        alpha: "Le diplome est invalide"
      },
      DESCRIPTION_DIPLOME: {
        required: "Ce champ est obligatoire",
        length: "La description du diplome ne doit pas depasser max(250 caracteres)",
        alpha: "La description du diplome est invalide"
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


    const diplome = await Diplome.update(
      {
        NOM_DIPLOME,DESCRIPTION_DIPLOME
      },
      {
        where: { ID_DIPLOME:ID_DIPLOME }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le diplome a modifie avec succes",
      result: diplome
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
 * Permet d'afficher tous les diplomes
 * @date  08/07/2024
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
      diplome: {
        as: "diplome",
        fields: {
          NOM_DIPLOME:'NOM_DIPLOME',
          DESCRIPTION_DIPLOME:'DESCRIPTION_DIPLOME',
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
      orderColumn = sortColumns.diplome.fields.DATE_INSERTION
      sortModel = {
        model: 'diplome',
        as: sortColumns.diplome.as
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
      'NOM_DIPLOME',
      'DESCRIPTION_DIPLOME',
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
    const result = await Diplome.findAndCountAll({
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
      message: "Liste des diplomes",
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
 * Permet pour la suppressiuon d'un diplome sur la liste.
* @date  08/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Diplome.destroy({
      where: {
        ID_DIPLOME: {
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
const findOneDiplome = async (req, res) => {
  try {
    const { ID_DIPLOME } = req.params
    const diplome = await Diplome.findOne({
      where: {
        ID_DIPLOME
      }
    })

    if (diplome) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Le diplome",
        result: diplome
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Le diplome non trouve",
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
  createDiplome,
  findAll,
  deleteItems,
  findOneDiplome,
  updateDiplome
}
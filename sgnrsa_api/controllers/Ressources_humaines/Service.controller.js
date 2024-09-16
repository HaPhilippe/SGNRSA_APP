const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const Service = require("../../models/Service")


/**
 * fonction  Permet de creer un service.
 * @date  08/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */


const createService = async (req, res) => {
  try {
    const {
      NOM_SERVICE,
      DESCRIPTION_SERVICE
    } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      NOM_SERVICE: {
        required: true,
        length: [1, 90],
        alpha: true
      },
      DESCRIPTION_SERVICE: {
        required: true,
        length: [1, 250],
        alpha: true
      }
    }, {
      NOM_SERVICE: {
        required: "Ce champ est obligatoire",
        length: "Le service ne doit pas depasser max(90 caracteres)",
        alpha: "Le service est invalide"
      },
      DESCRIPTION_SERVICE: {
        required: "Ce champ est obligatoire",
        length: "La description du service ne doit pas depasser max(250 caracteres)",
        alpha: "La description du service est invalide"
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

    const service = await Service.create({
      NOM_SERVICE,
      DESCRIPTION_SERVICE
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le service a bien ete cree avec succes",
      result: service
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
 * Permet de modifier le service.
* @date  08/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const updateService = async (req, res) => {

  try {
    const { ID_SERVICE } = req.params;
    const {
      NOM_SERVICE,
      DESCRIPTION_SERVICE
    } = req.body

    const data = { ...req.body };
    const validation = new Validation(data, {
      NOM_SERVICE: {
        required: true,
        length: [1, 90],
        alpha: true
      },
      DESCRIPTION_SERVICE: {
        required: true,
        length: [1, 250],
        alpha: true
      }
    }, {
      NOM_SERVICE: {
        required: "Ce champ est obligatoire",
        length: "Le service ne doit pas depasser max(90 caracteres)",
        alpha: "Le service est invalide"
      },
      DESCRIPTION_SERVICE: {
        required: "Ce champ est obligatoire",
        length: "La description du service ne doit pas depasser max(250 caracteres)",
        alpha: "La description du service est invalide"
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


    const service = await Service.update(
      {
        NOM_SERVICE,
        DESCRIPTION_SERVICE
      },
      {
        where: { ID_SERVICE: ID_SERVICE }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le service a modifie avec succes",
      result: service
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
 * Permet d'afficher tous les services
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
      service: {
        as: "service",
        fields: {
          NOM_SERVICE: 'NOM_SERVICE',
          DESCRIPTION_SERVICE: 'DESCRIPTION_SERVICE',
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
      orderColumn = sortColumns.service.fields.DATE_INSERTION
      sortModel = {
        model: 'service',
        as: sortColumns.service.as
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
      'NOM_SERVICE',
      'DESCRIPTION_SERVICE',
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
    const result = await Service.findAndCountAll({
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
      message: "Liste des services",
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
 * Permet pour la suppressiuon d'un service sur la liste.
* @date  08/07/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Service.destroy({
      where: {
        ID_SERVICE: {
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
const findOneService = async (req, res) => {
  try {
    const { ID_SERVICE } = req.params
    const service = await Service.findOne({
      where: {
        ID_SERVICE
      }
    })

    if (service) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Le service",
        result: service
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Le service non trouve",
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
  createService,
  findAll,
  deleteItems,
  findOneService,
  updateService
}
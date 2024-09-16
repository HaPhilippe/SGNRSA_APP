const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const Employeur = require("../../models/Employeur")
const Personne = require("../../models/Personne")

/**
 * fonction  Permet de creer un employeur
 * @date  25/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */


const createEmployeur = async (req, res) => {
  try {
    const { ID_PERS, NOM_EMPLOYEUR, NIF, RC } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      ID_PERS: {
        required: true,
        number: true,
        exists: "personne,ID_PERS"
      },
      NOM_EMPLOYEUR: {
        required: true,
        length: [1, 150],
        alpha: true
      },
      NIF: {
        required: true,
        length: [1, 20],
        alpha: true
      },
      RC: {
        required: true,
        length: [1, 20],
        alpha: true
      }
    }, {
      ID_PERS: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre vailde",
        exists: "la personne n'existe pas"
      },
      NOM_EMPLOYEUR: {
        required: "Ce champ est obligatoire",
        length: "Le nom de l'entreprise ne doit pas depasser max(150 caracteres)",
        alpha: "Le nom de l'entreprise est invalide"
      },
      NIF: {
        required: "Ce champ est obligatoire",
        length: "Le NIF ne doit pas depasser max(20 caracteres)",
        alpha: "Le NIF est invalide"
      },
      RC: {
        required: "Ce champ est obligatoire",
        length: "Le RC ne doit pas depasser max(20 caracteres)",
        alpha: "Le RC est invalide"
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

    const employeur = await Employeur.create({
      ID_PERS,
      NOM_EMPLOYEUR,
      NIF,
      RC
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'employeur a bien ete cree avec succes",
      result: employeur
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
 * Permet de modifier les employeurs
* @date  25/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const updateEmployeur = async (req, res) => {

  try {
    const { ID_EMPLOYEUR } = req.params;
    const { ID_PERS, NOM_EMPLOYEUR, NIF, RC } = req.body;

    const data = { ...req.body };
    const validation = new Validation(data, {
      ID_PERS: {
        required: true,
        number: true,
        exists: "personne,ID_PERS"
      },
      NOM_EMPLOYEUR: {
        required: true,
        length: [1, 150],
        alpha: true
      },
      NIF: {
        required: true,
        length: [1, 20],
        alpha: true
      },
      RC: {
        required: true,
        length: [1, 20],
        alpha: true
      }
    }, {
      ID_PERS: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre vailde",
        exists: "la personne n'existe pas"
      },
      NOM_EMPLOYEUR: {
        required: "Ce champ est obligatoire",
        length: "Le nom de l'entreprise ne doit pas depasser max(150 caracteres)",
        alpha: "Le nom de l'entreprise est invalide"
      },
      NIF: {
        required: "Ce champ est obligatoire",
        length: "Le NIF ne doit pas depasser max(20 caracteres)",
        alpha: "Le NIF est invalide"
      },
      RC: {
        required: "Ce champ est obligatoire",
        length: "Le RC ne doit pas depasser max(20 caracteres)",
        alpha: "Le RC est invalide"
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


    const employeur = await Employeur.update(
      {
        ID_PERS,
        NOM_EMPLOYEUR,
        NIF,
        RC
      },
      {
        where: { ID_EMPLOYEUR: ID_EMPLOYEUR }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'employeur a modifie avec succes",
      result: employeur
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
 * Permet de lister les personnes
* @date  25/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const personneliste = async (req, res) => {
  try {
    const personne = await Personne.findAll({
      attributes: ['ID_PERS', 'NOM', 'PRENOM', 'EMAIL', 'id_colline', 'TELEPHONE', 'CNI']
    })

    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Listes des personnes",
      result: personne
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
 * Permet d'afficher un employeur
 * @date  25/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const findAll = async (req, res) => {
  try {
    const {emloyeur, rows = 10, first = 0, sortField, sortOrder, search } = req.query
    const defaultSortField = "DATE_INSERTION"
    const defaultSortDirection = "DESC"
    const sortColumns = {
      employeur: {
        as: "employeur",
        fields: {
          NOM_EMPLOYEUR: 'NOM_EMPLOYEUR',
          NIF: 'NIF',
          RC: 'RC',
          DATE_INSERTION: 'employeur.DATE_INSERTION',

        }
      },
      personne: {
        as: "personne",
        fields: {
          NOM: 'NOM',
          PRENOM: 'PRENOM',
          EMAIL: 'EMAIL',
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
      orderColumn = sortColumns.employeur.fields.DATE_INSERTION
      sortModel = {
        model: 'employeur',
        as: sortColumns.employeur.as
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
      "NOM_EMPLOYEUR",
      "NIF",
      "RC",
      'DATE_INSERTION',
      '$employeur.NOM$',
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
    var emloyeurInfo={}

    if(emloyeur){
      emloyeurInfo={
        ID_EMPLOYEUR:emloyeur
      }
    }
    const result = await Employeur.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
        ...emloyeurInfo
      },
      include: {
        model: Personne,
        as: 'personne',
        required: false,
        attributes: ['ID_PERS', 'NOM', 'PRENOM', 'EMAIL', 'CNI']
      }
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des employeurs",
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
 * Permet pour la suppressiuon d'une employeur
 * @date  25/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Employeur.destroy({
      where: {
        ID_EMPLOYEUR: {
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
 * Permet pour recuperer une employeur selon l'id
 * @date  25/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const findOneEmployeur = async (req, res) => {
  try {
    const { ID_EMPLOYEUR } = req.params
    const employeur = await Employeur.findOne({
      where: {
        ID_EMPLOYEUR
      },
      include: {
        model: Personne,
        as: 'personne',
        required: false,
        attributes: ['ID_PERS', 'EMAIL']
      }
    })

    if (employeur) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "L'employeur",
        result: employeur
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "L'employeur non trouve",
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
  createEmployeur,
  findAll,
  deleteItems,
  findOneEmployeur,
  updateEmployeur,
  personneliste
}
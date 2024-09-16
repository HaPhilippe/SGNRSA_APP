const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const Departement = require("../../models/Departement")
const Employeur = require("../../models/Employeur")

/**
 * fonction  Permet de creer un departemnt
 * @date  26/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const createDepartement = async (req, res) => {
  try {
    const {
      NOM_DEPARTEMENT,
      DESCRIPTION,
      ID_EMPLOYEUR,
    } = req.body;

    const data = { ...req.body };
    const validation = new Validation(data, {

      NOM_DEPARTEMENT: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      DESCRIPTION: {
        required: true,
        length: [1, 250],
        alpha: true
      },
      ID_EMPLOYEUR: {
        required: true,
        number: true,
        exists: "employeur,ID_EMPLOYEUR"
      }
    }, {
      NOM_DEPARTEMENT: {
        required: "Ce champ est obligatoire",
        length: "Le nom du departement ne doit pas depasser max(40 caracteres)",
        alpha: "Le nom  du departement est invalide"
      },
      DESCRIPTION: {
        required: "Ce champ est obligatoire",
        length: "La description ne doit pas depasser max(250 caracteres)",
        alpha: "La description est invalide"
      },
      ID_EMPLOYEUR: {
        required: "Ce champ est obligatoire"
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

    const departement = await Departement.create({
      NOM_DEPARTEMENT,
      DESCRIPTION,
      ID_EMPLOYEUR,
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le departement a bien ete cree avec succes",
      result: departement
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
 * Permet pour la modification d'un departement
* @date  26/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const updateDepartement = async (req, res) => {

  try {
    const { ID_DEPARTEMENT } = req.params;
    const {
      NOM_DEPARTEMENT,
      DESCRIPTION,
      ID_EMPLOYEUR
    } = req.body;


    const data = { ...req.body };
    const validation = new Validation(data, {

      NOM_DEPARTEMENT: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      DESCRIPTION: {
        required: true,
        length: [1, 250],
        alpha: true
      },
      ID_EMPLOYEUR: {
        required: true,
        number: true,
        exists: "employeur,ID_EMPLOYEUR"
      },
    }, {

      NOM_DEPARTEMENT: {
        required: "Ce champ est obligatoire",
        length: "La designation du departement ne doit pas depasser max(50 caracteres)",
        alpha: "La designation du departement est invalide"
      },
      DESCRIPTION: {
        required: "Ce champ est obligatoire",
        length: "La description ne doit pas depasser max(250 caracteres)",
        alpha: "La description est invalide"
      },
      ID_EMPLOYEUR: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre vailde",
        exists: "L'employeur n'existe pas"
      },
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

    const departement = await Departement.update(
      {
        NOM_DEPARTEMENT,
        DESCRIPTION,
        ID_EMPLOYEUR
      },
      {
        where: { ID_DEPARTEMENT: ID_DEPARTEMENT }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le departement a modifie avec succes",
      result: departement
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
 * Permet d'afficher un departement
 * @date  26/06/2024
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
      departement: {
        as: "departement",
        fields: {
          ID_DEPARTEMENT: 'ID_DEPARTEMENT',
          NOM_DEPARTEMENT: 'NOM_DEPARTEMENT',
          DESCRIPTION: 'DESCRIPTION',
          ID_EMPLOYEUR:'ID_EMPLOYEUR',
          DATE_INSERTION: 'departement.DATE_INSERTION'
        }
      },
      employeur: {
        as: "employeur",
        fields: {
          NOM_EMPLOYEUR: 'NOM_EMPLOYEUR',
          NIF: 'NIF',
          DATE_INSERTION:'DATE_INSERTION'
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
      orderColumn = sortColumns.departement.fields.DATE_INSERTION
      sortModel = {
        model: 'departement',
        as: sortColumns.departement.as
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

      "NOM_DEPARTEMENT",
      "DESCRIPTION",
      "DATE_CREATION"
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
    const result = await Departement.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      },
      include: {
        model: Employeur,
        as: 'employeur',
        required: false,
        attributes: ['NOM_EMPLOYEUR', 'ID_PERS', 'NIF', 'RC', 'DATE_INSERTION']
      }


    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des departement",
      result: {
        data: result.rows,
        totalRecords: result.count
      }
    })
    console.log(res.status);
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
 * @author Philippe <hphilip@inoviatech.com>iyo ntambwe ndiko nsubizamo
 * 
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Departement.destroy({
      where: {
        ID_DEPARTEMENT: {
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
 * Permet pour recuperer un departement selon l'id
 * @date  26/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const findOneDepartement = async (req, res) => {
  try {
    const { ID_DEPARTEMENT } = req.params
    const departement = await Departement.findOne({
      where: {
        ID_DEPARTEMENT
      },
      include: [{
        model: Employeur,
        as: 'employeur',
        required: false,
        attributes: ['NOM_EMPLOYEUR', 'ID_PERS', 'NIF', 'RC', 'DATE_INSERTION']
      }
      ]
    })

    if (departement) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Le departement",
        result: departement
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Le departement non trouve",
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
  createDepartement,
  findAll,
  deleteItems,
  findOneDepartement,
  updateDepartement
}
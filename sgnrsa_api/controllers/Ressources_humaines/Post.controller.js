const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const Poste = require("../../models/Poste")
const Departement = require("../../models/Departement")


/**
 * fonction  Permet de creer un post
 * @date  24/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const createPost = async (req, res) => {
  try {
    const {
      INTITULE_POST,
      DESCRIPTION_POST,
      ID_DEPARTEMENT
    } = req.body

    const data = { ...req.body };
    const validation = new Validation(data, {
      INTITULE_POST: {
        required: true,
        length: [1, 30],
        alpha: true
      },
      DESCRIPTION_POST: {
        required: true,
        length: [1, 250],
        alpha: true
      },
      ID_DEPARTEMENT: {
        required: true,
        number: true
      },

    }, {
      INTITULE_POST: {
        required: "Ce champ est obligatoire",
        length: "L'intitule du post ne doit pas depasser max(30 caracteres)",
        alpha: "L'intitule du post est invalide"
      },
      DESCRIPTION_POST: {
        required: "Ce champ est obligatoire",
        length: "La description du post ne doit pas depasser max(250 caracteres)",
        alpha: "La description du post est invalide"
      },
      ID_DEPARTEMENT: {
        required: "Ce champ est obligatoire",
        number: "Ce champ est obligatoire un entier"
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

    const post = await Poste.create({
      INTITULE_POST,
      DESCRIPTION_POST,
      ID_DEPARTEMENT
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le  poste a bien ete cree avec succes",
      result: post
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
 * Permet la modification de la designation du post
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const updatePost = async (req, res) => {

  try {
    const { ID_POST } = req.params;
    const {
      INTITULE_POST,
      DESCRIPTION_POST,
      ID_DEPARTEMENT
    } = req.body

    const data = { ...req.body };
    const validation = new Validation(data, {
      INTITULE_POST: {
        required: true,
        length: [1, 30],
        alpha: true
      },
      DESCRIPTION_POST: {
        required: true,
        length: [1, 250],
        alpha: true,
        exists: 'departement,ID_DEPARTEMENT'
      },
      ID_DEPARTEMENT: {
        required: true,
        number: true,
        exists: "departement,ID_DEPARTEMENT"
      },
    },
      {
        INTITULE_POST: {
          required: "Ce champ est obligatoire",
          length: "L'intitule du post ne doit pas depasser max(30 caracteres)",
          alpha: "L'intitule du post est invalide"
        },
        DESCRIPTION_POST: {
          required: "Ce champ est obligatoire",
          length: "La description du post ne doit pas depasser max(250 caracteres)",
          alpha: "La description du post est invalide"
        },
        ID_DEPARTEMENT: {
          required: "Ce champ est obligatoire",
          number: "Ce champ est obligatoire un entier",
          exists: 'Le département existe'
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

    const post = await Poste.update(
      {
        INTITULE_POST,
        DESCRIPTION_POST,
        ID_DEPARTEMENT
      },
      {
        where: { ID_POST: ID_POST }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le poste a ete modifie avec succes",
      result: post
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
 * Permet d'afficher toutes la designation du post
 * @date  24/06/2024
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
      poste: {
        as: "poste",
        fields: {
          ID_POST: 'ID_POST',
          INTITULE_POST: 'INTITULE_POST',
          DESCRIPTION_POST: 'DESCRIPTION_POST',
          DATE_INSERTION: 'poste.DATE_INSERTION'
        }
      },
      departement: {
        as: 'departement',
        fields: {
          ID_DEPARTEMENT: 'ID_DEPARTEMENT',
          NOM_DEPARTEMENT: 'NOM_DEPARTEMENT',
          DESCRIPTION: 'DESCRIPTION',
          ID_EMPLOYEUR: 'ID_EMPLOYEUR',
          DATE_INSERTION: 'departement.DATE_INSERTION'
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
      orderColumn = sortColumns.poste.fields.DATE_INSERTION
      sortModel = {
        poste: 'poste',
        as: sortColumns.poste.as
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
      "INTITULE_POST",
      "DESCRIPTION_POST",
      "ID_DEPARTEMENT",
      "DATE_INSERTION"
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
    const result = await Poste.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      },
      include: {
        model: Departement,
        as: 'departement',
        required: false,
        attributes: [
          'ID_DEPARTEMENT',
          'NOM_DEPARTEMENT',
          'DESCRIPTION',
          'ID_EMPLOYEUR',
          'DATE_INSERTION'
        ],
      }
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des postes",
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
 * Permet pour la suppressiuon la post 
 * @date  24/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Poste.destroy({
      where: {
        ID_POST: {
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
 * Permet pour recuperer la post selon l'id
 * @date  24/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const findOnepost = async (req, res) => {
  try {
    const { ID_POST } = req.params
    const post = await Poste.findOne({
      where: {
        ID_POST
      },
      include: {
        model: Departement,
        as: 'departement',
        required: false,
        attributes: [
          'NOM_DEPARTEMENT',
          'DESCRIPTION',
          'ID_EMPLOYEUR',
          'DATE_INSERTION'
        ]
      }
    })
    if (post) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "La poste",
        result: post
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "La poste non trouve",
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
  createPost,
  findAll,
  deleteItems,
  findOnepost,
  updatePost
}

const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const md5 = require('md5')
const Tuteur = require("../../models/Tuteur")


/**
 * fonction  Permet de creer un tuteur
 * @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const createTuteur = async (req, res) => {
  try {
    const { NOM,PRENOM,EMAIL,TELEPHONE	} = req.body

    const data = { ...req.body};
    const validation = new Validation(data, {
      NOM: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      PRENOM: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      EMAIL: {
        required: true,
        length: [1, 100],
        alpha: true,
        email: true,
        unique: "tuteur,EMAIL",
      },
      TELEPHONE: {
        required: true,
        length: [1, 20],
        number: true,
        unique: "tuteur,TELEPHONE",
      },

    }, {
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom d'un tuteur ne doit pas depasser max(30 caracteres)",
        alpha: "Le nom d'un tuteur est invalide"
      },
      PRENOM: {
        required: "Ce champ est obligatoire",
        length: "Le prenom d'un tuteur ne doit pas depasser max(20 caracteres)",
        alpha: "Le prenom d'un tuteur est invalide"
      },
      EMAIL: {
        required: "Ce champ est obligatoire",
        length: "L'email ne doit pas depasser max(90 caracteres)",
        alpha: "L'email est invalide",
        email: "L'email n'existe pas",
        unique: "L'email doit etre unique",
      },
      TELEPHONE: {
        required: "Ce champ est obligatoire",
        length: "Le numero de telephone ne doit pas depasser max(15 chiffres)",
        number: "Le numero de telephone doit etre un nombre",
        unique: "Le numero de telephone doit etre unique",
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

  
    const tuteur = await Tuteur.create({
      NOM,
      PRENOM,
      EMAIL,
      TELEPHONE
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le tuteur a bien ete cree avec succes",
      result: tuteur
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
 * Permet pour la modification d'un tuteur
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const updateTuteur = async (req, res) => {

  try {
    const { ID_TUT } = req.params;
    const { NOM, PRENOM, EMAIL,TELEPHONE} = req.body;
   

    const data = { ...req.body};
    const validation = new Validation(data, {
      NOM: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      PRENOM: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      EMAIL: {
        required: true,
        length: [1, 100],
        alpha: true,
        email: true,
        unique: "tuteur,EMAIL",
      },
      TELEPHONE: {
        required: true,
        length: [1, 20],
        number: true,
        unique: "tuteur,TELEPHONE",
      },

    }, {
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom d'un tuteur ne doit pas depasser max(50 caracteres)",
        alpha: "Le nom d'un tuteur est invalide"
      },
      PRENOM: {
        required: "Ce champ est obligatoire",
        length: "Le prenom d'un tuteur ne doit pas depasser max(50 caracteres)",
        alpha: "Le prenom d'un tuteur est invalide"
      },
      EMAIL: {
        required: "Ce champ est obligatoire",
        length: "L'email ne doit pas depasser max(100 caracteres)",
        alpha: "L'email est invalide",
        email: "L'email n'existe pas",
        unique: "L'email doit etre unique",
      },
      TELEPHONE: {
        required: "Ce champ est obligatoire",
        length: "Le numero de telephone ne doit pas depasser max(15 chiffres)",
        number: "Le numero de telephone doit etre un nombre",
        unique: "Le numero de telephone doit etre unique",
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


    const tuteur = await Tuteur.update(
      {
        NOM,
        PRENOM,
        EMAIL,
        TELEPHONE
      },
      {
        where: { ID_TUT: ID_TUT }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L tuteur a modifie avec succes",
      result: tuteur
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
 * Permet d'afficher un tuteur
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findAll = async (req, res) => {
  try {
    const { rows = 10, first = 0, sortField, sortOrder, search } = req.query
    const defaultSortField = "DATE_INSERTION"
    const defaultSortDirection = "DESC"
    const sortColumns = {
      tuteur: {
        as: "tuteur",
        fields: {
          NOM: 'NOM',
          PRENOM: 'PRENOM',
          EMAIL: 'EMAIL',
          TELEPHONE: 'TELEPHONE',
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
      orderColumn = sortColumns.tuteur.fields.DATE_INSERTION
      sortModel = {
        model: 'tuteur',
        as: sortColumns.tuteur.as
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
      "NOM",
      'PRENOM',
      'EMAIL',
      'TELEPHONE',
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
    const result = await Tuteur.findAndCountAll({
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
      message: "Liste des tuteurs",
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
 * Permet pour la suppressiuon d'un tuteur
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Tuteur.destroy({
      where: {
        ID_TUT: {
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
 * Permet pour recuperer un tuteur selon l'id
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneTuteur = async (req, res) => {
  try {
    const { ID_TUT } = req.params
    const tuteur = await Tuteur.findOne({
      where: {
        ID_TUT
      }
    })
    if (tuteur) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Le tuteur",
        result: tuteur
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Le tuteur non trouve",
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
  createTuteur,
  findAll,
  deleteItems,
  findOneTuteur,
  updateTuteur
}
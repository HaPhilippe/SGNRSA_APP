const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const Employe = require("../../models/Employe")
const Personne = require("../../models/Personne")
const Diplome = require("../../models/Diplome")
const Service = require("../../models/Service")
const Poste = require("../../models/Poste")

/**
 * fonction  Permet de creer un employe
 * @date  08/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const createEmploye = async (req, res) => {
  try {
    const {
      ID_PERS,
      ID_POST,
      ID_DIPLOME,
      ID_SERVICE,
      NUMERO_MATRICULE
    } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      ID_PERS: {
        required: true,
        number: true,
        exists: "personne,ID_PERS"
      },
      ID_POST: {
        required: true,
        number: true,
        exists: "poste,ID_POST"
      },
      ID_DIPLOME: {
        required: true,
        number: true,
        exists: "diplome,ID_DIPLOME"
      },


      ID_SERVICE: {
        required: true,
        number: true,
        exists: "service,ID_SERVICE"
      },

      NUMERO_MATRICULE: {
        required: true,
        length: [1, 30],
        alpha: true
      }
    }, {
      ID_PERS: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre vailde",
        exists: "la personne n'existe pas"
      },
      ID_POST: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre vailde",
        exists: "le poste n'existe pas"
      },
      ID_DIPLOME: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre vailde",
        exists: "le diplome n'existe pas"
      },

      ID_SERVICE: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre vailde",
        exists: "le servicen'existe pas"
      },
      NUMERO_MATRICULE: {
        required: "Ce champ est obligatoire",
        length: "Le numéro matricule ne doit pas depasser max(30 caracteres)",
        alpha: "Le numéro matricule est invalide"
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

    const employe = await Employe.create({
      ID_PERS,
      ID_POST,
      ID_DIPLOME,
      ID_COMPETENCE,
      ID_SERVICE,
      NUMERO_MATRICULE
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'employe a bien ete cree avec succes",
      result: employe
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
 * Permet pour la modification d'un employe
* @date  26/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */

const updateEmploye = async (req, res) => {

  try {
    const { ID_EMPLOYE } = req.params;
    const {
      ID_PERS,
      ID_POST,
      ID_DIPLOME,
      ID_COMPETENCE,
      ID_SERVICE,
      NUMERO_MATRICULE
    } = req.body;
    const data = { ...req.body };
    const validation = new Validation(data, {
      ID_PERS: {
        required: true,
        number: true,
        exists: "personne,ID_PERS"
      },
      ID_POST: {
        required: true,
        number: true,
        exists: "poste,ID_POST"
      },
      ID_DIPLOME: {
        required: true,
        number: true,
        exists: "diplome,ID_DIPLOME"
      },


      ID_SERVICE: {
        required: true,
        number: true,
        exists: "service,ID_SERVICE"
      },

      NUMERO_MATRICULE: {
        required: true,
        length: [1, 30],
        alpha: true
      }
    }, {
      ID_PERS: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre vailde",
        exists: "la personne n'existe pas"
      },
      ID_POST: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre vailde",
        exists: "le poste n'existe pas"
      },
      ID_DIPLOME: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre vailde",
        exists: "le diplome n'existe pas"
      },

      ID_SERVICE: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre vailde",
        exists: "le servicen'existe pas"
      },
      NUMERO_MATRICULE: {
        required: "Ce champ est obligatoire",
        length: "Le numéro matricule ne doit pas depasser max(30 caracteres)",
        alpha: "Le numéro matricule est invalide"
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

    const employe = await Employe.update(
      {
        ID_PERS,
        ID_POST,
        ID_DIPLOME,
        ID_COMPETENCE,
        ID_SERVICE,
        NUMERO_MATRICULE
      },
      {
        where: { ID_EMPLOYE: ID_EMPLOYE }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'employé a modifie avec succes",
      result: employe
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
 * Permet d'afficher un employe
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
      employe: {
        as: "employe",
        fields: {
          ID_PERS: 'ID_PERS',
          NUMERO_MATRICULE: 'NUMERO_MATRICULE',
          DATE_INSERTION: 'employe.DATE_INSERTION'
        }
      },
      personne: {
        as: "personne",
        fields: {
          NOM: 'NOM',
          PRENOM: 'PRENOM',
          EMAIL: 'EMAIL',
        },
      },
      poste: {
        as: "poste",
        fields: {
          ID_POST: 'ID_POST',
          INTITULE_POST: 'INTITULE_POST',
          DESCRIPTION_POST: 'DESCRIPTION_POST',
          DATE_INSERTION: 'poste.DATE_INSERTION'
        }
      },
      diplome: {
        as: "diplome",
        fields: {
          NOM_DIPLOME: 'NOM_DIPLOME',
          DESCRIPTION_DIPLOME: 'DESCRIPTION_DIPLOME',
        }
      },

      service: {
        as: "service",
        fields: {
          NOM_SERVICE: 'NOM_SERVICE',
          DESCRIPTION_SERVICE: 'DESCRIPTION_SERVICE',
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
      orderColumn = sortColumns.employe.fields.DATE_INSERTION
      sortModel = {
        model: 'employe',
        as: sortColumns.employe.as
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

      'ID_PERS',
      'NUMERO_MATRICULE',
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
    const result = await Employe.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      },
      include:
        [
          {
            model: Personne,
            as: 'personne',
            required: false,
            attributes: [
              'ID_PERS',
              'NOM',
              'PRENOM',
              'EMAIL',
            ],
          },
          {
            model: Poste,
            as: 'poste',
            required: false
          },
          {
            model: Diplome,
            as: 'diplome',
            required: false
          },

          {
            model: Service,
            as: 'service',
            required: false
          },
        ]
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des employes",
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
 * Permet pour la suppressiuon d'une employe
 * @date  26/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Employe.destroy({
      where: {
        ID_EMPLOYE: {
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
 * Permet pour recuperer une employe selon l'id
 * @date  26/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const findOneEmploye = async (req, res) => {
  try {
    const { ID_EMPLOYE } = req.params
    const employe = await Employe.findOne({
      where: {
        ID_EMPLOYE
      },
      include:
        [
          {
            model: Personne,
            as: 'personne',
            required: false,
            attributes: [
              'ID_PERS',
              'NOM',
              'PRENOM',
              'EMAIL',
            ],
          },
          {
            model: Poste,
            as: 'poste',
            required: false
          },
          {
            model: Diplome,
            as: 'diplome',
            required: false
          },

          {
            model: Service,
            as: 'service',
            required: false
          },
        ]
    })

    if (employe) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "L'employe",
        result: employe
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "L'employe non trouve",
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
  createEmploye,
  findAll,
  deleteItems,
  findOneEmploye,
  updateEmploye
}
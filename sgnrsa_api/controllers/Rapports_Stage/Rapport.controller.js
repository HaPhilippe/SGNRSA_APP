
const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const Stage = require("../../models/Rapport")
const Etudiant = require("../../models/Etudiant")
const Encadrant = require("../../models/Encadrant")


/**
 * fonction  Permet de creer un Stage
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const createStage = async (req, res) => {

  try {
    const {
      ID_ETUD, ID_ENCA,  DATE_DEBUT, DATE_FIN, SUJET, RAPPORT, EVALUATION, COMMENTAIRE
    } = req.body;
    const data = { ...req.body };


    const validation = new Validation(data, {
      ID_ETUD: {
        required: true,
        number: true,
        exists: "etudiant,ID_ETUD"
      },
      ID_ENCA: {
        required: true,
        number: true,
        exists: "encandrant,ID_ENCA"
      },
     
      DATE_DEBUT: {
        required: true
      },
      DATE_FIN: {
        required: true
      },
      SUJET: {
        required: true,
        length: [1, 200],
        alpha: true
      },
      RAPPORT: {
        required: true,
        length: [1, 200],
        alpha: true
      },
      EVALUATION: {
        required: true,
        length: [1, 200],
        alpha: true
      },

      COMMENTAIRE: {
        required: true
      },

    }, {
      ID_ETUD: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre valide",
        exists: "l'etudiant n'existe pas"
      },
      ID_ENCA: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre valide",
        exists: "l'encadrant n'existe pas"
      },
    
      DATE_DEBUT: {
        required: "Ce champ est obligatoire"
      },
      DATE_FIN: {
        required: "Ce champ est obligatoire"
      },
      SUJET: {
        required: "Ce champ est obligatoire",
        length: "Le sujet ne doit pas depasser max(200 caracteres)",
        alpha: "Le sujet est invalide"
      },
      RAPPORT: {
        required: "Ce champ est obligatoire",
        length: "Le rapport ne doit pas depasser max(200 caracteres)",
        alpha: "Le rapport est invalide"
      },
      EVALUATION: {
        required: "Ce champ est obligatoire",
        length: "L'evaluation ne doit pas depasser max(200 caracteres)",
        alpha: "L'evaluation est invalide"
      },
      COMMENTAIRE: {
        required: "Ce champ est obligatoire"
      }
    });

    await validation.run();
    const isValid = await validation.isValidate();
    if (!isValid) {
      const errors = await validation.getErrors();
      // await transaction.rollback();
      return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
        message: "Problème de validation des données",
        result: errors
      });
    }

    const stage = await Stage.create({
      ID_ETUD, ID_ENCA,  DATE_DEBUT, DATE_FIN, SUJET, RAPPORT, EVALUATION, COMMENTAIRE
    });

    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le stage a bien été créée avec succès",
      result: stage
    });
  } catch (error) {
    console.log(error);

    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard"
    });
  }
};

/**
 * Permet de modifier un Stage
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const updateStage = async (req, res) => {

  try {
    const { ID_STAGE } = req.params;

    const {
      ID_ETUD, ID_ENCA, DATE_DEBUT, DATE_FIN, SUJET, RAPPORT, EVALUATION, COMMENTAIRE

    } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      ID_ETUD: {
        required: true,
        number: true,
        exists: "etudiant,ID_ETUD"
      },
      ID_ENCA: {
        required: true,
        number: true,
        exists: "encandrant,ID_ENCA"
      },
     
      DATE_DEBUT: {
        required: true
      },
      DATE_FIN: {
        required: true
      },
      SUJET: {
        required: true,
        length: [1, 200],
        alpha: true
      },
      RAPPORT: {
        required: true,
        length: [1, 200],
        alpha: true
      },
      EVALUATION: {
        required: true,
        length: [1, 200],
        alpha: true
      },

      COMMENTAIRE: {
        required: true
      },

    }, {
      ID_ETUD: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre valide",
        exists: "l'etudiant n'existe pas"
      },
      ID_ENCA: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre valide",
        exists: "l'encadrant n'existe pas"
      },
    
      DATE_DEBUT: {
        required: "Ce champ est obligatoire"
      },
      DATE_FIN: {
        required: "Ce champ est obligatoire"
      },
      SUJET: {
        required: "Ce champ est obligatoire",
        length: "Le sujet ne doit pas depasser max(200 caracteres)",
        alpha: "Le sujet est invalide"
      },
      RAPPORT: {
        required: "Ce champ est obligatoire",
        length: "Le rapport ne doit pas depasser max(200 caracteres)",
        alpha: "Le rapport est invalide"
      },
      EVALUATION: {
        required: "Ce champ est obligatoire",
        length: "L'evaluation ne doit pas depasser max(200 caracteres)",
        alpha: "L'evaluation est invalide"
      },
      COMMENTAIRE: {
        required: "Ce champ est obligatoire"
      }
    });


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

    const stage = await Stage.update(
      {
        ID_ETUD, ID_ENCA, DATE_DEBUT, DATE_FIN, SUJET, RAPPORT, EVALUATION, COMMENTAIRE
      },
      {
        where: { ID_STAGE: ID_STAGE }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le stage a été modifie avec succes",
      result: stage
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
 * Permet d'afficher un Stage
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
      stage: {
        as: "stage",
        fields: {
          ID_ETUD: 'ID_ETUD',
          ID_ENCA: 'ID_ENCA',
          ID_TUT: 'ID_TUT',
          DATE_DEBUT: 'DATE_DEBUT',
          DATE_FIN: 'DATE_FIN',
          SUJET: 'SUJET',
          RAPPORT: 'RAPPORT',
          EVALUATION: 'EVALUATION',
          COMMENTAIRE: 'COMMENTAIRE',
          DATE_INSERTION: 'DATE_INSERTION'
        }
      },
      etudiant: {
        as: "etudiant",
        fields: {
          ID_PERS: 'ID_PERS',
          ID_DEPARTEMENT: 'ID_DEPARTEMENT',
          // DATE_INSERTION: 'etudiant.DATE_INSERTION'
        }
      },
      encadrant: {
        as: "encadrant",
        fields: {
          ID_ENCA: 'ID_ENCA',
          ID_PERS: 'ID_PERS',
          TITRE: '	TITRE',
          ID_ENTREPRISE: 'ID_ENTREPRISE',
          // DATE_INSERTION: 'encadrant.DATE_INSERTION'
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
      orderColumn = sortColumns.stage.fields.SUJET
      sortModel = {
        model: 'stage',
        as: sortColumns.stage.as
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
    const result = await Stage.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      },
      include: [
        {
          model: Etudiant,
          as: 'etudiant',
          required: false,
          include: {
            model: Personne,
            as: 'personne',
            require: false
          }
        },
        {
          model: Encadrant,
          as: 'encadrant',
          required: false
        },
       

      ]
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des encadrants des conges",
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
 * Permet pour la suppressiuon d'un Stage
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Stage.destroy({
      where: {
        ID_STAGE: {
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
 * Permet pour recuperer un Stage selon l'id
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneStage = async (req, res) => {
  try {
    const { ID_STAGE } = req.params
    const stage = await Stage.findOne({
      where: {
        ID_STAGE
      },
      include: [{
        model: Etudiant,
        as: 'etudiant',
        required: false
      },
      {
        model: Encadrant,
        as: 'encadrant',
        required: false
      },
      {
        model: Tuteur,
        as: 'tuteur',
        required: false
      },

      ]

    })

    if (stage) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Le stage trouvé",
        result: stage
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Le stage non trouve",
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
  createStage,
  findAll,
  deleteItems,
  findOneStage,
  updateStage
}
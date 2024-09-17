
const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")

const Encadrant = require("../../models/Encadrant")

const Entreprise = require("../../models/Entreprise")

/**
 * fonction  Permet de creer un Encadrant
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const createEncadrant = async (req, res) => {

  try {
    const {
      	TITRE,ID_ENTREPRISE
    } = req.body;
    const data = { ...req.body };


    const validation = new Validation(data, {
   
      TITRE: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      ID_ENTREPRISE: {
        required: true,
        number: true,
        exists: "entreprise,ID_ENTREPRISE"
      },
     
    }, {
    
      TITRE:{
        required: "Ce champ est obligatoire",
        length: "Le titre ne doit pas depasser max(50 caracteres)",
        alpha: "Le titre est invalide"
      },
      ID_ENTREPRISE: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre valide",
        exists: "l'entreprise n'existe pas"
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

    const encadrant = await Encadrant.create({
      ID_PERS,TITRE,ID_ENTREPRISE
    });
   
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'encadrant a bien été créée avec succès",
      result: encadrant
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
 * Permet de modifier un encadrant
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const updateEncadrant = async (req, res) => {

  try {
    const {ID_ENCA } = req.params;

    const {
      ID_PERS,TITRE,ID_ENTREPRISE

    } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
   
      TITRE: {
        required: true,
        length: [1, 50],
        alpha: true
      },
      ID_ENTREPRISE: {
        required: true,
        number: true,
        exists: "entreprise,ID_ENTREPRISE"
      },
     
    }, {
     
      TITRE:{
        required: "Ce champ est obligatoire",
        length: "Le titre ne doit pas depasser max(50 caracteres)",
        alpha: "Le titre est invalide"
      },
      ID_ENTREPRISE: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre valide",
        exists: "l'entreprise n'existe pas"
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

    const encadrant = await Encadrant.update(
      {
       TITRE,ID_ENTREPRISE
      },
      {
        where: { ID_ENCA: ID_ENCA }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'encadrant a été modifie avec succes",
      result: encadrant
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
 * Permet d'afficher un Encadrant
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
      encadrant: {
        as: "encadrant",
        fields: {
          ID_ENCA: 'ID_ENCA',
          
          TITRE:'	TITRE',
          ID_ENTREPRISE:'ID_ENTREPRISE',
          DATE_INSERTION: 'encadrant.DATE_INSERTION'
        }
      },
      entreprise: {
        as: "entreprise",
        fields: {
          ID_ENTREPR: 'ID_ENTREPR',
          NOM_E: 'NOM_E',
          ADRESSE_E:'ADRESSE_E',
          SECTEUR:'SECTEUR',
          DATE_INSERTION: 'entreprise.DATE_INSERTION'
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
      orderColumn = sortColumns.encadrant.fields.DATE_INSERTION
      sortModel = {
        model: 'encadrant',
        as: sortColumns.encadrant.as
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
    const result = await Encadrant.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      },
      include: [{
        model:Entreprise,
        as:'entreprise',
        required:false
      }]
    })
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des etuiants des conges",
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
 * Permet pour la suppressiuon d'un Encadrant
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Encadrant.destroy({
      where: {
        ID_ENCA: {
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
 * Permet pour recuperer un Encadrant selon l'id
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneEncadrant = async (req, res) => {
  try {
    const { ID_ENCA } = req.params
    const encadrant = await Encadrant.findOne({
      where: {
        ID_ENCA
      },
      include: [
      {
        model: Entreprise,
        as: 'entreprise',
        required: false
      },

      ]
     
    })

    if (encadrant) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "L'encadrant trouvé",
        result: encadrant
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "L'encadrant non trouve",
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
  createEncadrant,
  findAll,
  deleteItems,
  findOneEncadrant,
  updateEncadrant
}

const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const Etudiant = require("../../models/Etudiant")

const Departement = require("../../models/Departement")
const Entreprise = require("../../models/Entreprise")

/**
 * fonction  Permet de creer un Entreprise
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const createEntreprise = async (req, res) => {

  try {
    const {
      NOM_E,
      ADRESSE_E,
      SECTEUR
    } = req.body;
    const data = { ...req.body };

    const validation = new Validation(data, {
      NOM_E: {
        required: true,
        alpha: true,
        length: [1, 100]
      },
      ADRESSE_E: {
        required: true,
        alpha: true,
        length: [1, 200]
      },
      SECTEUR: {
        required: true,
        alpha: true,
        length: [1, 50]
      }
    }, {
      NOM_E: {
        required: "Ce champ est obligatoire",
        length: "Le nom de l'entreprese ne doit pas depasser max(100 caracteres)",
        alpha: "Le nom de l'entreprese est invalide"
      },
      ADRESSE_E: {
        required: "Ce champ est obligatoire",
        length: "L'adresse ne doit pas depasser max(200 caracteres)",
        alpha: "L'addresse est invalide"
      },
      SECTEUR: {
        required: "Ce champ est obligatoire",
        length: "Le sectur ne doit pas depasser max(50 caracteres)",
        alpha: "Le scteur est invalide"
      }
    });

    await validation.run();
    const isValid = await validation.isValidate();
    if (!isValid) {
      const errors = await validation.getErrors();
      return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
        message: "Problème de validation des données",
        result: errors
      });
    }

    const entreprise = await Entreprise.create({
      NOM_E,
      ADRESSE_E,
      SECTEUR
    });

    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'entreprise a bien été créée avec succès",
      result: entreprise
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
 * Permet de modifier un Entreprise
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const updateEntreprise = async (req, res) => {

  try {
    const { ID_ENTREPR } = req.params;

    const {
      NOM_E,
      ADRESSE_E,
      SECTEUR

    } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      NOM_E: {
        required: true,
        alpha: true,
        length: [1, 100]
      },
      ADRESSE_E: {
        required: true,
        alpha: true,
        length: [1, 200]
      },
      SECTEUR: {
        required: true,
        alpha: true,
        length: [1, 50]
      }
    }, {
      NOM_E: {
        required: "Ce champ est obligatoire",
        length: "Le nom de l'entreprese ne doit pas depasser max(100 caracteres)",
        alpha: "Le nom de l'entreprese est invalide"
      },
      ADRESSE_E: {
        required: "Ce champ est obligatoire",
        length: "L'adresse ne doit pas depasser max(200 caracteres)",
        alpha: "L'addresse est invalide"
      },
      SECTEUR: {
        required: "Ce champ est obligatoire",
        length: "Le sectur ne doit pas depasser max(50 caracteres)",
        alpha: "Le scteur est invalide"
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

    const entreprise = await Entreprise.update(
      {
        NOM_E,
        ADRESSE_E,
        SECTEUR
      },
      {
        where: { ID_ENTREPR: ID_ENTREPR }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'entreprise a été modifie avec succes",
      result: entreprise
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
 * Permet d'afficher un Entreprise
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
      orderColumn = sortColumns.entreprise.fields.DATE_INSERTION
      sortModel = {
        model: 'entreprise',
        as: sortColumns.entreprise.as
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
    const result = await Entreprise.findAndCountAll({
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
      message: "Liste des entreprises couramment besions des stagiares",
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
 * Permet pour la suppressiuon d'un entreprise
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Entreprise.destroy({
      where: {
        ID_ENTREPR: {
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
 * Permet pour recuperer un Entreprise selon l'id
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneEntreprise = async (req, res) => {
  try {
    const { ID_ENTREPR } = req.params
    const entreprise = await Entreprise.findOne({
      where: {
        ID_ENTREPR
      }
    })

    if (entreprise) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "L'entreprise trouvé",
        result: entreprise
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "L'entreprise non trouve",
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
  createEntreprise,
  findAll,
  deleteItems,
  findOneEntreprise,
  updateEntreprise
}
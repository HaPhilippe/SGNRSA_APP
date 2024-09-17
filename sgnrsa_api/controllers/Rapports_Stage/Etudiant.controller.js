
const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const Etudiant = require("../../models/Etudiant")

const Departement = require("../../models/Departement")

/**
 * fonction  Permet de creer un Etudiant
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const createEtudiant = async (req, res) => {
  // let transaction;
  try {
    const {
      ID_DEPARTEMENT
    } = req.body;
    const data = { ...req.body };


    // Début de la transaction
    // transaction = await sequelize.transaction();

    const validation = new Validation(data, {
   
      ID_DEPARTEMENT: {
        required: true,
        number: true,
        exists: "personne,ID_PERS"
      },
      RAISON_DEMANDE: {
        required: true,
        length: [1, 250],
        alpha: true
      }
    }, {
      
      ID_DEPARTEMENT: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre valide",
        exists: "le département n'existe pas"
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

    const etudia = await Etudiant.create({
      ID_DEPARTEMENT
    });
    // , { transaction }
    // Mise à jour de la table "soldeconges"
    // const soldeConge = await Solde_conge.findOne({

    //   where: {
    //     ID_EMPLOYE
    //   }
    // }, { transaction });
    // const jrs_restInit = 25
    // if (!soldeConge) {
    //   await Solde_conge.create(
    //     {
    //       ID_EMPLOYE,
    //       CONGES_CONSOMMES: parseInt(NB_JOURS),
    //       JOUR_RESTANT_CONGE: jrs_restInit - parseInt(NB_JOURS)
    //     },
    //     { transaction }
    //   );
    // } else if (parseInt(NB_JOURS) >= soldeConge.JOUR_RESTANT_CONGE) {
    //   return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
    //     statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
    //     httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
    //     message: "Congés terminés"
    //   });
    // } else {
    //   await Solde_conge.update(

    //     {
    //       CONGES_CONSOMMES: soldeConge.CONGES_CONSOMMES + parseInt(NB_JOURS),
    //       JOUR_RESTANT_CONGE: soldeConge.TOTALITE_CONGES - soldeConge.CONGES_CONSOMMES - parseInt(NB_JOURS)
    //     }, {
    //     where: {

    //       ID_EMPLOYE
    //     },
    //     transaction
    //   }
    //   );
    // }

    // await transaction.commit();
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'etudiant a bien été créée avec succès",
      result: etudia
    });
  } catch (error) {
    console.log(error);
    // if (transaction) {
    //   await transaction.rollback();
    // }
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard"
    });
  }
};

/**
 * Permet de modifier un Etudiant
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const updateEtudiant = async (req, res) => {

  try {
    const { ID_ETUD } = req.params;

    const {
  
      ID_DEPARTEMENT

    } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
   
      ID_DEPARTEMENT: {
        required: true,
        number: true,
        exists: "personne,ID_PERS"
      },
      RAISON_DEMANDE: {
        required: true,
        length: [1, 250],
        alpha: true
      }
    }, {
    
      ID_DEPARTEMENT: {
        required: "Ce champ est obligatoire",
        number: "Ce champ  doit avoir  un nombre valide",
        exists: "le département n'existe pas"
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

    const etudia = await Etudiant.update(
      {
    
        ID_DEPARTEMENT
      },
      {
        where: { ID_ETUD: ID_ETUD }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'etuiant a été modifie avec succes",
      result: etudia
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
 * Permet d'afficher un etudiant
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
      etudiant: {
        as: "etudiant",
        fields: {
          ID_PERS: 'ID_PERS',
          ID_DEPARTEMENT: 'ID_DEPARTEMENT',
          DATE_INSERTION: 'etudiant.DATE_INSERTION'
        }
      },
      
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
      orderColumn = sortColumns.etudiant.fields.DATE_INSERTION
      sortModel = {
        model: 'etudiant',
        as: sortColumns.etudiant.as
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
    const result = await Etudiant.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [
        [sortModel, orderColumn, orderDirection]
      ],
      where: {
        ...globalSearchWhereLike,
      },
      
  
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
 * Permet pour la suppressiuon d'un etudiant
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Etudiant.destroy({
      where: {
        ID_ETUD: {
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
 * Permet pour recuperer un etudiant selon l'id
* @date  07/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneEtudiant = async (req, res) => {
  try {
    const { ID_ETUD } = req.params
    const etudia = await Etudiant.findOne({
      where: {
        ID_ETUD
      },
      include: [
      {
        model: Departement,
        as: 'departement',
        required: false
      },

      ]
     
    })

    if (etudia) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "L'etudiant trouvé",
        result: etudia
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "L'etudiant non trouve",
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
  createEtudiant,
  findAll,
  deleteItems,
  findOneEtudiant,
  updateEtudiant
}
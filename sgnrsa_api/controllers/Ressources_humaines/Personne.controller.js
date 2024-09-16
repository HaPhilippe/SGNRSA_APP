const express = require("express")
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Validation = require("../../class/Validation")
const { Op } = require("sequelize")
const md5 = require('md5')
const IMAGES_DESTINATIONS = require("../../constants/IMAGES_DESTINATIONS")
const PersonneUpload = require("../../class/uploads/PersonneUpload")

const Personne = require("../../models/Personne")

/**
 * fonction  Permet de creer une personne
 * @date  25/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const createPersonne = async (req, res) => {
  try {
    const { NOM, PRENOM, EMAIL, ADRESS, TELEPHONE, CNI} = req.body
    const files = req.files || {};
    const {IMAGE} = files;

    const data = { ...req.body, ...req.files };
    const validation = new Validation(data, {
      NOM: {
        required: true,
        length: [1, 30],
        alpha: true
      },
      PRENOM: {
        required: true,
        length: [1, 20],
        alpha: true
      },
      EMAIL: {
        required: true,
        length: [1, 90],
        alpha: true,
        email: true,
        unique: "personne,EMAIL",
      },
      ADRESS: {
        required: true,
        length:[1,100],
        alpha:true
      },
      TELEPHONE: {
        required: true,
        length: [1, 15],
        number: true,
        unique: "personne,TELEPHONE",
      },

      CNI: {
        required: true,
        length: [1, 30],
        alpha: true
      },
      IMAGE: {
        required: true,
        image: 4000000
      }
    }, {
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom d'une personne ne doit pas depasser max(30 caracteres)",
        alpha: "Le nom d'une personne est invalide"
      },
      PRENOM: {
        required: "Ce champ est obligatoire",
        length: "Le prenom d'une personne ne doit pas depasser max(20 caracteres)",
        alpha: "Le prenom d'une personne est invalide"
      },
      EMAIL: {
        required: "Ce champ est obligatoire",
        length: "L'email ne doit pas depasser max(90 caracteres)",
        alpha: "L'email est invalide",
        email: "L'email n'existe pas",
        unique: "L'email doit etre unique",
      },
      ADRESS: {
        required: "Ce champ est obligatoire",
        length:"L'adress ne doit pas dépasser max(100 caracteres)",
        alpha:"L'adress est validé"
      },
      TELEPHONE: {
        required: "Ce champ est obligatoire",
        length: "Le numero de telephone ne doit pas depasser max(15 chiffres)",
        number: "Le numero de telephone doit etre un nombre",
        unique: "Le numero de telephone doit etre unique",
      },
      
      CNI: {
        required: "Ce champ est obligatoire",
        length: "La carte d'identité personnel ne doit etre depasser max(15 carateres)",
        alpha: "La carte d'identité personnel  est invalide"
      },
      IMAGE: {
        required: "Ce champ est obligatoire",
        image: "L'image ne doit pas depasser 4Mo "
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

    const persUpload = new PersonneUpload();
    const { fileInfo } = await persUpload.upload(IMAGE, false);
    const persimage = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.personne
      }/${fileInfo.fileName}`;


    const personne = await Personne.create({
      NOM,
      PRENOM,
      EMAIL,
      ADRESS,
      CNI,
      TELEPHONE,
      IMAGE: persimage
    })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "La personne a bien ete cree avec succes",
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
 * Permet pour la modification d'une personne
* @date  25/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const updatePerson = async (req, res) => {

  try {
    const { ID_PERS } = req.params;
    const { NOM, PRENOM, EMAIL, ADRESS, TELEPHONE, CNI} = req.body;
    const files = req.files || {};
    const { IMAGE } = files;
    const persObject = await Personne.findByPk(ID_PERS, {
      attributes: ["IMAGE", "ID_PERS"],
    });
    const person = persObject.toJSON().IMAGE;


    const data = { ...req.body, ...req.files };
    const validation = new Validation(data, {
      NOM: {
        required: true,
        length: [1, 30],
        alpha: true
      },
      PRENOM: {
        required: true,
        length: [1, 20],
        alpha: true
      },
      EMAIL: {
        required: true,
        length: [1, 90],
        alpha: true,
        email: true,
        unique: "personne,EMAIL",
      },
      ADRESS: {
        required: true,
        length:[1,100],
        alpha:true
      },
      TELEPHONE: {
        required: true,
        length: [1, 15],
        number: true,
        unique: "personne,TELEPHONE",
      },

      CNI: {
        required: true,
        length: [1, 30],
        alpha: true
      },
      IMAGE: {
        required: true,
        image: 4000000
      }
    }, {
      NOM: {
        required: "Ce champ est obligatoire",
        length: "Le nom d'une personne ne doit pas depasser max(30 caracteres)",
        alpha: "Le nom d'une personne est invalide"
      },
      PRENOM: {
        required: "Ce champ est obligatoire",
        length: "Le prenom d'une personne ne doit pas depasser max(20 caracteres)",
        alpha: "Le prenom d'une personne est invalide"
      },
      EMAIL: {
        required: "Ce champ est obligatoire",
        length: "L'email ne doit pas depasser max(90 caracteres)",
        alpha: "L'email est invalide",
        email: "L'email n'existe pas",
        unique: "L'email doit etre unique",
      },
      ADRESS: {
        required: "Ce champ est obligatoire",
        length:"L'adress ne doit pas dépasser max(100 caracteres)",
        alpha:"L'adress est validé"
      },
      TELEPHONE: {
        required: "Ce champ est obligatoire",
        length: "Le numero de telephone ne doit pas depasser max(15 chiffres)",
        number: "Le numero de telephone doit etre un nombre",
        unique: "Le numero de telephone doit etre unique",
      },
     
      CNI: {
        required: "Ce champ est obligatoire",
        length: "La carte d'identité personnel ne doit etre depasser max(15 carateres)",
        alpha: "La carte d'identité personnel  est invalide"
      },
      IMAGE: {
        required: "Ce champ est obligatoire",
        image: "L'image ne doit pas depasser 4Mo "
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

    var persImge
    if (IMAGE) {
      const perssUpload = new PersonneUpload();
      const { fileInfo } = await perssUpload.upload(IMAGE, false);
      persImge = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.personne}/${fileInfo.fileName}`;
    }

    const pers = await Personne.update(
      {
        NOM,
        PRENOM,
        EMAIL,
        ADRESS,
        CNI,
        TELEPHONE,
        IMAGE: persImge ? persImge : pers.IMAGE,
      },
      {
        where: { ID_PERS: ID_PERS }
      })
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "La personne a modifie avec succes",
      result: pers
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
 * Permet d'afficher une personne
 * @date  25/06/2024
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
      personne: {
        as: "personne",
        fields: {
          NOM: 'NOM',
          PRENOM: 'PRENOM',
          EMAIL: 'EMAIL',
          ADRESS: 'ADRESS',
          TELEPHONE: 'TELEPHONE',
          CNI: 'CNI',
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
      orderColumn = sortColumns.personne.fields.DATE_INSERTION
      sortModel = {
        model: 'personne',
        as: sortColumns.personne.as
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
      'ADRESS',
      'TELEPHONE',
      'CNI',
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
    const result = await Personne.findAndCountAll({
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
      message: "Liste des personnes",
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
 * Permet pour la suppressiuon d'une personne
 * @date  25/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Personne.destroy({
      where: {
        ID_PERS: {
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
 * Permet pour recuperer une personne selon l'id
 * @date  25/06/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author Philippe <hphilip@inoviatech.com>
 */
const findOnePersonne = async (req, res) => {
  try {
    const { ID_PERS } = req.params
    const personne = await Personne.findOne({
      where: {
        ID_PERS
      }
    })
    if (personne) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "La personne",
        result: personne
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "La personne non trouve",
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
  createPersonne,
  findAll,
  deleteItems,
  findOnePersonne,
  updatePerson
}
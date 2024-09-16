const express = require("express")
const RESPONSE_CODES = require("../../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../../constants/RESPONSE_STATUS")
const Validation = require("../../../class/Validation")
const { Op } = require("sequelize")
const Profil = require("../../../models/Profil")
const Roles = require("../../../models/Roles")
const Profil_roles = require("../../../models/Profil_roles")



/**
 * Permet de creer un profil
 * @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const createProfil = async (req, res) => {
  try {
    const { DESCRIPTION, roles } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      DESCRIPTION: {
        required: true,
        length: [1, 50],
        alpha: true
      }

    }, {
      DESCRIPTION: {
        required: "Ce champ est obligatoire",
        length: "La description ne doit pas depasser max(50 caracteres)",
        alpha: "La description est invalide"
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
    const profile = await Profil.create({
      DESCRIPTION
    })

    const allrole = JSON.parse(roles)

    const roleData = allrole.map(reponse => {
      return {
        ID_PROFIL: profile.ID_PROFIL,
        ID_ROLE: reponse.ID_ROLE,
        CAN_READ: reponse.CAN_READ,
        CAN_WRITE: reponse.CAN_WRITE
      }
    })

    await Profil_roles.bulkCreate(roleData)
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Profil a ete cree avec succes",
      // result: user
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
* Modifier un profil via son id
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const updateProfil = async (req, res) => {

  try {
    const { ID_PROFIL } = req.params;
    const { DESCRIPTION, roles } = req.body
    const data = { ...req.body };
    const validation = new Validation(data, {
      DESCRIPTION: {
        required: true,
        length: [1, 50],
        alpha: true
      }

    }, {
      DESCRIPTION: {
        required: "Ce champ est obligatoire",
        length: "La description ne doit pas depasser max(50 caracteres)",
        alpha: "La description est invalide"
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

    const profiledit = await Profil.update({
      DESCRIPTION
    }, {
      where: { ID_PROFIL: ID_PROFIL }
    })
    const allrole = JSON.parse(roles)
    await Profil_roles.destroy({
      where: { ID_PROFIL: ID_PROFIL }
    })
    const roleData = allrole.map(reponse => {
      return {
        ID_PROFIL: ID_PROFIL,
        ID_ROLE: reponse.ID_ROLE,
        CAN_READ: reponse.CAN_READ,
        CAN_WRITE: reponse.CAN_WRITE
      }
    })

    await Profil_roles.bulkCreate(roleData)

    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "Le profile a modifie avec succes",
      // result: profiledit
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
* Permet d'afficher le profil
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findAll = async (req, res) => {
  try {
    const { rows = 10, first = 0, sortField, sortOrder, search } = req.query

    const defaultSortField = "ID_PROFIL"
    const defaultSortDirection = "ASC"
    const sortColumns = {
      profil: {
        as: "profil",
        fields: {
          ID_PROFIL: "ID_PROFIL",
          DESCRIPTION: 'DESCRIPTION',
        }
      },
      profil_roles: {
        as: "profil_roles",
        fields: {
          ID_PROFIL_ROLE: "ID_PROFIL_ROLE",
          CAN_READ: "CAN_READ",
          CAN_WRITE: "CAN_WRITE",
          ID_ROLE: "ID_ROLE",
          DATE_INSERTION: "DATE_INSERTION"
        }
      },
      roles: {
        as: "role",
        fields: {
          ID_ROLE: "ID_ROLE",
          ROLE: "ROLE",
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
      orderColumn = sortColumns.profil.fields.ID_PROFIL
      sortModel = {
        model: 'profil',
        as: sortColumns.profil.as
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
      "ID_PROFIL",
      'DESCRIPTION',
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
    const result = await Profil.findAndCountAll({
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
      message: "Liste des profils",
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
 * Permet de supprimer le profile selon l'id
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body
    const itemsIds = JSON.parse(ids)
    await Profil.destroy({
      where: {
        ID_PROFIL: {
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
 * Permet pour recuperer un profile selon l'id
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findOneprofile = async (req, res) => {
  try {
    const { ID_PROFIL } = req.params
    const utilisateur = await Profil.findOne({
      where: {
        ID_PROFIL
      },
      include: [
        {
          model: Profil_roles,
          as: "profil_roles",
          required: false,
          attributes: ["ID_PROFIL_ROLE", "ID_ROLE", "CAN_READ", "CAN_WRITE"],
          order: [["ID_ROLE", "ASC"]],
          include: [{
            model: Roles,
            as: "role",
            required: false,
            attributes: ["ID_ROLE", "ROLE"],
          }],
        },
      ],
      order: [
        [{ model: Profil_roles, as: "profil_roles" }, "ID_ROLE", "ASC"]
      ]
    })
    if (utilisateur) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Profil",
        result: utilisateur
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "Profil non trouvé",
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

/**
 * Permet de trouver les roles
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */

const findAllrole = async (req, res) => {
  try {
    const allroles = await Roles.findAll({
      attributes: ["ID_ROLE", "ROLE", "DATE_INSERTION"],
      order: [["ID_ROLE", "ASC"]]
    })

    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      result: allroles
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
 * Permet de recuperer les droits de l'utilisateur
* @date  06/08/2024
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @author hph <philippehatangimana.29dg@gmail.com>
 */
const findRoleByIdProfile = async (req, res) => {
  try {
    const { ID_PROFIL } = req.params
    const profilId = await Profil_roles.findAll({
      attributes: ["ID_PROFIL_ROLE", "ID_ROLE", "CAN_READ", "CAN_WRITE"],
      order: [["ID_ROLE", "ASC"]],
      include: [{
        model: Roles,
        as: "role",
        required: false,
        attributes: ["ID_ROLE", "ROLE"]
      }
      ],
      where: {
        ID_PROFIL
      }
    })
    if (profilId) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "profile trouvee",
        result: profilId
      })
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "profile non trouve",
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
  createProfil,
  findAll,
  deleteItems,
  findOneprofile,
  updateProfil,
  findAllrole,
  findRoleByIdProfile
}
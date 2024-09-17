const express = require('express')

const etudian_routes = require('./etudiant.routes')
const entreprise_routes = require('./entreprise.routes')
const encadrant_routes = require('./encadrant.routes')
const stage_routes = require('./rapports.routes')
const faculte_routes = require('./faculte.router')
const departement_routes = require('./departement.routes')

const rapports_StageRouter = express.Router()
rapports_StageRouter.use('/faculte',faculte_routes),
rapports_StageRouter.use('/departement', departement_routes),
rapports_StageRouter.use('/etudiant',etudian_routes),
rapports_StageRouter.use('/entreprise',entreprise_routes),
rapports_StageRouter.use('/encadrant',encadrant_routes),
rapports_StageRouter.use('/rapport',stage_routes)

module.exports = rapports_StageRouter

const express = require('express')
const post_routes = require('./tuteur.routes')
const personne_routes = require('./personne.routes')
const employeur_routes = require('./employeur.routes')
const departement_routes = require('./departement.routes')
const employe_routes = require('./employe.routes')
const service_routes = require('./service.routes')
const etudian_routes = require('./etudiant.routes')
const entreprise_routes = require('./entreprise.routes')
const encadrant_routes = require('./encadrant.routes')
const tuteur_routes = require('./tuteur.routes')
const stage_routes = require('./stage.routes')

const ressouresHumainesRouter = express.Router()
ressouresHumainesRouter.use('/poste', post_routes),
ressouresHumainesRouter.use('/personne', personne_routes),
ressouresHumainesRouter.use('/employeur', employeur_routes),
ressouresHumainesRouter.use('/departement', departement_routes),
ressouresHumainesRouter.use('/employe', employe_routes),
ressouresHumainesRouter.use('/service', service_routes),
ressouresHumainesRouter.use('/etudiant',etudian_routes),
ressouresHumainesRouter.use('/entreprise',entreprise_routes),
ressouresHumainesRouter.use('/encadrant',encadrant_routes),
ressouresHumainesRouter.use('/tuteur',tuteur_routes)
ressouresHumainesRouter.use('/stage',stage_routes)
module.exports = ressouresHumainesRouter
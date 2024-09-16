const express = require('express')
const utilisateurs_controller=require('../../controllers/administration/utilisateurs/utilisateurs.controller')
const utiliteurs_routes = express.Router()
utiliteurs_routes.post("/create", utilisateurs_controller.createUser)
utiliteurs_routes.get("/fetch", utilisateurs_controller.findAll)
utiliteurs_routes.get("/find/:ID_UTILISATEUR", utilisateurs_controller.findOneUtilisateur)
utiliteurs_routes.post("/detele_utilisateurs", utilisateurs_controller.deleteItems)
utiliteurs_routes.put("/update/:ID_UTILISATEUR", utilisateurs_controller.updateUtil)
utiliteurs_routes.get("/profile", utilisateurs_controller.profileliste)
utiliteurs_routes.put("/change_statuts/:ID_UTILISATEUR", utilisateurs_controller.change_status)

module.exports = utiliteurs_routes;
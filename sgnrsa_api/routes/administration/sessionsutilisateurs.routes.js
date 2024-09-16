const express = require('express')
const sessionsutilisateurs_controller=require('../../controllers/administration/sessions_utilisateurs/sessions_utilisateurs.controllers')
const sessionsutilisaturs_routes = express.Router()
sessionsutilisaturs_routes.get("/fetchallsession", sessionsutilisateurs_controller.findAllsessionutilisateurs)
sessionsutilisaturs_routes.get("/fetchallusers", sessionsutilisateurs_controller.utilisateurall)
sessionsutilisaturs_routes.post("/deleteusers", sessionsutilisateurs_controller.deleteItems)
sessionsutilisaturs_routes.put("/change_statuts/:ID_UTILISATEUR_TOKEN", sessionsutilisateurs_controller.change_status)

module.exports = sessionsutilisaturs_routes
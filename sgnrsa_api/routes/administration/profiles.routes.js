const express = require('express')
const profiles_controller=require('../../controllers/administration/profil/profil.controller')
const profile_routes = express.Router()
profile_routes.post("/create", profiles_controller.createProfil)
profile_routes.get("/fetch", profiles_controller.findAll)
profile_routes.get("/find/:ID_PROFIL", profiles_controller.findOneprofile)
profile_routes.post("/detele_profile", profiles_controller.deleteItems)
profile_routes.put("/update/:ID_PROFIL", profiles_controller.updateProfil)


profile_routes.get("/findrole", profiles_controller.findAllrole)

profile_routes.get("/profile_role/:ID_PROFIL", profiles_controller.findRoleByIdProfile)

module.exports = profile_routes

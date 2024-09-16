const express = require('express')
const entreprise_controller=require('../../controllers/Ressources_humaines/Entreprise.controller');
const entreprise_routes = express.Router()

entreprise_routes.post("/create",entreprise_controller.createEntreprise);
entreprise_routes.get("/fetchentreprise",entreprise_controller.findAll);
entreprise_routes.get("/find/:ID_ENTREPR",entreprise_controller.findOneEntreprise);
entreprise_routes.post("/detele", entreprise_controller.deleteItems);
entreprise_routes.put("/update/:ID_ENTREPR", entreprise_controller.updateEntreprise);
module.exports = entreprise_routes

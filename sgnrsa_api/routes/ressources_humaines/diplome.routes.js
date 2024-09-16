const express = require('express')
const diplome_controller=require('../../controllers/Ressources_humaines/Diplome.controller');
const diplome_routes = express.Router()

diplome_routes.post("/create",diplome_controller.createDiplome);
diplome_routes.get("/fetchdiplome",diplome_controller.findAll);
diplome_routes.get("/find/:ID_DIPLOME",diplome_controller.findOneDiplome);
diplome_routes.post("/detele", diplome_controller.deleteItems);
diplome_routes.put("/update/:ID_DIPLOME", diplome_controller.updateDiplome);

module.exports = diplome_routes 

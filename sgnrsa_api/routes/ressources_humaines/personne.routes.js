const express = require('express')
const personne_controller=require('../../controllers/Ressources_humaines/Personne.controller');
const personne_routes = express.Router()

personne_routes.post("/create",personne_controller.createPersonne);
personne_routes.get("/fetchpersonne",personne_controller.findAll);
personne_routes.get("/find/:ID_PERS",personne_controller.findOnePersonne);
personne_routes.post("/detele", personne_controller.deleteItems);
personne_routes.put("/update/:ID_PERS", personne_controller.updatePerson);

module.exports = personne_routes 


const express = require('express')
const employeur_controller=require('../../controllers/Ressources_humaines/Employeur.controller');
const employeur_routes = express.Router()

employeur_routes.post("/create",employeur_controller.createEmployeur);
employeur_routes.get("/fetchemployeur",employeur_controller.findAll);
employeur_routes.get("/find/:ID_EMPLOYEUR",employeur_controller.findOneEmployeur);
employeur_routes.post("/detele", employeur_controller.deleteItems);
employeur_routes.put("/update/:ID_EMPLOYEUR", employeur_controller.updateEmployeur);
employeur_routes.get("/personneliste",employeur_controller.personneliste);

module.exports = employeur_routes 


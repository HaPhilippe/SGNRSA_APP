const express = require('express')
const departement_controller=require('../../controllers/Ressources_humaines/Departement.controller');
const departement_routes = express.Router()

departement_routes.post("/create",departement_controller.createDepartement);
departement_routes.get("/fetchdeparte",departement_controller.findAll);
departement_routes.get("/find/:ID_DEPARTEMENT",departement_controller.findOneDepartement);
departement_routes.post("/detele", departement_controller.deleteItems);
departement_routes.put("/update/:ID_DEPARTEMENT", departement_controller.updateDepartement)
module.exports = departement_routes 


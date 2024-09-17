const express = require('express')
const etudian_controller=require('../../controllers/Rapports_Stage/Etudiant.controller');
const etudian_routes = express.Router()

etudian_routes.post("/create",etudian_controller.createEtudiant);
etudian_routes.get("/fetchetudiant",etudian_controller.findAll);
etudian_routes.get("/find/:ID_ETUD",etudian_controller.findOneEtudiant);
etudian_routes.post("/detele", etudian_controller.deleteItems);
etudian_routes.put("/update/:ID_ETUD", etudian_controller.updateEtudiant);
module.exports = etudian_routes 

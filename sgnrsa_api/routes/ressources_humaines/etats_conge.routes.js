const express = require('express')
const etats_conge_controller=require('../../controllers/Ressources_humaines/Etats_conge.controller');
const etat_conge_routes = express.Router()

etat_conge_routes.post("/create",etats_conge_controller.createEtats_conge);
etat_conge_routes.get("/fetchEtatConge",etats_conge_controller.findAll);
etat_conge_routes.get("/find/:ID_ETAT_CONGE",etats_conge_controller.findOneEtats_conge);
etat_conge_routes.post("/detele", etats_conge_controller.deleteItems);
etat_conge_routes.put("/update/:ID_ETAT_CONGE", etats_conge_controller.updateEtats_conge);

module.exports = etat_conge_routes 

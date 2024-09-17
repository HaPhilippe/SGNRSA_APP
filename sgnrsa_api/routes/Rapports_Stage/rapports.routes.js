const express = require('express')
const Rapport_controller=require('../../controllers/Rapports_Stage/Rapport.controller');
const rapport_routes = express.Router()

rapport_routes.post("/create",Rapport_controller.createStage);
rapport_routes.get("/fetchstage",Rapport_controller.findAll);
rapport_routes.get("/find/:ID_STAGE",Rapport_controller.findOneStage);
rapport_routes.post("/detele", Rapport_controller.deleteItems);
rapport_routes.put("/update/:ID_STAGE", Rapport_controller.updateStage);
module.exports = rapport_routes 

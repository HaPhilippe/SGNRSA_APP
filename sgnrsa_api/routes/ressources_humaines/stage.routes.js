const express = require('express')
const stage_controller=require('../../controllers/Ressources_humaines/Stage.controller');
const stage_routes = express.Router()

stage_routes.post("/create",stage_controller.createStage);
stage_routes.get("/fetchstage",stage_controller.findAll);
stage_routes.get("/find/:ID_STAGE",stage_controller.findOneStage);
stage_routes.post("/detele", stage_controller.deleteItems);
stage_routes.put("/update/:ID_STAGE", stage_controller.updateStage);
module.exports = stage_routes 

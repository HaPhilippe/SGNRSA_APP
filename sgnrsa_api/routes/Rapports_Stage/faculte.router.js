const express = require('express')
const faculte_controller=require('../../controllers/Rapports_Stage/Faculte.controller');
const faculte_routes = express.Router()

faculte_routes.post("/create",faculte_controller.createFaculte);
faculte_routes.get("/fetch",faculte_controller.findAll);
faculte_routes.get("/find/:ID_ETUD",faculte_controller.findOneFaculte);
faculte_routes.post("/detele", faculte_controller.deleteItems);
faculte_routes.put("/update/:ID_ETUD", faculte_controller.updateFaculte);
module.exports = faculte_routes

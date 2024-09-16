const express = require('express')
const employe_controller=require('../../controllers/Ressources_humaines/Employe.controller');
const employe_routes = express.Router()

employe_routes.post("/create",employe_controller.createEmploye);
employe_routes.get("/fetchemploye",employe_controller.findAll);
employe_routes.get("/find/:ID_EMPLOYE",employe_controller.findOneEmploye);
employe_routes.post("/detele", employe_controller.deleteItems);
employe_routes.put("/update/:ID_EMPLOYE", employe_controller.updateEmploye)
module.exports = employe_routes 
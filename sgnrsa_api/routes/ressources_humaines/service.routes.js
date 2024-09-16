const express = require('express')
const service_controller=require('../../controllers/Ressources_humaines/Service.controller');
const service_routes = express.Router()

service_routes.post("/create",service_controller.createService);
service_routes.get("/fetchservice",service_controller.findAll);
service_routes.get("/find/:ID_SERVICE",service_controller.findOneService);
service_routes.post("/detele", service_controller.deleteItems);
service_routes.put("/update/:ID_SERVICE", service_controller.updateService);

module.exports = service_routes 

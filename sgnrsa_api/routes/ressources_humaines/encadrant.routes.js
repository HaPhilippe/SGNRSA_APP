const express = require('express')
const encadrant_controller=require('../../controllers/Ressources_humaines/Encadrant.controller');
const encadrant_routes = express.Router()

encadrant_routes.post("/create",encadrant_controller.createEncadrant);
encadrant_routes.get("/fetchencadrant",encadrant_controller.findAll);
encadrant_routes.get("/find/:ID_ENCA",encadrant_controller.findOneEncadrant);
encadrant_routes.post("/detele", encadrant_controller.deleteItems);
encadrant_routes.put("/update/:ID_ENCA", encadrant_controller.updateEncadrant);
module.exports = encadrant_routes 

const express = require('express')
const tuteur_controller=require('../../controllers/Ressources_humaines/Tuteur.controle');
const tuteur_routes = express.Router()

tuteur_routes.post("/create",tuteur_controller.createTuteur);
tuteur_routes.get("/fetchtuteur",tuteur_controller.findAll);
tuteur_routes.get("/find/:ID_TUT",tuteur_controller.findOneTuteur);
tuteur_routes.post("/detele", tuteur_controller.deleteItems);
tuteur_routes.put("/update/:ID_TUT", tuteur_controller.updateTuteur);

module.exports = tuteur_routes 


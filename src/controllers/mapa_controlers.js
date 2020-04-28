
//Creamos un objeto controlador
const mapaCtrl = {};
const Punto = require('../models/Punto');
const path = require('path');

//Funcion para renderizar el mapa
mapaCtrl.renderMapa = (req, res) => {

    let puntos = Punto.find(function(err, puntos) {
        if (err) return console.error(err);
        return puntos;
      });


    res.render('mapas/mapa',{port: req.client.localPort});
};

//Metodo que recupera los datos solicitados de la BBDD
mapaCtrl.todosPuntos = (req, res) => {

    let puntos = Punto.find(function(err, puntos) {
        if (err) return console.error(err);
        return res.json(puntos);
      });    
};

module.exports = mapaCtrl;
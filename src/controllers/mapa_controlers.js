
//Creamos un objeto controlador
const mapaCtrl = {};
const Punto = require('../models/Punto');
const passport = require('passport');

let usuarioActual="";


//Funcion para renderizar el mapa
mapaCtrl.renderMapa = (req, res) => {
    usuarioActual= req.user.name;
    let puntos = Punto.find(function(err, puntos) {
        if (err) return console.error(err);
        return puntos;
      });
    
    res.render('mapas/mapa');
};

//Metodo que recupera todos los marcadores de la BBDD
mapaCtrl.todosPuntos = (req, res) => {
   
    let puntos = Punto.find(function(err, puntos) {
        if (err) return console.error(err);
        return res.json(puntos);
      });
};

//Filtrado por parametros en marcadores de la BBDD
mapaCtrl.misUbicaciones = (req, res) => {
 
  let puntos = Punto.find({autor: usuarioActual},function(err, puntos) {
      if (err) return console.error(err);
      //console.log(req.query.user); //Revisar parametros pasados por GET
      
      return res.json(puntos);
    });    
};

//Nueva ubicación BBDD
mapaCtrl.renderNuevo = (req, res) => {
  console.log('Nuevo');
  
  res.render('mapas/nuevo');
   
};






module.exports = mapaCtrl;
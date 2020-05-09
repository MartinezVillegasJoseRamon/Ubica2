
//Creamos un objeto controlador
const mapaCtrl = {};
const Punto = require('../models/Punto');
const passport = require('passport');
const Jimp = require('jimp');   //Paquete para edicion de imagenes, resize, B/W, etc


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
  res.render('mapas/nuevo');
};

// //Subir imagen
mapaCtrl.upload = (req, res) =>{

 if(!req.files || Object.keys(req.files).length === 0){
   return res.status(400).send('No existe imagen para subir')
 }
let archivoSubido = req.files.imagen; //Recuperamos el archivo enviado en el body
let ruta = 'src/public/img/';
let nombreArchivo = 'tmp.jpg';
let rutaAbsoluta= ruta + nombreArchivo;

  archivoSubido.mv(rutaAbsoluta, function(err) {
    if (err)
      return res.status(500).send(err);
    return res.status(200);
  });





  //EDICION CON JIMP-------------------


  // Jimp.read(imagenSubida)
  // .then(image => {
  //   return image
  //     .resize(256, 256) // resize
  //     .quality(60) // set JPEG quality
  //     .write('peq.jpg'); // save
  // })
  // .catch(err => {
  //   console.error(err);
  // });

};


module.exports = mapaCtrl;
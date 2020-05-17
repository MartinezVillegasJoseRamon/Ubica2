
//Creamos un objeto controlador
const mapaCtrl = {};
const Punto = require('../models/Punto');
const Jimp = require('jimp');   //Paquete para edicion de imagenes, resize, B/W, etc

let usuarioActual = "";

//Funcion para renderizar el mapa
mapaCtrl.renderMapa = (req, res) => {
  usuarioActual = req.user.name;
  let puntos = Punto.find(function (err, puntos) {
    if (err) return console.error(err);
    return puntos;
  });

  res.render('mapas/mapa');
};

//Metodo que recupera todos los marcadores de la BBDD
mapaCtrl.todosPuntos = (req, res) => {
  let tipo = req.query.tipo;
  //Si hemos recibido un tipo, filtramos los puntos con ese tipo
  if (tipo && tipo !== 'todas') {
    let puntos = Punto.find({ tipo_fotografia: tipo }, function (err, puntos) {
      if (err) return console.error(err);
      return res.json({ puntos, usuarioActual });
    });
  } else {
    //Si no hay seleccionado un tipo, buscamos todos los puntos
    let puntos = Punto.find(function (err, puntos) {
      if (err) return console.error(err);
      return res.json({ puntos, usuarioActual });
    });
  }

};

//Filtrado por parametros en marcadores de la BBDD
mapaCtrl.misUbicaciones = (req, res) => {

  let puntos = Punto.find({ autor: usuarioActual }, function (err, puntos) {
    if (err) return err;

    return res.json({ puntos, usuarioActual });
  });
};

//Nueva ubicación BBDD
mapaCtrl.renderNuevo = (req, res) => {
  res.render('mapas/nuevo');
};

// //Subir imagen
mapaCtrl.upload = async (req, res) => {
  //Almacenamos los datos recibidos
  const {
    autor,
    tipo_fotografia,
    titulo,
    direccion,
    acceso,
    fecha_foto,
    latitud,
    longitud
  } = req.body;

  //Validamos los datos recibidos
  let errores = [];
  if (latitud < -90 || latitud > 90) {
    errores.push('Latitud fuera de rango. Los valores deben estár comprendidos entre -90 y +90');
  };
  if (longitud < -180 || longitud > 180) {
    errores.push('Longitud fuera de rango. Los valores deben estár comprendidos entre -180 y +180');
  };
  if (!tipo_fotografia) {
    errores.push('No se ha indicado el tipo de fotografia');
  };
  if (!titulo) {
    errores.push('No se ha indicado el titulo');
  };
  if (!autor) {
    errores.push('No se ha indicado el autor');
  };
  if (!acceso) {
    errores.push('No se ha indicado el acceso a la ubicación');
  };

  //Si no hay errores, guardamos la ubicación en BBDD
  if (!errores.length) {
    //Tratamos los datos recibidos------------------------------------------------
    try {
      const nuevaUbicacion = Punto({
        autor,
        tipo_fotografia,
        titulo,
        direccion,
        acceso,
        fecha_foto,
        coordenadas: [latitud, longitud],
        visitas: 0
      });
      const puntoGuardado = await nuevaUbicacion.save();
      res.render('mapas/mapa');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

  } else {  //En caso de existir errores, los devolvemos
    res.status(500).json({ message: errores});
  }
};


module.exports = mapaCtrl;

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




    // if (!req.files || Object.keys(req.files).length === 0) {
  //   return res.status(400).send('No existe imagen para subir')
  // }
  // let archivoSubido = req.files.imagen; //Recuperamos el archivo enviado en el body
  // let ruta = 'src/public/img/';
  // let nombreArchivo = 'tmp.jpg';
  // let rutaAbsoluta = ruta + nombreArchivo;

  // return archivoSubido.mv(rutaAbsoluta, function (err) {
  //   if (err) {
  //     return res.sendStatus(500).send(err);
  //   }
  //   // Renderizamos de nuevo la vista. Podríamos pasar información a ésta
  //   // si en el segundo parámetro añadimos un objeto para "rellenar la vista". También
  //   // podemos redirigir a la vista que queramos con 'res.redirect('xxxx'), por ejemplo, 
  //   // 'return res.redirect('/mapas/mapa/nuevo'). Esta acción también redibuja la vista.
  //   // Más info: https://www.sitepoint.com/forms-file-uploads-security-node-express/
  //   //return res.render('mapas/nuevo');
  //   return res.sendStatus(200);
  // });

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
    longitud,
  } = req.body;
  
  //Almacenamos la imagen
  const {
    imagen
  } = req.files;

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

  //Procesamos la imagen
  let rutaAbsoluta; //Nombre final de la imagen que guardaremos en storage
  let nombreArchivo;
  if (!imagen) {
    errores.push('No existe imagen para subir');
  } else {
    let archivoSubido = imagen;
    let ruta = 'src/storage/';
    let moment= Date.now();
    nombreArchivo = moment + titulo + '.jpg'; 
    rutaAbsoluta = ruta + nombreArchivo;
    archivoSubido.mv(rutaAbsoluta, function (err) {
      if (err) {
        errores.push(err);
      }
    })
  };


  //Si no hay errores, guardamos la ubicación en BBDD
  if (!errores.length) {
    //Tratamos los datos recibidos
    try {
      const nuevaUbicacion = Punto({
        autor,
        tipo_fotografia,
        titulo,
        direccion,
        acceso,
        fecha_foto,
        coordenadas: [latitud, longitud],
        imagen: nombreArchivo,
        visitas: 0
      });

      const puntoGuardado = await nuevaUbicacion.save();
      res.status(200).json({ message: 'ok' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

  } else {  //En caso de existir errores, los devolvemos
    res.status(500).json({ message: errores });
  }
};

mapaCtrl.getImage = (req, res) => {
  let img = req.params.name;
  res.sendFile('/storage/'+ img, {root: 'src'});
};

module.exports = mapaCtrl;
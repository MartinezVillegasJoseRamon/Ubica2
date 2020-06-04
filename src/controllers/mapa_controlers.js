
//Creamos un objeto controlador
const mapaCtrl = {};
const Punto = require('../models/Punto');
const fs = require('fs');

let usuarioActual = "";
let errores = [];

//Funcion para renderizar el mapa al iniciar sesion
mapaCtrl.renderMapa = (req, res) => {

  usuarioActual = req.user.name;
  let puntos = Punto.find(function (err, puntos) {
    if (err) return console.error(err);
    return puntos;
  });
  res.render('mapas/mapa');
};

//Metodo que recupera todos los marcadores de la BBDD y si existe un filtro, solo los filtrados
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

//Muestra las ubicaciones del usuario actual
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

//Validación y guardado de imagen
function validaImagen(imagen, titulo) {
  let rutaAbsoluta; //Nombre final de la imagen que guardaremos en storage
  let nombreArchivo;
  //Tamaño máximo permitido de archivos 3Mb
  const tamMaximo = 3000000;

  //Validamos que existe imagen y no supera el tamaño maximo permitido
  if (!imagen || imagen.size > tamMaximo) {
    errores.push('No existe imagen para subir o su tamaño es incorrecto');
  } else {
    let archivoSubido = imagen;
    let ruta = 'src/storage/';
    let moment = Date.now();
    nombreArchivo = moment + titulo + '.jpg';
    rutaAbsoluta = ruta + nombreArchivo;
    archivoSubido.mv(rutaAbsoluta, function (err) {
      if (err) {
        errores.push(err);
      }
    })
    return [nombreArchivo, rutaAbsoluta];
  };
}

//Validadión y guardado de datos de nuevo suministro
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

  //En caso de validar la imagen, nos retorna un array con el nombre del archivo y la ruta absoluta en BBDD
  const archivoGuardado = validaImagen(imagen, titulo);
  let nombreArchivo = archivoGuardado[0];
  let rutaArchivo = archivoGuardado[1];

  //Validamos los datos recibidos

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
        rutaImagen: rutaArchivo,
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



//Obtenemos la imagen guardada en la carpeta de imagenes y con el nombre recibido por parametros
mapaCtrl.getImage = (req, res) => {
  let img = req.params.name;
  res.sendFile('/storage/' + img, { root: 'src' });
};

//Renderizamos la vista para ver el detalle de una ubicación
mapaCtrl.verDetalle = (req, res) => {
  let id = req.params.id;
  res.render('mapas/detalle', { normal: true, id });
};

//Renderizamos la vista para editar de una ubicación
mapaCtrl.editarUbicacion = (req, res) => {
  let id = req.params.id;
  res.render('mapas/detalle', { edit: true, id });
};

//Renderizamos la vista para eliminar de una ubicación
mapaCtrl.eliminarUbicacion = (req, res) => {
  let id = req.params.id;
  res.render('mapas/detalle', { delete: true, id });
};

mapaCtrl.actualizarEnBBDD = async (req, res) => {
    //Almacenamos los datos recibidos
  let id = req.params.id;
  const {
    titulo_foto,
    tipo_fotografia,
    titulo,
    direccion,
    acceso,
    fecha_foto,
    latitud,
    longitud,
  } = req.body;

  //Almacenamos la imagen
  let imagen = req.files;

  //En caso de validar la imagen, nos retorna un array con el nombre del archivo y la ruta absoluta en BBDD
  if (imagen) {
      const archivoGuardado = validaImagen(imagen, titulo);
    let nombreArchivo = archivoGuardado[0];
    let rutaArchivo = archivoGuardado[1];
  }

  //Validamos los datos recibidos
  if (latitud < -90 || latitud > 90) {
    errores.push('Latitud fuera de rango. Los valores deben estár comprendidos entre -90 y +90');
  };
  if (longitud < -180 || longitud > 180) {
    errores.push('Longitud fuera de rango. Los valores deben estár comprendidos entre -180 y +180');
  };
  if (!tipo_fotografia) {
    errores.push('No se ha indicado el tipo de fotografia');
  };
  if (!titulo_foto) {
    errores.push('No se ha indicado el titulo');
  };
  if (!acceso) {
    errores.push('No se ha indicado el acceso a la ubicación');
  };

  //Si no hay errores, guardamos la ubicación en BBDD
  if (!errores.length) {
    //Tratamos los datos recibidos
    try {
      const actualizaUbicacion = Punto({
        tipo_fotografia,
        titulo_foto,
        direccion,
        acceso,
        fecha_foto,
        coordenadas: [latitud, longitud],
        imagen: nombreArchivo,
        rutaImagen: rutaArchivo,
        visitas: 0
      });
      const puntoActualizado = await Punto.findOneAndUpdate({ _id: id }, { titulo_foto, fecha_foto, tipo_fotografia, direccion, acceso, coordenadas, rutaImagen });

      res.status(200).json({ message: 'ok' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

  } else {  //En caso de existir errores, los devolvemos
    res.status(500).json({ message: errores });
  }
};







mapaCtrl.eliminarEnBBDD = (req, res) => {
  let id = req.params.id;
  Punto.findOneAndDelete({ _id: id }, function (err, resultado) {
    if (err) return console.error(err);

    //Eliminamos del servidor la imagen asociada a la ubicación
    //recuperando la ruta de la imagen
    let ruta = resultado.rutaImagen;
    fs.unlink(ruta, function (err, ok) {
      if (err) return console.error(err);
      res.send(resultado);
    })
  });
};


//Recupera de la BBDD todos los datos del elemento identificado por su _id
mapaCtrl.datosDetalle = (req, res) => {
  let id = req.params.id;
  Punto.find({ _id: id }, function (err, puntos) {
    if (err) return console.error(err);
    return res.json(puntos);
  })
};


module.exports = mapaCtrl;
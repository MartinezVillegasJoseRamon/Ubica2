
//Creamos un objeto controlador
const mapaCtrl = {};

//Requerimos los modulos a utilizar
const Punto = require('../models/Punto');
const fs = require('fs');
const nodemailer = require('nodemailer');

//Variables globales
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

//Funcion para renderizar la vista del formulario de contacto
mapaCtrl.contacto = (req, res) => {
  res.render('contacto');
}

//Función que procesa los datos enviados por el formulario de contacto
//y envia el correo al administrador
mapaCtrl.envioEmail = async (req, res) => {
  //Destructuramos los datos recibidos en el body
  const { nombre, email, mensaje } = req.body;  

  //Creamos un falso envío de correo a traves de un servidor
  //de correo ficticio para desarrollo https://ethereal.email/
  const transporter = nodemailer.createTransport({

    //Una vez puesto en producción utilizaremos las credenciales de una cuenta real
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'mason.kirlin@ethereal.email',
      pass: 'aW9pTSVJ36U3ScACeJ'
    }
  });
  const mailOptions = {
    from: nombre,   //Nombre del remitente
    to: 'jorama01@gmail.com', //Destinatario del correo
    subject: email,   //email del remitente
    text: mensaje     //Mensaje
  }
  //Creamos el envío y renderizamos la vista de correo enviado
  const info = await transporter.sendMail(mailOptions);
  res.render('./emailEnviado');
}

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

//Renderiza la vista de detalle para Nueva ubicación
mapaCtrl.renderNuevo = (req, res) => {
  res.render('mapas/nuevo');
};

//Validadión y guardado de datos de nuevo suministro
mapaCtrl.upload = async (req, res) => {
  let nombreArchivo;
  let rutaArchivo;
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

  //Llamamos a la funcion validaImagen que nos devuelve una promesa
  try {
    const respuesta = await validaImagen(imagen, titulo);
    nombreArchivo = respuesta[0];
    rutaArchivo = respuesta[1];
  } catch (err) {
    errores.push(err);
  };

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
//Pasamos por parametros un objeto con el modo de edición y el id de la ubicación
mapaCtrl.verDetalle = (req, res) => {
  let id = req.params.id;
  res.render('mapas/detalle', { normal: true, id });
};

//Renderizamos la vista para editar en el detalle de una ubicación
//Pasamos por parametros un objeto con el modo de edición y el id de la ubicación
mapaCtrl.editarUbicacion = (req, res) => {
  let id = req.params.id;
  res.render('mapas/detalle', { edit: true, id });
};

//Renderizamos la vista para eliminar en el detalle de una ubicación
//Pasamos por parametros un objeto con el modo de edición y el id de la ubicación
mapaCtrl.eliminarUbicacion = (req, res) => {
  let id = req.params.id;
  res.render('mapas/detalle', { delete: true, id });
};

mapaCtrl.actualizarEnBBDD = async (req, res) => {
  //Almacenamos los datos recibidos en variables
  let id = req.params.id;
  let imagen;
  let nombreArchivo;
  let rutaArchivo;

  //Definimos las variables del objeto recibidos en el body de la petición
  const {
    titulo,
    tipo_fotografia,
    direccion,
    acceso,
    fecha_foto,
    latitud,
    longitud
  } = req.body;

  //Almacenamos la imagen si a cambiado
  if (req.files) {
    imagen = req.files.imagen;
    //Llamamos a la funcion validaImagen que nos devuelve una promesa
    //con la ruta y el nombre del archivo guardado en BBDD
    try {
      const respuesta = await validaImagen(imagen, titulo);
      nombreArchivo = respuesta[0];
      rutaArchivo = respuesta[1];
    } catch (err) {
      errores.push(err);
    }
  } else {
    //Si no hemos actualizado el archivo, mantenemos los datos que hay en BBDD
    const old = await Punto.findById(id);
    nombreArchivo = old.imagen;
    rutaArchivo = old.rutaImagen;
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
  if (!titulo) {
    errores.push('No se ha indicado el titulo');
  };
  if (!acceso) {
    errores.push('No se ha indicado el acceso a la ubicación');
  };

  //Si no hay errores, guardamos la ubicación en BBDD
  if (!errores.length) {
    //Tratamos los datos recibidos
    let coordenadas = [latitud, longitud];
    //Almacenamos la referencia a la antigua imagen
    const oldImage = await Punto.findById(id);
      //Eliminamos la imagen antigua si ha cambiado
      if(rutaArchivo != oldImage.rutaImagen){
        let ruta = oldImage.rutaImagen;
        fs.unlink(ruta, function (errDevuelto, ok) {
          if (errDevuelto) console.log(errDevuelto);
        })
      }
    //Actualizamos la Ubicación con los nuevos datos
    const puntoActualizado = await Punto.findOneAndUpdate({ _id: id },
      {
        tipo_fotografia,
        titulo,
        direccion,
        acceso,
        fecha_foto,
        latitud,
        longitud,
        imagen: nombreArchivo,
        rutaImagen: rutaArchivo
      }, function (err, resultado) {
        if (err) res.status(500).json({ message: error.message });
        
        res.status(200).json({ message: 'ok' });
      })
  }else {  //En caso de existir errores, los devolvemos al cliente
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

//Validación y guardado de imagen, se le pasa por parametros la imagen recibida y el titulo
function validaImagen(imagen, titulo) {
  let rutaAbsoluta; //Nombre final de la imagen que guardaremos en storage
  let nombreArchivo;
  //Tamaño máximo permitido de archivos 3Mb
  const tamMaximo = 3000000;
  //Definimos la promesa
  return new Promise(function (res, rej) {
    //Validamos que existe imagen y no supera el tamaño maximo permitido
    //Si da error devolvemos un reject con el mensaje de error
    if (!imagen || imagen.size > tamMaximo) {
      rej('No existe imagen para subir o su tamaño es incorrecto');
      return;
    }
    else {
      let archivoSubido = imagen;
      let ruta = 'src/storage/';
      //Para que no se dupliquen los nombres de archivo, utilizamos como nombre la fecha actual
      //en milisegundos desde el 01/01/1970
      let moment = Date.now();
      titulo = titulo.replace(/[^a-zA-Z0-9]/g, '');
      nombreArchivo = moment + '_' + titulo + '.jpg';
      rutaAbsoluta = ruta + nombreArchivo;
      archivoSubido.mv(rutaAbsoluta, function (err, file) {
        if (err) {
          return rej(err);
        }
        return res([nombreArchivo, rutaAbsoluta]);
      });
    }

  })  //Final definición promesa
} //Fin función

module.exports = mapaCtrl;
//Requerimos solo el modulo Router de express para el direccionamiento de rutas
const {Router} = require('express');
const router = Router();

//Requerimos las funciones que van a ejecutar la distintas rutas
const {renderMapa, todosPuntos, misUbicaciones, renderNuevo, upload, getImage, verDetalle, 
    datosDetalle, editarUbicacion, eliminarUbicacion, actualizarEnBBDD, eliminarEnBBDD, contacto, envioEmail} = require('../controllers/mapa_controlers');

//Requerimos la funcion creada para verificar si hay un usuario autenticado
//Nos sirve para proteger todas las rutas y que nadie pueda acceder a ninguna de ellas 
//sin estar autenticado
const {isAuthenticated} = require('../helpers/auth');

//---------------------MAPA--------------
//Ruta de la pagina inicial y funcion que ejecutará para renderizar el mapa
router.get('/mapas/mapa', isAuthenticated, renderMapa);

// Endpoint que consulta todos los marcadores de la BBDD
router.get('/mapas/mapa/datos', isAuthenticated, todosPuntos);

// Endpoint que consulta todos los marcadores del autor actual de la BBDD
router.get('/mapas/misubicaciones', isAuthenticated, misUbicaciones);


//---------------------NUEVO--------------
// Endpoint añadir nuevo punto a BBDD
router.get('/mapas/mapa/nuevo', isAuthenticated, renderNuevo);

// Endpoint subir datos a BBDD
router.post('/mapas/upload', isAuthenticated, upload);


//---------------------EDITAR--------------
// Endpoint que renderiza el detalle para editar una ubicación
router.get('/mapas/edit/:id', isAuthenticated, editarUbicacion);

// Endpoint que actualiza los datos de la ubicación editada la BBDD
//pasado por parametros
router.put('/mapas/actualizar/:id', isAuthenticated, actualizarEnBBDD);


//---------------------ELIMINAR--------------
// Endpoint que renderiza el detalle para eliminar una ubicación
router.get('/mapas/delete/:id', isAuthenticated, eliminarUbicacion);

// Endpoint que elimina la ubicación de la BBDD
router.delete('/mapas/eliminar/:id', isAuthenticated, eliminarEnBBDD);


// Endpoint obtener imagen pasando nombre archivo
router.get('/mapas/img/:name', isAuthenticated, getImage);


//---------------------VER DETALLE--------------
// Endpoint ver renderizar la vista detalle
router.get('/mapas/detalle/:id', isAuthenticated, verDetalle);

//Endpoint para recuperar los datos de detalle
router.get('/mapas/detalle/:id/ubicacion', isAuthenticated, datosDetalle);


//---------------------FORMULARIO DE CONTACTO--------------
//Endpoint para renderizar formulario de contacto
router.get('/mapas/contacto', contacto);

//Endpoint para procesar los datos enviados en el formulario de contacto
router.post('/mapas/contacto/email', envioEmail);



//Exportamos el modulo para poder ser utilizado por otros procesos
module.exports = router;
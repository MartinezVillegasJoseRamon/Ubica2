//Requerimos solo el modulo Router de express
const {Router} = require('express');
const router = Router();

//Requerimos las funciones que van a realizar la distintas rutas
const {renderMapa, todosPuntos, misUbicaciones, renderNuevo, upload, getImage} = require('../controllers/mapa_controlers');

//Requerimos la funcion creada para verificar si hay un usuario autenticado
const {isAuthenticated} = require('../helpers/auth');

//Ruta de la pagina inicial y funcion que ejecutará de los controladores
router.get('/mapas/mapa', isAuthenticated, renderMapa);

// Endpoint que consulta todos los marcadores de la BBDD
router.get('/mapas/mapa/datos', isAuthenticated, todosPuntos);

// Endpoint que consulta todos los marcadores del autor actual de la BBDD
router.get('/mapas/mapa/datos/autor', isAuthenticated, misUbicaciones);

// Endpoint añadir nuevo punto a BBDD
router.get('/mapas/mapa/nuevo', isAuthenticated, renderNuevo);

// Endpoint subir datos a BBDD
router.post('/mapas/upload', upload);

// Endpoint obtener imagen pasando nombre archivo
router.get('/mapas/img/:name', getImage);

//Exportamos el modulo para poder ser utilizado por otros procesos
module.exports = router;
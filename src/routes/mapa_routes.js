//Requerimos solo el modulo Router de express
const {Router} = require('express');
const router = Router();

//Requerimos las funciones que van a realizar la distintas rutas
const {renderMapa, todosPuntos} = require('../controllers/mapa_controlers');

//Requerimos la funcion creada para verificar si hay un usuario autenticado
const {isAuthenticated} = require('../helpers/auth');

//Ruta de la pagina inicial y funcion que ejecutará de los controladores
router.get('/mapas/mapa', renderMapa);

// Endpoint que consulta la BBDD
router.get('/mapas/mapa/datos', todosPuntos);


//Exportamos el modulo para poder ser utilizado por otros procesos
module.exports = router;
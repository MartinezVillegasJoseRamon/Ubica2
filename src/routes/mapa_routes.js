//Requerimos solo el modulo Router de express
const {Router} = require('express');
const router = Router();

//Requerimos las funciones que van a realizar la distintas rutas
const {renderMapa} = require('../controllers/mapa_controlers');

//Ruta de la pagina inicial y funcion que ejecutará de los controladores
router.get('/mapas/mapa', renderMapa);


module.exports = router;
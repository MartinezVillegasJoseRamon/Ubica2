//Requerimos solo el modulo Router de express
const {Router} = require('express');
const router = Router();

//Requerimos las funciones que van a realizar la distintas rutas
const {renderIndex, renderAbout} = require('../controllers/index_controlers');

//Ruta de la pagina inicial y funcion que ejecutará de los controladores
router.get('/', renderIndex);

//Ruta de la pagina Acerca de y funcion que ejecutará de los controladores
router.get('/about', renderAbout);


module.exports = router;
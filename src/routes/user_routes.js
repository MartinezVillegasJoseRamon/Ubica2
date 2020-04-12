const {Router} = require('express');
const router = Router();

//Importamos los metodos creados
const { renderSignUpForm, renderSigninForm, signin, signup, logout } = require('../controllers/user.controlers');

//Creamos las rutas

//Recogida de datos por get o post
router.get('/users/signup', renderSignUpForm);

//Envío de datos al servidor
router.post('/users/signup', signup);

//Envio de datos del formulario
router.get('/users/signin', renderSigninForm);

//Envio al servidor
router.post('/users/signin', signin);

//Salida del usuario
router.get('/users/logout', logout);


//Exportamos el modulo para ser reutilizado
module.exports = router;
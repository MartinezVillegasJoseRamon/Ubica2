//Creamos el objeto Router y añadimos el modulo express
const {Router} = require('express');
const router = Router();

//Importamos los metodos creados
const { renderSignUpForm, renderSigninForm, signin, signup, logout } = require('../controllers/user.controlers');

//Endpoint para recogida de datos de usuario
router.get('/users/signup', renderSignUpForm);

//Envío de datos del usuario al servidor
router.post('/users/signup', signup);

//Envio de datos del formulario de registro
router.get('/users/signin', renderSigninForm);

//Envio al servidor
router.post('/users/signin', signin);

//Salida del usuario
router.get('/users/logout', logout);


//Exportamos el modulo para ser reutilizado
module.exports = router;
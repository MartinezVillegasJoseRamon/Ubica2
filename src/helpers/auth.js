const helpers = {};

//Metodo que controla que el usuario está autenticado cuando accede a una ruta en la barra del navegador
//así protegemos todas las rutas a usuarios no autenticados
//Si el usuario no está autenticado, se redirige al formulario de autenticación
helpers.isAuthenticated = (req, res, next) =>{
    if (req.isAuthenticated()){
        console.log(req.isAuthenticated());
        return next();
    }else{
        req.flash('error_msg', 'No autorizado');
        res.redirect('/users/signin');
    }
};

module.exports = helpers;
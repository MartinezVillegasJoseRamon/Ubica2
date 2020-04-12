//El modulo passport controla el acceso de usuarios
//Passport-local permite acceso con credenciales externas (Google, Facebook, twitter, etc)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Requerimos el modelo de User para acceder a la BBDD
const User = require('../models/User');

passport.use(new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password'
    }, async (email, password, done) =>{
        //Aqui validamos con la BBDD
    const user = await User.findOne({email});
    if(!user){  //Si no existe el usuario devolvemos un mensaje de error
        return done(null, false, {message: 'No se ha encontrado el usuario'});
    }else{
        const match = await user.matchPassword(password);   //Si el usuario coinciden coincide con el de la BBDD, devolvemos el usuario
        if(match){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Password incorrecto'});
        }
    }
}));

//Guarda el usuario en la sesion del servidor
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//Consulta de passport a la BBDD para ver si existe el id y devuelve los datos del usuario
passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
        done(error, user);
    })
});

//Importamos los objetos que vamos a necesitar
const userCtrl = {};
const User = require('../models/User');
const passport = require('passport');

//Renderiza el formulario de usuarios
userCtrl.renderSignUpForm = (req, res) =>{
    res.render('users/signup');
};

//Metodo que controla la logica de guardar el usuario. Validaciones
userCtrl.signup = async (req, res) => {
    const errors = [];
    const {name, email, password, confirm_password} = req.body;
   
    //Validamos que la confirmación de contraseña coincide con la inicial
    if(password != confirm_password){
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    //Validamos que la contraseña tenga al menos 8 digitos
    if(password.length < 8) {
        errors.push({text: 'La longitud de la contraseña tiene que ser de al menos 8 caracteres'});
    }
    //Si hay errores volvemos al formulario y enviamos tanto los errores como los datos insertados para que el formulario no esté vacío
    if(errors.length >0){
        res.render('users/signup', {
            errors,
            name,
            email,
            password,
            confirm_password
        })
    }else{
        //Si toda la información es correcta, comprobamos que el email de usuario no existe
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'El correo ya existe');
            res.redirect('/users/signup');
        }else{
            //Si el email no está registrado para ningún usuario, guardamos el nuevo usuario
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encriptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Usuario registrado correctamente')
            res.redirect('/users/signin');
        }
    }
};

//Renderiza un formulario para volver a entrar
userCtrl.renderSigninForm= (req, res) => {
    res.render('users/signin');
};

//Validación de datos de usuarios
userCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/users/signin',
    successRedirect: '/mapas/mapa',
    failureFlash: true
});

//Salida (logout)
userCtrl.logout = (req, res) => {
    req.logout();
    req.flash('succes_msg', 'Sesión cerrada');
    res.redirect('/users/signin');
};
module.exports = userCtrl;
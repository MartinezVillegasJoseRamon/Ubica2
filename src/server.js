//---------------- Configuración del servidor
//Cargamos los módulos necesarios: express, rutas, templates
const express = require('express');
const path = require('path');   //Modulo incluido en express para manejar rutas
const exphbs = require('express-handlebars');  //Motor de plantillas de express, necesario para que funcione bien el modulo handlebars
const morgan = require('morgan');   //Modulo para ver en consola las peticiones y su duración durante el desarrollo
const Handlebars = require('handlebars');   //Motor de plantillas
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const methodOverride = require('method-override');  //Permite las llamadas HTTP en las plantillas
const flash = require('connect-flash');     //Modulo para almacenar mensajes en las sesiones
const session= require('express-session');  //Modulo de express para manejar sesiones
const passport = require('passport');       //Modulo para autenticación de usuarios
const cookieParser = require('cookie-parser');  //Modulo necesario para utilizar express-sessions
const fileUpload = require('express-fileupload');   //Modulo para subida de archivos de imagen


//---------------- Inicialización
const app = express();
require('./config/passport');


//---------------- Configuraciones
//Si está definido el puerto utilizamos el definido, si no, utilizamos por defecto el 4000
app.set('port', process.env.PORT || 4000);

//Ruta de las vistas
app.set('views', path.join(__dirname, 'views'));

//Definimos las rutas para las plantillas (layouts y partials) definiendo el engine de handlebars
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    handlebars : allowInsecurePrototypeAccess(Handlebars),
    extname: '.hbs'
}));

//Especificamos el motor de plantillas que vamos a utilizar
app.set('view engine', '.hbs');

//---------------- Middlewares (funciones que se ejecutan cuando llegan las peticiones)

//Los datos enviados/recibidos se codifican como JSON y así el servidor sabe interpretarlos
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//Indicamos el uso de fileUpload de express
app.use(fileUpload());

//Cargamos el modulo dev de morgan
//El modulo nos muestra la peticiones recibidas en la consola, muy util para verificar errores durante el desarrollo
app.use(morgan('dev'));

//Modulo override (Sobreescribe los metodos en los formularios)
app.use(methodOverride('_method'));

//Módulo necesario para sessions
app.use(cookieParser());

//Módulo para utilizar sessions en servidor
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

//Funciones que necesita passport para funcionar
app.use(passport.initialize());
app.use(passport.session());

//Middleware de flash (envio de mensajes emergentes)
app.use(flash());

//---------------- Variables globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; 
    next();
});

//---------------- Rutas ------------------------

//Requerimos el archivo donde almacenamos las rutas
app.use(require('./routes/index_routes'));
app.use(require('./routes/user_routes'));
app.use(require('./routes/mapa_routes'));

//---------------- Ficheros estaticos
//Indicación de la ruta de la carpeta public
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('public'));

module.exports = app;

const mongoose = require('mongoose');

//Creamos la cadena de conexión como un string que toma los datos del archivo .env
const {NOTES_APP_MONGODB_HOST, NOTES_APP_MONGODB_DATABASE} = process.env;
const MONGODB_URI = `mongodb://${NOTES_APP_MONGODB_HOST}/${NOTES_APP_MONGODB_DATABASE}`;

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
    
})
    .then(db => console.log('Conectado a la base de datos correctamente'))
    .catch(err => console.log('Error de conexión a BBDD ' + err));

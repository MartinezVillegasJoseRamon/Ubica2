
//Si existe el archivo .env, cargamos las variables para acceder a la BBDD
require('dotenv').config();

const app= require('./server');

//Llamamos al módulo que arranca la conexión a la BBDD
require('./database');

app.listen(app.get('port'), () => {
    console.log('Servidor funcionando en puerto ' + app.get('port'));
    
});



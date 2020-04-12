//Requerimos los paquetes necesarios para definir el modelo de datos de Usuario
const {Schema, model} = require('mongoose');

//Requerimos el paquete que encriptará la contraseña del usuario
const bcrypt = require ('bcryptjs');

//Definición del esquema de datos de un usuario para guardar en mongodb
const UserSchema = new Schema({
    name: {type:String, required: true},
    email: {type:String, required: true, unique: true},
    password: {type:String, required: true},
    },
    {
        timestamps: true
    });


    
//Definimos un metodo asincrono para encriptar la contraseña
    UserSchema.methods.encriptPassword = async password => {
        const salt= await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    };

//Definimos el metodo que encripta la contraseña al acceder para compararla con la existente en BBDD
    UserSchema.methods.matchPassword = async function(password){
        return await bcrypt.compare(password, this.password);   //Devuelve true si la contraseña es correcta
    };


//Creamos el modelo de datos y lo exportamos
module.exports = model('User', UserSchema);
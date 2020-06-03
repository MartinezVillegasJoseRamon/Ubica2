//Requerimos los paquetes necesarios para definir el modelo de datos de Usuario
const {Schema, model} = require('mongoose');


//Definición del esquema de datos de un punto para guardar en mongodb
const PuntoSchema = new Schema({
    tipo_fotografia: {type:String, required: true},
    titulo: {type:String, required: true},
    coordenadas: {type:[Number], required: true},
    imagen: {type:String, required: true},
    rutaImagen: {type:String},
    autor: {type:String},
    direccion: {type:String},
    acceso: {type:String},
    fecha_foto: {type:Date},
    visitas: {type:Number},
    comentarios: {type:[String]},
    },
    {
        timestamps: true
    });



//Creamos el modelo de datos y lo exportamos
module.exports = model('Punto', PuntoSchema);
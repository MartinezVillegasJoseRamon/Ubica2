
//Cargamos la vista inicial del mapa
cargaMapa();

//Creamos el marcador con "mi localización"
miLocalizacion();

//Cargamos el mapa desde vistaMapa.js
cargaDatos('/mapas/mapa/datos');


//Evento para boton Mis ubicaciones
document.getElementById("mis_ubicaciones").onclick = function () {
    eliminaMarcadores();
    document.getElementById("tipo_foto").value='Tipo de foto';
    cargaDatos('/mapas/mapa/datos/autor');

};

//Evento para boton todas las ubicaciones
document.getElementById("ver_todas").onclick = function () {
    eliminaMarcadores();
    document.getElementById("tipo_foto").value='Tipo de foto';
    cargaDatos('/mapas/mapa/datos');

};

//Evento para boton mi ubicación
document.getElementById("ver_miUbicacion").onclick = function () {
    document.getElementById("tipo_foto").value='Tipo de foto';
    map.flyTo([miPosicion.latitude, miPosicion.longitude], 16);

};

//Evento para boton nueva ubicación
document.getElementById("new").onclick = function () {
    location.href = '/mapas/mapa/nuevo';
};

//Evento para selector tipo_foto
document.getElementById("tipo_foto").onchange = function (elem) {

    //Mostramos las ubicaciones que coinciden con el tipo de foto seleccionada
    let filtro = elem.target.value;
    eliminaMarcadores();
    cargaDatos('/mapas/mapa/datos' + '/?tipo=' + filtro);
};




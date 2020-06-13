
//Cargamos la vista inicial del mapa
cargaMapaInicial();

//Creamos el marcador con "mi localización"
miLocalizacion();

//Cargamos el mapa desde vistaMapa.js
cargaDatos('/mapas/mapa/datos');


//Evento para boton todas las ubicaciones
document.getElementById("ver_todas").onclick = function () {
    eliminaMarcadores();
    window.sessionStorage.clear('modo');
    document.getElementById('txtModo').className = 'badge badge-pill badge-primary d-block mt-3';
    document.getElementById('txtModo').innerText='Modo visualización';
    document.getElementById("tipo_foto").value='Tipo de foto';
    cargaDatos('/mapas/mapa/datos');
};

//Evento para boton mi ubicación
document.getElementById("ver_miUbicacion").onclick = function () {
    document.getElementById("tipo_foto").value='Tipo de foto';
    map.flyTo([miPosicion.latitude, miPosicion.longitude], 14);
};

//Evento para boton Mis ubicaciones
document.getElementById("mis_ubicaciones").onclick = verMisUbicaciones;

//Función que descarga mis ubicaciones
function verMisUbicaciones() {
    eliminaMarcadores();
    document.getElementById("tipo_foto").value='Tipo de foto';
    //Cargamos los datos de mis ubicaciones
   cargaDatos('/mapas/misubicaciones');
    
};

//Evento para boton nueva ubicación
document.getElementById("new").onclick = function () {
    location.href = '/mapas/mapa/nuevo';
};

//Evento para boton Editar
document.getElementById("edit").onclick = function () {
    //Mostramos solo las ubicaciones del usuario, que son las únicas que puede editar
    //y establecemos el modo en edit
    window.sessionStorage.setItem('modo','edit');
    document.getElementById('txtModo').className = 'badge badge-pill badge-warning d-block mt-3';
    document.getElementById('txtModo').innerText='Modo Edición';

    //document.getElementById('map').style.cursor.fontcolor('black');
    verMisUbicaciones();
    Swal.fire({
        title: 'Editar',
        icon: 'info',
        text: 'Solo puedes editar tus ubicaciones. Pulsa Ver todo para salir del modo Edición',
        confirmButtonText: 'Ok',
    })
};

//Evento para boton Eliminar
document.getElementById("delete").onclick = function () {
    //Mostramos solo las ubicaciones del usuario, que son las únicas que puede editar
    //y establecemos el modo en delete
    window.sessionStorage.setItem('modo','delete');
    document.getElementById('txtModo').className = 'badge badge-pill badge-danger d-block mt-3';
    document.getElementById('txtModo').innerText='Modo Eliminación';
    verMisUbicaciones();
    Swal.fire({
        title: 'Eliminar',
        icon: 'warning',
        text: 'Solo puedes eliminar tus ubicaciones. Pulsa Ver todo para salir del modo Eliminación',
        confirmButtonText: 'Ok',
    })
};

//Evento para selector tipo_foto
document.getElementById("tipo_foto").onchange = function (elem) {
    //Mostramos las ubicaciones que coinciden con el tipo de foto seleccionada
    let filtro = elem.target.value;
    eliminaMarcadores();
    document.getElementById('txtModo').className = 'badge badge-pill badge-primary d-block mt-3';
    document.getElementById('txtModo').innerText='Modo visualización';
    cargaDatos('/mapas/mapa/datos' + '/?tipo=' + filtro);
};




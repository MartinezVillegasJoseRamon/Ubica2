
//Cargamos la vista inicial del mapa
cargaMapa();


//Creamos el marcador con "mi localización"
miLocalizacion();

//Mostramos las instrucciones para añadir un marcador nuevo
instrucciones();

//Habilitamos la creacion de nuevos marcadores con doble click
habilitarNuevoMarcador();

//Mostramos en el thumbnail la imagen cargada
cargaThumbnail();

//Llamamos al endpoint que carga las ubicaciones del usuario
cargaDatos('/mapas/mapa/datos/autor');

//Añadimos un marcador temporal al hacer doble click
map.doubleClickZoom.disable();  //Desactivamos el doble click para hacer zoom
let temp=  L.markerClusterGroup({ disableClusteringAtZoom: 10 });   //Capa para el marcador nuevo

map.on('dblclick', e => {
//Si existe un marcador temporal anterior, lo eliminamos
temp.clearLayers(); 
let position;
let latlng = map.mouseEventToLatLng(e.originalEvent);
let nuevaUbicacion = L.marker(latlng, {
    draggable: true,
    autoPan: true,
    opacity: 1
}).bindPopup("<b>Nuevo</b>");
position = nuevaUbicacion.getLatLng();  //Obtenemos las coordenadas del doble click

//Evento dragend - Se dispara cuando movemos el marcador
nuevaUbicacion.on('dragend', function (event) {
    let marker = event.target;
    position = marker.getLatLng();
    anadirCoordenadas(position);
    marker.setLatLng(position, {draggable: 'true' }).bindPopup(position).update();
})

//Añadimos el nuevo punto a una capa temporal y esa capa la mostramos en el mapa
nuevaUbicacion.addTo(temp);
temp.addTo(map);
anadirCoordenadas(position);    //Añadimos las coordenadas al formulario
document.getElementById("inputAutor").value = autorNuevaUbicacion;  //Añadimos el nombe del autor con el usuario activo al formulario
});

//Capturamos el evento click del botón de formulario
let botEnviar = document.getElementById('enviar');
botEnviar.addEventListener('click', uploadClick, false);


//Capturamos el formulario
function uploadClick(event){
    const form = document.getElementById('formNuevo');
    const formData = new FormData(form);
    uploadData(formData);
};

//Creamos la cabecera del envío
function uploadData(form) {

    const datos={
        titulo : form.titulo,
        latitud: form.latitud,
        longitud: form.longitud,
        autor: form.autor,
        direccion: form.direccion,
        acceso: form.acceso,
        fecha_foto: form.fecha_foto,
        imagen: form.imagen
    };

    const url = '/mapas/upload';
    fetch(url, {
    method: 'POST',
    body: datos
    })
    .then(res => res.json())
    .then(res => {
    console.log(res);
    })
};
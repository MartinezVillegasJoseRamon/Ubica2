
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

//Llamamos al endpoint que carga los datos del usuario
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

//Obtenemos las coordenadas del doble click
position = nuevaUbicacion.getLatLng();

//Evento dragend - Se dispara cuando movemos el marcador
nuevaUbicacion.on('dragend', function (event) {
    let marker = event.target;
    position = marker.getLatLng();
    anadirCoordenadas(position);
    marker.setLatLng(position, {draggable: 'true' }).bindPopup(position).update();
});
//Añadimos el nuevo punto a una capa temporal y esa capa la mostramos en el mapa
nuevaUbicacion.addTo(temp);
temp.addTo(map);

//Añadimos las coordenadas al formulario
anadirCoordenadas(position);

//Añadimos el nombe del autor con el usuario activo al formulario
document.getElementById("inputAutor").value = autorNuevaUbicacion;
});

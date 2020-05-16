
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


map.doubleClickZoom.disable();
map.on('dblclick', e => {
    //markers.clearLayers();
    let position;
    let latlng = map.mouseEventToLatLng(e.originalEvent);
    let nuevaUbicacion = L.marker(latlng, {
        draggable: true,
        autoPan: true,
        opacity: 1
    }).bindPopup("<b>Nuevo</b>");
    position = nuevaUbicacion.getLatLng();

    nuevaUbicacion.on('dragend', function (event) {
        let marker = event.target;
        position = marker.getLatLng();
        anadirCoordenadas(position);
        marker.setLatLng(position, { id: 'temporal', draggable: 'true' }).bindPopup(position).update();
    });
    nuevaUbicacion.addTo(marcadores);
    anadirCoordenadas(position);
});

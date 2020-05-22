
//Metodo para evitar el reenvío del formulario
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

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
let temp = L.markerClusterGroup({ disableClusteringAtZoom: 10 });   //Capa para el marcador nuevo

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
        marker.setLatLng(position, { draggable: 'true' }).bindPopup(position).update();
    })

    //Añadimos el nuevo punto a una capa temporal y esa capa la mostramos en el mapa
    nuevaUbicacion.addTo(temp);
    temp.addTo(map);
    anadirCoordenadas(position);    //Añadimos las coordenadas al formulario
    document.getElementById("inputAutor").value = autorNuevaUbicacion;  //Añadimos el nombe del autor con el usuario activo al formulario
});

//Capturamos el evento click del botón de formulario
let formulario = document.getElementById('formNuevo');
formulario.addEventListener('submit', (evento => {
    evento.preventDefault();    //Evitamos que se envíe el formulario para controlarlo con el fetch y capturar la respuesta
    uploadData();
}));



//Creamos el envío
function uploadData() {
const formData = new FormData(formulario);
    const url = 'http://localhost:4000/mapas/upload';
    fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            //Si devuelve ok, nos redirige a la pagina de mapa, si no, muestra los errores detectados en el servidor
            if (res.message === 'ok') {
                Swal.fire({
                    title: "Mensaje del servidor",
                    icon: 'success',
                    text: 'Ubicación guardada correctamente',
                    confirmButtonText: "Ok"
                }).then((result) => {
                    if (result.value) {
                        window.location.href = '/mapas/mapa';
                    }
                })

            } else {
                Swal.fire({
                    title: 'Revisa la lista de errores',
                    icon: 'error',
                    text: 'Errores: ' + res.message,
                    confirmButtonText: 'Ok',
                })
            }
        })
};
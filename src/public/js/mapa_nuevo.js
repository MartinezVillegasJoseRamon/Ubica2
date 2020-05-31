
//Metodo para evitar el reenvío del formulario
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

//Cargamos la vista inicial del mapa
cargaMapaInicial();


//Creamos el marcador con "mi localización"
miLocalizacion();

//Mostramos las instrucciones para añadir un marcador nuevo
instrucciones();


//Mostramos en el thumbnail la imagen cargada
cargaThumbnail();

//Llamamos al endpoint que carga las ubicaciones del usuario
cargaDatos('/mapas/misUbicaciones');

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

//Capturamos el evento click del botón salir
document.getElementById('botSalir').onclick = function () {
    
    Swal.fire({
        title: 'Cancelar',
        text: "¿Seguro que quieres abandonar la nueva ubicación?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No, seguimos'
      }).then((result) => {
        if (result.value) {
            window.location.href = "/mapas/mapa";
        }
      });

    
};


//Creamos el envío de datos al servidor
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

// //Añadimos los datos exif
document.getElementById('botExif').onclick = function () {

    let img1 = document.getElementById("imagenThumbnail");  //Capturamos la imagen subida
    let data;
    img1.exifdata=null;
    if (img1.src.substr(-9) != "noimg.jpg") {
        EXIF.getData(img1, function () {
            data = EXIF.getAllTags(img1);   //Variable para guardar todos los EXIF
            if (Object.keys(data).length !== 0) { //Si tenemos algo en datos exif los mostramos
                let velocidad = calculaVelocidad(data.ExposureTime);
                Swal.fire({
                    title: '<strong>Datos EXIF</strong>',
                    icon: 'info',
                    html:
                        '<table class="table table-hover">' +
                        '<thead>' +
                        '    <tr>' +
                        '    <th scope="col">Concepto</th>' +
                        '    <th scope="col">Valor</th>' +
                        '    </tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '    <tr> ' +
                        '    <th scope="row">Autor</th> ' +
                        '    <td>' + (typeof data.Artist === 'undefined' ? 'Sin datos' : data.Artist) + '</td> ' +
                        '    </tr> ' +
                        '    <th scope="row">Marca</th> ' +
                        '    <td>' + (typeof data.Make === 'undefined' ? 'Sin datos' : data.Make) + '</td> ' +
                        '    </tr> ' +
                        '    <tr> ' +
                        '    <th scope="row">Modelo</th> ' +
                        '    <td>' + (typeof data.Model === 'undefined' ? 'Sin datos' : data.Model) + '</td> ' +
                        '    </tr> ' +
                        '    <tr> ' +
                        '    <th scope="row">Diafragma</th> ' +
                        '    <td>' + (typeof data.FNumber === 'undefined' ? 'Sin datos' : 'f ' + data.FNumber) + '</td> ' +
                        '    </tr> ' +
                        '    <th scope="row">Exposición</th> ' +
                        '    <td>' + (typeof velocidad === 'undefined' ? 'Sin datos' : velocidad) + '</td> ' +
                        '    </tr> ' +
                        '    <th scope="row">ISO</th> ' +
                        '    <td>' + (typeof data.ISOSpeedRatings === 'undefined' ? 'Sin datos' : data.ISOSpeedRatings) + '</td> ' +
                        '    </tr> ' +
                        '    <th scope="row">Modo de medición</th> ' +
                        '    <td>' + (typeof data.MeteringMode === 'undefined' ? 'Sin datos' : data.MeteringMode) + '</td> ' +
                        '    </tr> ' +
                        '    <th scope="row">Programa de disparo</th> ' +
                        '    <td>' + (typeof data.ExposureProgram === 'undefined' ? 'Sin datos' : data.ExposureProgram) + '</td> ' +
                        '    </tr> ' +
                        '</tbody> ' +
                        '</table>'
                });

            } else {
                Swal.fire('La imagen no contiene datos EXIF');
            }
        })
    }
};

function calculaVelocidad(veloc){
    if(!veloc) return 'Sin datos';  //Si no existe el dato, no continuamos y retornamos vacio

    let num= veloc.numerator;
    let den= veloc.denominator;
    if(num > den) velocidad = num/den + ' sg';
    if(num < den) velocidad = '1/' + den/num + ' sg';
    if(num == 1) velocidad = '1/' + den + ' sg';
    if(!veloc) return 'Sin datos';
    return velocidad;
}


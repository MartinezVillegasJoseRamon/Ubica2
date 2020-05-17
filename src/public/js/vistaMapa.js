//Variable del mapa
let map;
 //Añadimos variables para manejo de marcadores
 let marcadores=  L.markerClusterGroup({ disableClusteringAtZoom: 17 });  //Capa marcadores
let arrayMarkers = [];    //Array para marcadores

let miPosicion;
let autorNuevaUbicacion;

function cargaMapa() {
    //Inicialización del mapa
    map = L.map('map', { center: [37.992225, -1.130542], zoom: 15 });
    var markers = new L.LayerGroup().addTo(map);
    //Capas de base
    //Cartografia
    var osmBase = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<\/a> contributors',
        maxZoom: 20,
        maxNativeZoom: 19
    }).addTo(map);

    //Ortofoto
    var pnoa = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&", {
        layers: "OI.OrthoimageCoverage",//nombre de la capa (ver get capabilities)
        format: 'image/jpeg',
        transparent: true,
        version: '1.3.0',//wms version (ver get capabilities)
        attribution: "PNOA WMS. Cedido por © Instituto Geográfico Nacional de España",
        maxZoom: 20,
        maxNativeZoom: 19
    });

    var baseMaps = {
        "Cartografia": osmBase,
        "Ortofotos": pnoa
    };
    //Añadimos las capas base al mapa
    L.control.layers(baseMaps).addTo(map);

};

//Mi Localización actual
function miLocalizacion() {
    let lat, long;
    navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        miPosicion = position.coords;

        //Icono personalizado Font Awesome para Mi Localización
        let marker = L.marker([lat, long], { icon: L.AwesomeMarkers.icon({ icon: 'camera', prefix: 'fa', markerColor: 'darkred', iconColor: 'white', spin: false }) }).bindPopup('Mi localización').addTo(map);
    });
};


//Añadimos un mensaje con instrucciones 
//Si hemos permitido la geolocalización se situa en miPosicion, si no va al centro del mapa
function instrucciones() {
    let centro, lat, lng;
    if (miPosicion) {
        lat = miPosicion.latitude;
        lng = miPosicion.longitude;
    } else {
        centro = map.getCenter();
        lat = centro.lat;
        lng = centro.lng;
    }
    //-------------------------------------------------------------------

    Swal.fire({
        title: "Mis Ubicaciones",
        icon: 'info',
        text: "Haz doble click en el mapa para situar tu nueva ubicación y arrastra el marcador para un ajuste fino",
        confirmButtonText: "Empezar",
    });
}
//Añadir marcador con doble click
//Desactivar doble click con zoom
function habilitarNuevoMarcador() {

};

//Elimina los marcadores
function eliminaMarcadores() {
    map.removeLayer(marcadores);
    marcadores.clearLayers();
};

//Insertamos la latitud y longitud del nuevo punto insertado
function anadirCoordenadas(coord) {
    document.getElementById("inputLat").value = coord.lat;
    document.getElementById("inputLng").value = coord.lng;
};


// Actualiza el elemento 'img' de la vista con la imagen seleccionada una vez que el 
// usuario ha seleccionado una, sin necesidad de pulsar ningún botón. 
function cargaThumbnail() {

    document.getElementById('inputSubirImagen').onchange = function (evt) {
        var tgt = evt.target || window.event.srcElement,
            files = tgt.files;

        // FileReader
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {   //Evento que se activa cuando la lectura es correcta
                // Actualiza la imagen y hace que se vea en la web la preselección
                document.getElementById('imagenThumbnail').src = fr.result;
                if (tgt.files && tgt.files.length) {
                    // Actualiza el label del input para mostrar el nombre de la imagen seleccionada
                    document.getElementById('labelInputSubirImagen').innerHTML = tgt.files[0].name;
                }
            }
            fr.readAsDataURL(files[0]);
        }

    }
};

//Metodo para cargar los datos del usuario actual
function cargaDatos(url) {
    //Hacemos fetch a la pagina que devuelve los datos de los puntos y creamos los marcadores
    fetch(url)
        .then(res => res.json())
        .then(res => {

            // Comprobamos si tenemos datos que mostrar
            if (res) {
                autorNuevaUbicacion = res.usuarioActual;
                //anadirAutor(autorNuevaUbicacion);//Añadimos el autor en el input del formulario
                //Recorremos el array de puntos y vamos insertando cada marcador con su popup
                arrayMarkers = res.puntos.map(element => {
                    //Variable para almacenar comentarios
                    let comentariosTXT = "";
                    for (let i = 0; i < element.comentarios.length; i++) {
                        comentariosTXT += i + 1 + ": " + element.comentarios[i] + ", "
                    }
                    //Iconos personalizados del marcador en funcion del tipo de fotografía
                    let icono = "";
                    let color = "";
                    let iconcolor = "";
                    switch (element.tipo_fotografia) {
                        case 'ciudad':
                            icono = 'building';
                            color = 'purple';
                            iconcolor = 'white';
                            break;
                        case 'macro':
                            icono = 'eye';
                            color = 'orange';
                            iconcolor = 'white';
                            break;
                        case 'paisaje':
                            icono = 'image';
                            color = 'green';
                            iconcolor = 'white';
                            break;
                        case 'nocturna':
                            icono = 'spinner';
                            color = 'black';
                            iconcolor = 'white';
                            break;
                        case 'LP':
                            icono = 'star';
                            color = 'gray';
                            iconcolor = 'white';
                            break;
                        case 'ruinas':
                            icono = 'registered';
                            color = 'brown';
                            iconcolor = 'white';
                            break;
                        case 'costa':
                            icono = 'flag';
                            color = 'darkblue';
                            iconcolor = 'white';
                            break;

                        default:
                            icono = 'question-circle';
                            color = 'red';
                            iconcolor = 'yellow';
                            break;
                    }
                    //Dibujamos los marcadores
                    let marker = L.marker(element.coordenadas, { icon: L.AwesomeMarkers.icon({ icon: icono, prefix: 'fa', markerColor: color, spin: false, iconColor: iconcolor }) })
                        .bindPopup('<strong>Ubicación</strong>' + "<br>" +
                            'Coord.(Lat, Long): ' + element.coordenadas + "<br>" + "<br>" +
                            '<strong>Autor: </strong>' + element.autor + "<br>" +
                            'Título: ' + element.titulo + "<br>" +
                            'Tipo fotografía: ' + element.tipo_fotografia + "<br>" +
                            'Dirección: ' + element.direccion + "<br>" +
                            'Comentarios: ' + comentariosTXT + "<br>" +
                            'Visitas: ' + element.visitas + "<br>" +
                            'Imagen: ' + element.foto + "<br>"
                        ).addTo(marcadores)
                    return marker;
                });
                if (arrayMarkers.length) {
                    map.addLayer(marcadores);
                    map.fitBounds(marcadores.getBounds().pad(0.1));
                    arrayMarkers = [];
                }
                else {
                    //Hacemos zoom a la localización del usuario
                    if (miPosicion) {
                        map.setView([miPosicion.latitude, miPosicion.longitude], 12);
                    }
                }
            }
        })
         .catch(err => {
            let errDevueltos= "";
             err.forEach(element => {
                 errDevueltos += element + " ";
             });
             
            Swal.fire({
                title: "Mensaje del servidor",
                icon: 'info',
                text: errDevueltos,
                confirmButtonText: "Ok",
            })
         });
}

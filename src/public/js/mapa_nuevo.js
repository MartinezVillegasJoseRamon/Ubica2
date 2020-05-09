

//Inicialización del mapa
var map = L.map('map', { center: [37.992225, -1.130542], zoom: 15 });
var miPosicion;
var autorNuevaUbicacion;
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


//Añadimos un mensaje con instrucciones 
let centro = map.getCenter();
let lat=centro.lat;
let lng=centro.lng;
var popup = L.popup(/* {autoClose:false} */)
      .setLatLng([lat, lng])
      .setContent('Doble click para insertar una nueva ubicación. Puedes arrastrar el marcador para un ajuste fino'); 
    map.addLayer(popup);


//Añadir marcador con doble click
//Desactivar doble click con zoom
map.doubleClickZoom.disable();
map.on('dblclick', e => {  
    markers.clearLayers();
    let position;
    let latlng = map.mouseEventToLatLng(e.originalEvent);
    let nuevaUbicacion = L.marker(latlng, {
        draggable:true,
        autoPan: true,
        opacity: 1
        }).bindPopup("<b>Nuevo</b>");
    position = nuevaUbicacion.getLatLng();

        nuevaUbicacion.on('dragend', function(event){
            let marker = event.target;
            position = marker.getLatLng();
            anadirCoordenadas(position);
            marker.setLatLng(position,{id:'temporal',draggable:'true'}).bindPopup(position).update();
        });
    nuevaUbicacion.addTo(markers);

    //map.addLayer(nuevaUbicacion);  
    anadirCoordenadas(position);
    
});

//Mi Localización actual
navigator.geolocation.getCurrentPosition(function (position) {
    let Lat = position.coords.latitude;
    let Long = position.coords.longitude;
    miPosicion=position.coords;
    
    //Icono personalizado Font Awesome para Mi Localización
    let marker = L.marker([Lat, Long], {icon: L.AwesomeMarkers.icon({ icon: 'camera', prefix: 'fa', markerColor: 'darkred', iconColor: 'white', spin: false }) }).bindPopup('Mi localización').addTo(map);
});


//Añadimos los marcadores recibidos al mapa
let marcadores=L.layerGroup();  //Capa marcadores
let arrayMarkers=[];    //Array para marcadores (zoom)

//Elimina los marcadores
function eliminaMarcadores(){
    map.removeLayer(marcadores);
    marcadores.clearLayers();
};

//Hacemos zoom a los marcadores creados con un margen de +1%
function zoomMarcadores(){
var group = new L.featureGroup(arrayMarkers);
map.fitBounds(group.getBounds().pad(0.1));}

//Insertamos la latitud y longitud del nuevo punto insertado
function anadirCoordenadas(coord){
    document.getElementById("inputLat").value = coord.lat;
    document.getElementById("inputLng").value = coord.lng;
};

//Insertamos el autor del nuevo punto insertado
function anadirAutor(autor){
    document.getElementById("inputAutor").value = autor;
};

// Actualiza el elemento 'img' de la vista con la imagen seleccionada una vez que el 
// usuario ha seleccionado una, sin necesidad de pulsar ningún botón. Así se mejora la
// experiencia de usuario.
function imageSelected(evt) {
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

function uploadClickEvt(evt) {
    const form = document.getElementById('upload-img-form');
    const formData = new FormData(form);
    uploadImage(formData);
}

function uploadImage(image) {
    const url = 'http://localhost:4000/mapas/upload';
    fetch(url, {
        method: 'POST',
        body: image
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        alert('Imagen subida con éxito!!');
    });
}

//Metodo para cargar los datos del usuario actual
function cargaDatos(url) {
    //Hacemos fetch a la pagina que devuelve los datos de los puntos y creamos los marcadores
    fetch(url)
        .then(res => res.json())
        .then(res => {
            // Comprobamos si tenemos datos que mostrar
            if (res && res.length) {
                autorNuevaUbicacion=res[0].autor;
                anadirAutor(autorNuevaUbicacion);//Añadimos el autor en el input del formulario
                
                //Recorremos el array de puntos y vamos insertando cada marcador con su popup
                res.forEach(element => {
                    //Variable para almacenar comentarios
                    let comentariosTXT = "";
                    for (let i = 0; i < element.comentarios.length; i++) {
                        comentariosTXT += i + 1 + ": " + element.comentarios[i] + ", "
                    }
    
                    //Iconos personalizados del marcador en funcion del tipo de fotografía
                    let icono = "";
                    let color = "";
                    let prefijo = "";
                    switch (element.tipo_fotografia) {
                        case 'ciudad':
                            icono = 'building';
                            color = 'purple';
                            break;
                        case 'macro':
                            icono = 'eye';
                            color = 'orange';
                            break;
                        case 'paisaje':
                            icono = 'image';
                            color = 'green';
                            break;
    
                        default:
                            icono = 'house-damage';
                            color = 'red';
                            break;
                    }
                    //Dibujamos los marcadores
                    let marker = L.marker(element.coordenadas, { icon: L.AwesomeMarkers.icon({ icon: icono, prefix: 'fa', markerColor: color, spin: false, iconColor: 'white' }) })
                        .bindPopup('<strong>Ubicación</strong>' + "<br>" +
                            'Coord.(Lat, Long): ' + element.coordenadas + "<br>" + "<br>" +
                            '<strong>Autor: </strong>' + element.autor + "<br>" +
                            'Título: ' + element.titulo + "<br>" +
                            'Tipo fotografía: ' + element.tipo_fotografia + "<br>" +
                            'Dirección: ' + element.direccion + "<br>" +
                            'Comentarios: ' + comentariosTXT + "<br>" +
                            'Visitas: ' + element.visitas + "<br>" +
                            'Imagen: ' + element.foto + "<br>"
                        ).addTo(marcadores);
                    arrayMarkers.push(marker);
                });
                map.addLayer(marcadores);
                zoomMarcadores();
                arrayMarkers=[];
            }
        });
}

function addEventListeners() {
    document.getElementById('botSubir').onclick = uploadClickEvt;
    document.getElementById('inputSubirImagen').onchange = imageSelected;
}

addEventListeners();
cargaDatos('http://localhost:4000/mapas/mapa/datos/autor');


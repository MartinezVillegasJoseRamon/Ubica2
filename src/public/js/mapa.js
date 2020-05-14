
//Inicialización del mapa
var map = L.map('map', { center: [37.992225, -1.130542], zoom: 15 });
var miPosicion;
    

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


//Conocer coordenadas del click o el dblclick
//Desactivar doble click con zoom
map.doubleClickZoom.disable();
map.on('dblclick', e => {
    let latlng = map.mouseEventToLatLng(e.originalEvent);

    //Popup, al hacer doble click muestra las coordenadas
    var popup = L.popup()
        .setLatLng(latlng)
        .setContent('<p><strong>Posición: </strong><br>Latitud:' + latlng.lat + '<br>Longitud: ' + latlng.lng + '</p>')
        .openOn(map);
});

//Mi Localización actual
function miLocalizacion(){
    let lat, long;
    navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        miPosicion=position.coords;

        //Icono personalizado Font Awesome para Mi Localización
        let marker = L.marker([lat, long], {icon: L.AwesomeMarkers.icon({ icon: 'camera', prefix: 'fa', markerColor: 'darkred', iconColor: 'white', spin: false }) }).bindPopup('Mi localización').addTo(map);
        });
    };
//Creamos el icono con la localización del usuario
miLocalizacion();


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


function cargaDatos(url) {
    //Hacemos fetch a la pagina que devuelve los datos de los puntos y creamos los marcadores
    fetch(url)
        .then(res => res.json())
        .then(res => {
            //Recorremos el array de puntos y vamos insertando cada marcador con su popup
            if (res && res.length) {
                res.forEach(element => {
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
                            icono = 'image';
                            color = 'red';
                            iconcolor = 'grey';
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
                        ).addTo(marcadores);
                    arrayMarkers.push(marker);
                });
                map.addLayer(marcadores);
                zoomMarcadores();
                arrayMarkers=[];
            }
            else{
                Swal.fire({
                    title: "Mis Ubicaciones",
                    icon: 'info',
                    text: "No tienes ninguna ubicación aún",
                    confirmButtonText: "Aceptar",
                });
                //Hacemos zoom a la localización del usuario
                if(miPosicion){
                map.flyTo([miPosicion.latitude, miPosicion.longitude], 14);
                }
            }
        })
        .catch(err => alert(err));
}

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






var map = L.map('map', {
    center: [37.992225, -1.130542],
    zoom: 15
    });


//Capas de base
var osmBase = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<\/a> contributors',
    maxZoom: 20,
    maxNativeZoom: 19
}).addTo(map);

var pnoa=L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&", {
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
L.control.layers(baseMaps).addTo(map);

//Conocer coordenadas del click o el dblclick
//Desactivar doble click con zoom
map.doubleClickZoom.disable();
map.on('dblclick', e=> {
    let latlng= map.mouseEventToLatLng(e.originalEvent);
    //console.log(latlng);

//Popup, al hacer doble click muestra las coordenadas
var popup = L.popup()
.setLatLng(latlng)
.setContent('<p><strong>Posición: </strong><br>Latitud:' + latlng.lat + '<br>Longitud: ' + latlng.lng + '</p>')
.openOn(map);
});


//Añadimos los marcadores recibidos al mapa

//console.log(puntos);
// puntos.forEach(element => {
//     let marcador = L.marker([element.lat, element.long], {title: element.titulo}).addTo(map);
// });

// var myMarker = L.marker([37.992225, -1.130542], {title: "Marcador", alt: "The Big I", draggable: true})
// .addTo(map)
// .on('dragend', function() {
//     var coord = String(myMarker.getLatLng()).split(',');
//     var lat = coord[0].split('(');
//     var lng = coord[1].split(')');
//     myMarker.bindPopup("Situado en: " + lat[1] + ", " + lng[0] + ".");
// });


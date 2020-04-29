

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

//Popup, al hacer doble click muestra las coordenadas
var popup = L.popup()
.setLatLng(latlng)
.setContent('<p><strong>Posición: </strong><br>Latitud:' + latlng.lat + '<br>Longitud: ' + latlng.lng + '</p>')
.openOn(map);
});


//Añadimos los marcadores recibidos al mapa
let marcadores=[];  //Array para marcadores utilizado en zoom a marcadores

//Hacemos fetch a la pagina que devuelve los datos de los puntos y creamos los marcadores
fetch('http://localhost:4000/mapas/mapa/datos')
.then (res=>res.json())
.then (res=>{
    res.forEach(element => {
    let marker= L.marker(element.coordenadas, {title: element.titulo}).addTo(map);
    marcadores.push(marker);
    });
    //Hacemos zoom a los marcadores creados con un margen de +1%
    var group = new L.featureGroup(marcadores);
    map.fitBounds(group.getBounds().pad(0.1));
})


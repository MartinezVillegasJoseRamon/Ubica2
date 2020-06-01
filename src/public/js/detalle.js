//Cargamos la vista inicial del mapa
cargaMapaInicial();

//Creamos el marcador con "mi localización"
miLocalizacion();

//Descargamos los datos de la ubicación
let idUbicacion = window.sessionStorage.getItem('idUbicacion');

//Una vez creados los elementos, hacemos la consulta de datos para ir llenando los inputs
window.onload = descargaDatos('/mapas/detalle/' + idUbicacion + '/ubicacion');

//Funcion que descarga los datos del servidor
function descargaDatos(url) {

    fetch(url)
        .then(res => res.json())
        .then(res => {
            // Comprobamos si tenemos datos que mostrar
            if (res) {
                //Convertimos la fecha ISODate para que la admita el input
                let date = res[0].fecha_foto;
                let fecha;
                if (date) {
                    fecha = date.split("T")[0];
                    document.getElementById("inputFechaFoto").value = fecha;
                };
                //Rellenamos los inputs con los datos devueltos
                document.getElementById("inputAutor").value = res[0].autor;
                document.getElementById("inputTitulo").value = res[0].titulo;

                document.getElementById("inputTipoFoto").value = res[0].tipo_fotografia;
                document.getElementById("inputDireccion").value = res[0].direccion;
                document.getElementById("inputAcceso").value = res[0].acceso;
                document.getElementById("inputAutor").value = res[0].autor;
                document.getElementById("inputAutor").value = res[0].autor;
                //Dibujamos el marcador en las coordenadas del punto actual
                let lat = res[0].coordenadas[0];
                let long = res[0].coordenadas[1];
                let marker = L.marker([lat, long], {
                    icon: L.AwesomeMarkers.icon(
                        { icon: 'check-circle', prefix: 'fa', markerColor: 'blue', iconColor: 'white', spin: false })
                }).bindPopup('Ubicación Actual').addTo(map);
                map.flyTo([lat, long], 12);
                //Descargamos la imagen correspondiente al punto
                if (res[0].imagen) descargaImagen(res[0].imagen);
            }
        })
        .catch(err => {
            console.log(err);
        })
};

//Funcion para descargar imagen de la ubicación
function descargaImagen(nombre) {
    let imagen = ('/mapas/img/' + nombre);
    document.getElementById("img").src = imagen;
};

//Botón volver al mapa
document.getElementById("botVolver").addEventListener("click", function () {
    window.location.href = "/mapas/mapa";
});

//Botón actualizar  //---------------------------------------------------------------------------------------------
if (document.getElementById("botUpdate")) {
    document.getElementById("botUpdate").addEventListener("click", function () {
        Swal.fire({
            title: 'Actualizar',
            icon: 'warning',
            text: 'Datos actualizados',
            confirmButtonText: 'Ok',
        }).then ((result) =>{
            window.location.href = "/mapas/mapa";
        })
    });
}

//Botón eliminar    //---------------------------------------------------------------------------------------------
if (document.getElementById("botDelete")) {
    document.getElementById("botDelete").addEventListener("click", function () {
        Swal.fire({
            title: 'Eliminar',
            icon: 'warning',
            text: 'Ubicación eliminada',
            confirmButtonText: 'Ok',
        }).then ((result) =>{
            window.location.href = "/mapas/mapa";
        })
    });
}



// //Añadimos los datos exif
document.getElementById('botExif').onclick = function () {

    let img1 = document.getElementById("img");  //Capturamos la imagen subida
    let data;
    img1.exifdata = null;
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
function calculaVelocidad(veloc) {
    if (!veloc) return 'Sin datos';  //Si no existe el dato, no continuamos y retornamos vacio

    let num = veloc.numerator;
    let den = veloc.denominator;
    if (num > den) velocidad = num / den + ' sg';
    if (num < den) velocidad = '1/' + den / num + ' sg';
    if (num == 1) velocidad = '1/' + den + ' sg';
    if (!veloc) return 'Sin datos';
    return velocidad;
}
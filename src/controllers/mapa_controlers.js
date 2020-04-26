//Creamos un objeto controlador
const mapaCtrl = {};

//Funcion para renderizar el mapa
mapaCtrl.renderMapa = (req, res) => {
    res.render('mapas/mapa');
};



module.exports = mapaCtrl;
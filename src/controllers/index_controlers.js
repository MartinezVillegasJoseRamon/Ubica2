//Creamos un objeto controlador
const indexCtrl = {};

//Funcion para renderizar Index (pagina de inicio)
indexCtrl.renderIndex = (req, res) => {
    res.render('index');
};

//Funcion para renderizar Acerca de...
indexCtrl.renderAbout = (req, res) => {
    res.render('about');
};

module.exports = indexCtrl;

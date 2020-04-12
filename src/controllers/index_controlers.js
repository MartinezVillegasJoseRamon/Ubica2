//Creamos un objeto controlador
const indexCtrl = {};

//Funcion para renderizar index
indexCtrl.renderIndex = (req, res) => {
    res.render('index');
};

//Funcion para renderizar about
indexCtrl.renderAbout = (req, res) => {
    res.render('about');
};

module.exports = indexCtrl;

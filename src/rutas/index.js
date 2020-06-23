const { Router } = require('express');
const rutas = Router();


const carreras = require('../carreras.json');


//rutas de la aplicación
rutas.get('/', (req, res) => {
    //req.params(name, tipomime);
    console.log(carreras[0]);
    res.json(carreras);
});

module.exports = rutas;
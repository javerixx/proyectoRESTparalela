const { Router } = require('express');
const rutas = Router();


const carreras = require('../carreras.json');

//Funciones que se usan


//rutas de la aplicación
rutas.get('/', (req, res) => {
    req.params(name, tipomime, context);
    // Nombre del archivo, tipo mime del archivo y contenido del archivo
    for(var i = 0; i<28; i++){
        console.log(carreras[i].nombre_carrera);
    }
    res.json(carreras);
});

module.exports = rutas;
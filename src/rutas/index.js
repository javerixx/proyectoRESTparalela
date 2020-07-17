const { Router } = require('express');
const rutas = Router();


const carreras = require('../carreras.json');

//Funciones que se usan


//rutas de la aplicación
rutas.get('/', (req, res) => {
    try{
        res.status(200).json(carreras);
    }
    catch{
        res.status(412).json(({error: 'No se encontró.'}));
    }
});

rutas.get('/:codigo', (req, res) => {
    const {codigo} = req.params;
    if(codigo){
        for(var i = 0; i<28; i++){
            if(codigo == carreras[i].codigo){
                res.status(200).json(carreras[i]);
            }
        }
        res.status(400).json(({error: 'Dato ingresado no valido.'}));
    }
    else{
        res.status(404).json(({error: 'No se encontró el contenido ingresado.'}));
    }
});

module.exports = rutas;
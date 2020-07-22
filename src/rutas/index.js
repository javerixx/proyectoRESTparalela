const { Router } = require('express');
const rutas = Router();


const carreras = require('../carreras.json');

//Funciones que se usan

// 1) Funcion que permite limpiar el string, quitando las tildes y comillas
function normalizeString(rawText) {
    return rawText.normalize(`NFD`).replace(/[\u0300-\u036f]/g, ``);
}

// 2) Funcion que permite retornar el puntaje final que el estudiante obtuvo
function calculoponderacion(nem, ranking, lenguaje, matematica, ciencia, historia, carrera){
    let pnem = carrera.nem;
    let pranking = carrera.ranking;
    let plenguaje = carrera.lenguaje;
    let pmatematica = carrera.matematica;
}


//Rutas de la aplicación

//Ruta que permite mostrar todas las carreras contenidas en el programa
rutas.get('/', (req, res) => {
    try{
        res.status(200).json(carreras);
    }
    catch{
        res.status(412).json(({error: 'No se encontró.'}));
    }
});

// Para hacer pruebas de la sintaxis de js
rutas.get('/prueba/', (req, res) => {
    let filtrocarrera = [];
    let nombre = "Ingeniería"
    let nombre_normalizado = normalizeString(nombre).toUpperCase();
    for(var i = 0; i<28; i++){
        let nombre_carrera_normalizado = normalizeString(carreras[i].nombre_carrera).toUpperCase();
        if(nombre_carrera_normalizado.includes(nombre_normalizado)){
            filtrocarrera.push(carreras[i]);
        }
    }
    if(filtrocarrera){
        res.status(200).json(filtrocarrera);
    }
    else{
        res.status(412).json(({error: 'No se logró filtrar carreras.'}));
    }
});

// Filtro, que permite desplegar (no está terminada)
rutas.get('/filtro', (req, res) => {
    var codigo = req.params.nombre;
    if(nombre){
        for(var i = 0; i<28; i++){
            if(nombre == carreras[i].nombre_carrera){
                res.status(200).json(carreras[i]);
            }
        }
        res.status(400).json(({error: 'Parámetro no valido.'}));
    }
    else{
        res.status(404).json(({error: 'No se encontró el contenido requerido.'}));
    }
});

// Ruta que permite retornar los datos de una carrera a partir
// de su código como parámetro de entrada.
rutas.get('/:codigo', (req, res) => {
    var codigo = req.params.codigo;
    if(codigo){
        for(var i = 0; i<28; i++){
            if(codigo == carreras[i].codigo){
                res.status(200).json(carreras[i]);
            }
        }
        res.status(400).json(({error: 'Parámetro no valido.'}));
    }
    else{
        res.status(404).json(({error: 'No se encontró el contenido requerido.'}));
    }
});

module.exports = rutas;
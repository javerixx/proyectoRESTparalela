const { Router } = require('express');
const rutas = Router();
const carreras = require('../carreras.json');

//Funciones que se usan

// 1) Funcion que permite limpiar el string, quitando las tildes, comillas y otras expresiones especiales
function normalizeString(rawText) {
    return rawText.normalize(`NFD`).replace(/[\u0300-\u036f]/g, ``);
}

// 2) Funcion que permite retornar el puntaje final que el estudiante obtuvo
function calculoponderacion(nem, ranking, lenguaje, matematica, ciencia, historia, carrera){
    let pnem = nem * carrera.nem; // Puntaje obtenido multiplicado por porcentaje que exige una carrera
    let pranking = ranking * carrera.ranking;
    let plenguaje = lenguaje * carrera.lenguaje;
    let pmatematica = matematica * carrera.matematica;
    if(ciencia > historia){ // En caso de que el puntaje de ciencia es mayor que el de historia
        pciehis = ciencia * carrera.ciencia_historia;
    }
    else{ // En caso contrario
        pciehis = historia * carrera.ciencia_historia;
    }
    let puntajefinal = pnem + pranking + plenguaje +pmatematica + pciehis;
    return puntajefinal;
}

// 3) Funcion donde ordena una lista de objetos en base a los puntajes finales de las carreras.
// Cada objeto contiene 4 atributos, los cuales son codigo, nombre, puntaje y lugar tentativo de una carrera.
function ordenarpuntajes(x){
    x.sort(function (a, b) { // Se ordena Mayor a menor de acuerdo a puntajes finales obtenidos en cada carrera
        if (a.puntaje > b.puntaje) {
          return 1; // Si la condición se cumple, se sitúa "a" en un indice menor que "b". Es decir, "a" viene primero.
        }
        if (a.puntaje < b.puntaje) {
          return -1; // Si la condición se cumple, se sitúa "b" en un indice menor que "a". Es decir, "b" viene primero.
        }
        // En caso que a y b son iguales, no habrá cambios de indice.
        return 0;
    });
}

// 4) Funcion que verifica si los puntajes que el usuario ingresa desde cliente son correctos.
function verificarpuntajes(nem, ranking, lenguaje, matematica, ciencia, historia){
    // La condición de aqui abajo pregunta si los tipos de datos ingresados no son de tipo Number, sea entero o decimal. 
    if(typeof nem !== 'number' && typeof ranking !== 'number' && typeof lenguaje === 'number' && typeof matematica === 'number' && typeof ciencia === 'number' && typeof historia === 'number'){
        return false;
    }
    // Se comprueba si se cumple todos el intervalo entre 150 y 850. 
    if(nem >= 150 && nem <= 850){
        if(ranking >= 150 && ranking <= 850){
            if(lenguaje >= 150 && lenguaje <= 850){
                if(matematica >= 150 && matematica <= 850){
                    if(ciencia >= 150 && ciencia <= 850){
                        if(historia >= 150 && historia <= 850){
                            return true;
                        } 
                    } 
                }
            }
        }
    }
    return false;
}

//Rutas de la aplicación

//Ruta que permite mostrar todas las carreras contenidas en el programa, a partir de "carreras.json".
rutas.get('/', (req, res) => {
    try{
        res.status(200).json(carreras);
    }
    catch{
        res.status(412).json(({error: 'Error inesperado.'}));
    }
});

// Ruta que permite retornar los datos de una carrera a partir de su código como parámetro de entrada.
rutas.get('/:codigo', (req, res) => {
    const codigo = req.params.codigo; // Parametro necesario.
    if(codigo){ // Se verifica que el código exista.
        try{
            for(var i = 0; i<28; i++){ // Se recorre las 28 carreras para buscar el código
                if(codigo == carreras[i].codigo){ // Se verifica si el código coincide 
                    res.status(200).json(carreras[i]); // Retorna la carrera que se encontró
                }
            }
            res.status(400).json(({error: 'Parámetro no valido.'}));
        }
        catch{
            res.status(412).json(({error: 'Error inesperado.'}));
        }
    }
    else{
        res.status(404).json(({error: 'No se encontró el parámetro requerido.'}));
    }
});

// Ruta correspondiente a filtro, que permite desplegar las carreras en base al parámetro nombre para filtrar
rutas.get('/filtro/:nombre', (req, res) => {
    var nombre = req.params.nombre; // Parametro necesario
    if(nombre){
        try{
            let filtrocarrera = []; // Se inicializa el arreglo tipo objeto, lo cual dada objeto representa las mismas variables que contiene una carrera en carreras.json
            let nombre_normalizado = normalizeString(nombre).toUpperCase(); // Se limpia y normaliza el string en mayusculas
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
        }
        catch{
            res.status(412).json(({error: 'Error inesperado.'}));
        }
    }
    else{
        res.status(404).json(({error: 'No se encontró el parámetro requerido.'}));
    }
    
});

// Ruta correspondiente a las 10 mejores opciones de elegir sobre las carreras ofrecidas por la UTEM
rutas.post('/mejoresopciones/', (req, res) => {
    // Request body con datos necesarios
    var nem = req.body.nem;
    var ranking = req.body.ranking;
    var lenguaje = req.body.lenguaje;
    var matematica = req.body.matematica; 
    var ciencia = req.body.ciencia; 
    var historia = req.body.historia; 
    var listado_10_opciones = []; // Se inicializa una lista de tipo objeto, donde será ordenado de mayor a menor puntaje
    if(nem && ranking && lenguaje && matematica && ciencia && historia){ // Se verifica si se ha ingresado los datos.
        try{
            let verificar = verificarpuntajes(nem, ranking, lenguaje, matematica, ciencia, historia); // Aqui se verifica si ha ingresado correctamente, retornando en true en el mejor de los casos.
            if(!verificar){ // Se verifica si ha retornado falso, comprobando que hubo un error de ingreso.
                res.status(400).json(({error: 'Datos ingresados no validos.'}));
            }
            for(let i = 0; i<28; i++){ // Se recorre las 28 carreras
                let opcion = new Object(); // Se crea un objeto, que contendrá codigo, nombre, puntaje y lugar tentativa de una carrera.
                opcion.codigo = carreras[i].codigo; // Se extrae el nombre de la carrera la cual se está analizando.
                opcion.nombre_carrera = carreras[i].nombre_carrera; // Se extrae el nombre de la carrera.
                opcion.puntaje = calculoponderacion(nem, ranking, lenguaje, matematica, ciencia, historia, carreras[i]); // Se calcula el puntaje final.
                opcion.lugar_tentativo = (carreras[i].primer_matriculado - carreras[i].ultimo_matriculado)/carreras[i].vacantes; // Se calcula el lugar tentativo, donde el más cercano al 0 representa la mejor opcion.
                if(listado_10_opciones.length < 10){ // En caso de no haber llenado las 10 opciones de elegir las carreras.
                    listado_10_opciones.push(opcion); // Se ingresa el objeto a la lista.
                    ordenarpuntajes(listado_10_opciones); // Se ordena la lista cada vez que se ingrese el objeto.
                }
                else{
                    if(opcion.puntaje > listado_10_opciones[listado_10_opciones.length - 1].puntaje){ // En caso de que el puntaje de la opcion analizada es mayor al puntaje más bajo de la lista, se reemplaza los datos.
                        listado_10_opciones[listado_10_opciones.length - 1].codigo = opcion.codigo;
                        listado_10_opciones[listado_10_opciones.length - 1].nombre_carrera = opcion.nombre_carrera;
                        listado_10_opciones[listado_10_opciones.length - 1].puntaje = opcion.puntaje;
                        listado_10_opciones[listado_10_opciones.length - 1].lugar_tentativo = opcion.lugar_tentativo;
                        ordenarpuntajes(listado_10_opciones); // Se ordnea la lista cada vez que se ingrese 
                    }
                }
            }
            listado_10_opciones.sort(function (a, b) { // Por ultimo, se vuelve a ordenar, ordenando de menor a mayor en base a lugar tentativo
                if (a,lugar_tentativo > b.lugar_tentativo) { // Similar a la funcion ordenar, solamente que las condiciones son distintas o al reves
                  return 1;
                }
                if (a.lugar_tentativo < b.lugar_tentativo) {
                  return -1;
                }
                return 0;
            });
            res.status(200).json(listado_10_opciones);
        }
        catch{
            res.status(412).json(({error: 'Error inesperado.'}));
        }
    }
    else{
        res.status(404).json(({error: 'No se ha ingresado los datos solicitados.'}));
    }
});

module.exports = rutas;

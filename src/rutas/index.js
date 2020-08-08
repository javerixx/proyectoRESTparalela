// Declaraciones de dependencias necesarias
const { Router } = require('express');
const rutas = Router();
const carreras = require('../carreras.json'); // Archivo que contiene una lista de 28 carreras.

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
        if (a.puntaje < b.puntaje) {
          return 1; // Si la condición se cumple, se sitúa "a" en un indice menor que "b". Es decir, "b" viene primero.
        }
        if (a.puntaje > b.puntaje) {
          return -1; // Si la condición se cumple, se sitúa "b" en un indice menor que "a". Es decir, "a" viene primero.
        }
        // En caso que a y b son iguales, no habrá cambios de indice.
        return 0;
    });
}

// 4) Funcion donde ordena una lista de objetos en base a los lugares tentativos de las carreras.
// Cada objeto contiene 4 atributos, los cuales son codigo, nombre, puntaje y lugar tentativo de una carrera.
function ordenarlugartentativo(x){
    x.sort(function (a, b) { // La lista estará ordena de menor a mayor en base a lugar tentativo
        if (a.lugar_tentativo > b.lugar_tentativo) { // Similar a la funcion ordenarpuntajes, solamente que las condiciones son distintas y al reves
          return 1;
        }
        if (a.lugar_tentativo < b.lugar_tentativo) {
          return -1;
        }
        return 0;
    });
}

// 5) Funcion que verifica si los puntajes que el usuario ingresa desde cliente son correctos.
function verificarpuntajes(nem, ranking, lenguaje, matematica, ciencia, historia){
    // La condición de aqui abajo pregunta si los tipos de datos ingresados no son de tipo Number, sea entero o decimal. 
    if(typeof nem !== 'number' || typeof ranking !== 'number' || typeof lenguaje !== 'number' || typeof matematica !== 'number' || typeof ciencia !== 'number' || typeof historia !== 'number'){
        return false;
    }
    // En caso de que estos dos puntajes son ingresados a 0
    if(ciencia == 0 && historia == 0){
        return false;
    }
    // Se comprueba si se cumple todos el intervalo entre 150 y 850. 
    if(nem >= 150 && nem <= 850){
        if(ranking >= 150 && ranking <= 850){
            if(lenguaje >= 150 && lenguaje <= 850){
                if(matematica >= 150 && matematica <= 850){
                    if((ciencia >= 150 && ciencia <= 850) || (ciencia == 0)){
                        if((historia >= 150 && historia <= 850) || (historia == 0)){
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

/* URL: http://localhost:8085/carreras/
   Método: GET
   Datos de entrada por Query param: codigo
   Ruta que permite retornar los datos de una carrera a partir de su código como query de entrada.
   En caso de no tener ingresado, por defecto muesta todas las carreras contenidas en el programa.
   Las carreras están a a partir de "carreras.json".
*/
rutas.get('/carreras/', (req, res) => {
    var codigo = req.query.codigo; // Query Param necesario.
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
    else{ // Por defecto, se despliega todas las carreras existente
        res.status(200).json(carreras);
    }
});


/* URL: http://localhost:8085/filtro/
   Método: GET
   Datos de entrada por Query param: nombre
   Descripción: Ruta correspondiente a filtro, 
   que permite desplegar las carreras en base al parámetro nombre,
   para así filtrar una o más carreras que tienen nombres similares.
*/
rutas.get('/filtro/', (req, res) => {
    var nombre = req.query.nombre; // Query Param necesario
    if(nombre){ // Se verifica si se ha ingresado algo
        try{
            let filtrocarrera = []; // Se inicializa el arreglo tipo objeto, lo cual dada objeto representa las mismas variables que contiene una carrera en carreras.json
            let nombre_normalizado = normalizeString(nombre).toUpperCase(); // Se limpia y normaliza el string en mayusculas al nombre ingresado
            for(var i = 0; i<28; i++){ // Se recorre las 28 carreras
                let nombre_carrera_normalizado = normalizeString(carreras[i].nombre_carrera).toUpperCase(); // Se extrae, limpia y normaliza el string en mayusculas al nombre de la carrera
                if(nombre_carrera_normalizado.includes(nombre_normalizado)){ // Se verifica que ambos nombres son parecidos, comparando el substring nombre y string nombre de la carrera.
                    filtrocarrera.push(carreras[i]);
                }
            }
            if(filtrocarrera.length !== 0){
                res.status(200).json(filtrocarrera);
            }
            else{ // En caso de que la lista esté vacia, es decir, no ha coincidido en ningún nombre
                res.status(412).json(({error: 'No se logró filtrar alguna carrera.'}));
            }
        }
        catch{
            res.status(412).json(({error: 'Error inesperado.'}));
        }
    }
    else{ // Por defecto, se despliega todas las carreras existente
        res.status(200).json(carreras);
    }
});


/* URL: http://localhost:8085/mejoresopciones/
   Método: POST
   Datos de entrada por Request Body: "nem", "ranking", "lenguaje", "matematica", "ciencia" e "historia"
   Descripción: Ruta correspondiente a las 10 mejores opciones de elegir 
   sobre las carreras ofrecidas por la UTEM. Mientras se recorre los datos
   de las 28, se ordena de mayor a menor puntaje. Una vez finalizado,
   se ordena de acuerdo el lugar tentativo que se obtiene,
   calculando (primer_matriculado - ultimo_matriculado)/vacantes
   de cada carrera asignada en la lista de objetos.
*/
rutas.post('/mejoresopciones/', (req, res) => {
    // Request body con datos de entrada necesarios
    var nem = req.body.nem;
    var ranking = req.body.ranking;
    var lenguaje = req.body.lenguaje;
    var matematica = req.body.matematica; 
    var ciencia = req.body.ciencia; 
    var historia = req.body.historia; 
    var listado_10_opciones = []; // Se inicializa una lista de tipo objeto, donde será ordenado de mayor a menor puntaje
    if(nem && ranking && lenguaje && matematica){ // Se verifica si se ha ingresado los datos.
        try{
            if(!historia){ // En caso de no ser ingresado
                historia = 0;
            }
            if(!ciencia){ // En caso de no ser ingresado
                ciencia = 0;
            }
            let verificardatos = verificarpuntajes(nem, ranking, lenguaje, matematica, ciencia, historia); // Aqui se verifica si ha ingresado correctamente, retornando en true en el mejor de los casos.
            if(!verificardatos){ // Se verifica si ha retornado falso, comprobando que hubo un error de ingreso.
                res.status(412).json(({error: 'Datos ingresados no validos o no has ingresado algún dato.'}));
            }
            if((lenguaje+matematica)/2 < 450){ // Se verifica en caso de no cumplir con el promedio minimo
                res.status(200).json(({mensaje: 'De acuerdo los puntajes que ingresó, no cumple con el puntaje promedio minimo entre lenguaje y matemática que es 450.'}));
            }
            for(let i = 0; i<28; i++){ // Se recorre las 28 carreras
                let codigo = carreras[i].codigo; // Se extrae el nombre de la carrera la cual se está analizando.
                let nombre_carrera = carreras[i].nombre_carrera; // Se extrae el nombre de la carrera.
                let puntaje = calculoponderacion(nem, ranking, lenguaje, matematica, ciencia, historia, carreras[i]); // Se calcula el puntaje final.
                let lugar_tentativo = (carreras[i].primer_matriculado - carreras[i].ultimo_matriculado)/carreras[i].vacantes; // Se calcula el lugar tentativo, donde el más cercano al 0 representa la mejor opcion.
                let opcion = {codigo: codigo, nombre_carrera: nombre_carrera, puntaje: puntaje, lugar_tentativo: lugar_tentativo}; // Se crea un objeto, que contendrá codigo, nombre, puntaje y lugar tentativa de una carrera.
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
                        ordenarpuntajes(listado_10_opciones); // Se ordena la lista cada vez que se ingrese 
                    }
                    else{ // En caso que el puntaje en analisis es igual al puntaje de la ultima opcion, y que el lugar tentativo de la opción analizada sea mejor.
                        if((opcion.puntaje == listado_10_opciones[listado_10_opciones.length - 1].puntaje) && (opcion.lugar_tentativo < listado_10_opciones[listado_10_opciones.length - 1].lugar_tentativo)){ 
                            listado_10_opciones[listado_10_opciones.length - 1].codigo = opcion.codigo;
                            listado_10_opciones[listado_10_opciones.length - 1].nombre_carrera = opcion.nombre_carrera;
                            listado_10_opciones[listado_10_opciones.length - 1].puntaje = opcion.puntaje;
                            listado_10_opciones[listado_10_opciones.length - 1].lugar_tentativo = opcion.lugar_tentativo;
                            ordenarlugartentativo(listado_10_opciones); // Primero se ordena la lista por lugar tentativo, en caso de haber otros puntajes iguales.
                            ordenarpuntajes(listado_10_opciones); // Luego, se ordena la lista por puntajes, pero con lugares tentativos ya ordenados.
                        }
                    }
                }
            }
            ordenarlugartentativo(listado_10_opciones); // Por ultimo, se vuelve a ordenar, ordenando de menor a mayor en base a lugar tentativo
            res.status(200).json(listado_10_opciones);
        }
        catch{
            res.status(412).json(({error: 'Error inesperado.'}));
        }
    }
    else{
        res.status(404).json(({error: 'No se han ingresado los datos solicitados.'}));
    }
});

 module.exports = rutas;

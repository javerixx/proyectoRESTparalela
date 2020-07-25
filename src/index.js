// Declaraciones de dependencias necesarias
const express = require('express');
const jwt = require('express-jwt');
const cors = require('cors');
const app = express();


// Configuración
app.set('puerto', 8085);

// Middlewares
app.use(express.urlencoded({extended: false})); // Para soportar los datos de entrada.
app.use(express.json()); // Permite recibir el formato json.
app.use(jwt({secret: process.env.SECRET || `token_paralela`, algorithms: ['HS256']})); // Para implementar la autenticación con JWT.
app.use(cors()); // Para la implementación de cors.

// Ruta
app.use(require('./rutas/index'));

// Se inicia el servidor desde localhost (puesto) 8085
app.listen(app.get('puerto'), () => {
    console.log(`Abriendo servidor desde el puerto ${app.get('puerto')}`)
});

// Para más detalles de la lógica, vease a rutas/index.js
const express = require('express');
const app = express();
const morgan = require('morgan');

// Configuración
app.set('puerto', 8085);

// Middlewares
app.use(morgan('dev')); //Para visualizar solamente las peticiones y estados de HTTP
app.use(express.urlencoded({extended: false})); // Para soportar los datos de entrada
app.use(express.json()); // Permite recibir el formato json

// Ruta
app.use(require('./rutas/index'));

// Se inicia el servidor desde localhost (puesto) 8085
app.listen(app.get('puerto'), () => {
    console.log(`Abriendo servidor desde el puerto ${app.get('puerto')}`)
});
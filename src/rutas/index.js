const { Router } = require('express');
const rutas = Router();


//rutas de la aplicación
rutas.get('/', (req, res) => {
    //req.params(name, tipomime);

    res.send("MI primer servidor");
});

module.exports = rutas;
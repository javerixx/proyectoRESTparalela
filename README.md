# Título del Proyecto

**_Proyecto SERVIDOR REST, PSU_**

## Descripción 🚀

_Este proyecto consiste en levantar un servidor que sigue el protocolo REST,_ 
_lo cual contiene tres funcionalidades distintas. La primera funcionalidad_
_consiste en desplegar una carrera en especifico a partir del código de ello,_
_en caso de no ingresarla por defecto se despliega el listado de todas las_
_carreras, que en total son 28._
_La segunda funcionalidad consiste en desplegar una o más carreras de acuerdo_ 
_el nombre que se ingresa como dato de entrada, es decir, filtrar los nombres_
_y desplegar los que son similares._
_Por último, la tercera funcionalidad consiste en desplegar las 10 mejores opciones_
_para ingresar en esas carreras, lo cual en la ejecución se obtiene primero los 10_
_mejores puntajes y tras terminar de recorrer las 28 carreras, se vuelve a ordenar_
_de acuerdo a lugar tentativo estimado, cabe señalar que está ordenado de la mejor_
_a ultima opción para postular en dicha carrera. Para esta funcionalidad se requiere_
_ingresar los puntajes los cuales son el nem, ranking, lenguaje, matemática, ciencia_
_e historia, cabe señalar que deben ingresar los valores que estén entre 150 y 850,_
_sea un entero o decimal, de lo contrario los datos ingresados no serán invalidas._
_En caso de no dar la PSU de historia o ciencia, se debe ingresar un 0 o no ingresar nada,
_sin embargo, al ingresar 0 o nada en ambos puntajes no serán validos._
_Todos los resultados son desplegatos en formato JSON. Este proyecto está creado_
_para el sistema operativo Ubuntu, sin embargo puede también funcionar otros sistemas_
_operativos pero los comandos y forma de instalación de herramientas pueden cambiar._ 

### Requisitos 📋

* Tener instalado NodeJs, cuya versión utilizada es 10.19.0. Se podrá instalar ingresando el siguiente comando en el terminal:
```
sudo apt install npm
```

### Ejecución del programa 🔧

_Para ejecutar el programa, se debe seguir los siguientes pasos manualmente:_

_1) Desde una terminal, debe posicionar en la carpeta o directorio del proyecto, e ingresar el siguiente comando para ejecutar el servidor:_
```
npm run psu
```
_2) Debe mostrar un mensaje "Abriendo servidor desde el puerto 8085". Luego, se debe abrir un navegador_ 
   _e ingresar el siguiente link, con el fin de verificar su funcionamiento. Debe mostrar un mensaje de_
   _error, lo cual consiste en que se niega el acceso al servidor:_ 
   **http://localhost:8085/carreras/**

_Listo, el servidor ya se encuentra abierta y podrá ingresar datos_
_de entrada con SOAPUI, Postman o otro similar, para realizar pruebas._
_En caso de quiera cerrar el puerto 8085 y no se pueda por salir de la ejecución, se debe ingresar el siguiente comando:_
```
fuser -k 8085/tcp
```

## Ejecutando las pruebas ⚙️

_Antes de probar con SOAPUI, Postman o otro similar, se debe ingresar en el header el token de autorización de JWT,_
_con el nombre de "Authorization", y así podrán realizar pruebas en las tres funcionalidades._

_Para la primera funcionalidad, debe ingresar:_
* URL: **http://localhost:8085/carreras/**
* Método: **GET**
* Query Param: codigo (el valor debe coincidir con cualquier código de carrera existente)

_Para la segunda funcionalidad, debe ingresar:_
* URL: **http://localhost:8085/filtro/**
* Método: **GET**
* Query Param: **nombre** (nombre similar de una o más carreras)

_Para la tercera funcionalidad, debe ingresar:_
* URL: **http://localhost:8085/mejoresopciones/**
* Método: **POST**
* Request Body: **nem**, **ranking**, **lenguaje**, **matematica**, **ciencia** e **historia** 

_Como señala la descripción, cada uno despliega resultados en formato JSON._
_**NOTA: Para el caso de Request body, se debe ingresar los nombres y asignar valores en formato JSON, de esta forma:**_

```
{
   "nem": [valor],
   "ranking": [valor],
   "lenguaje": [valor],
   "matematica": [valor],
   "ciencia": [valor],
   "historia": [valor]
}
```

## Herramientas 🛠️

* [Visual Studio Code](https://code.visualstudio.com/) - Editor de código fuente.
* [SOAPUI 5.0.0](https://www.soapui.org/downloads/soapui/) - Herramientas de prueba API.
* [Postman](https://www.postman.com/) - Herramientas de prueba API, como otra alternativa.
* [NodeJs](https://nodejs.org/es/) - Entorno de ejecución para JavaScript.

## Integrantes del proyecto ✒️

* **Sebastián Garrido Valenzuela** - [Sebastron](https://github.com/Sebastron)
* **Ramiro Uribe Garrido** - [RamiroUribe](https://github.com/RamiroUribe)
* **Javier Gálvez González** - [javerix](https://github.com/javerix)


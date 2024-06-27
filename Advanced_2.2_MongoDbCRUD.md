# Interactuando con MongoDB (operacones CRUD)

## Creando una conexión estable

Idealmente, al establecer una conexión, nosotros queremos que esta se quede abierta. No es apropiado abrirla y cerrarla para cada operación.
Para tal fin, vamos a exportar nuestra conexión, que al importarla cada vez que la vayamos a usar se vería así:

```javascript 

const getDb = require('../util/database').getdb ??????
```

## Utilizando la conexión en nuestros models
Una vez está importada la conexión, ahora podemos utilizarla. Por ejemplo, en nuestros models.
A diferencia de MySQL, MongoDB maneja de forma automáticamente ciertas situaciones.
Por ejemplo, si no existe una colección, la crea. No tenemos que verificar si existe o no existe manualmente.


```javascript 
class Ejemplo{
    constructor(params) {this.params = params};
    save(){
        //COMPLETAR CÓDIGO CON LOS APUNTES
    }
}

```
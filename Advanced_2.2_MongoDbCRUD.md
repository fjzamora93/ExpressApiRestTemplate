# Interactuando con MongoDB (operacones CRUD)

*NOTA* Normalmente vamos a ustilizar MONGOOSE y no este sistema. Pero igualmente lo dejo por aquí.
____________________________________________________________________________________________________

*sesion #200* MAEPANDO para recuperar una serie de objetos de un usuario y recuperarlos. Aquí es donde se trabaja con referencias internas y permite el anidamiento dentro de MongoDB, donde el objeto anidado lo que tiene es una referencia.

Vamos a partir del siguiente código, donde tenemos una conexión ya estáblecida y hemos creado un objeto.
A diferencia de MySQL, MongoDB maneja de forma automáticamente ciertas situaciones.
Por ejemplo, si no existe una colección, la crea. No tenemos que verificar si existe o no existe manualmente.



## Crear / guardar
    ```javascript 

    const getDb = require('../util/database').getDb;

module.exports = class RecipeMdb {
    constructor(nombre, descripcion){
        this.nombre = nombre;
        this.descripcion = descripcion
        this.id = id ? new mongoDB.Object(id) : null; 
        //acuérdate de importar esto, es para convertir a bson. Aquí decimos que o coja esa ID o que la id sea null.
    }

    save() {
        const db = getDb();
        return db
          .collection('nombreColeccion')
          .insertOne(this)
          .then(result => {
            console.log(result);
          })
          .catch(err => {
            console.log(err);
          });
      }

```
## Buscar uno / FindOne

Existen dos enfoques. Podemos utilizar .find({_id: idDeseada}).next(), o bien podemos utilizar .findOne({_id: idDeseada}).
Recuerda que en _id MongoDb está esperando encontrar un objeto binario, así que tendremos que hacer la conversión previamente para que la búsqueda coincida.

    ```javascript
        
        static findByID(id){
            const db = getDb();
            return db
                .collection('nombreColeccion')
                .find({ _id: new mongodb.ObjectId(id) }) //alternativamente cambiar en el find().next() por un findOne();
                .next()
                .then(product => return product;)
                .catch(err => console.log(err))
        }

    ```

## Buscar todos / FetchAll

Para devolver todos los documentos de una colección, usamos el método .find() vacío. Al no introducir ningún parámetro dentro, no habrá criteiro de búsqueda.

```javascript
    static fetchAll() {
            const db = getDb();
            return db
                .collection('nombreColeccion')
                .find()
                .toArray()
                .then(products => {
                    console.log(products);
                    return products;
                })
                .catch(err => {
                    console.log(err);
            });
        }
```

## Filtrar

## Actualizar
    Podríamos unir en una misma función crear y actualizar, y la función podría ser save. En este caso, save, solamente va a actualizar.

    ```javascript
    
        save(){
            const db = getDb();
            return db
                .collection('nombreColeccion')
                .updateOne({ ._id: this._id }, $set: this )
                .then(result => console.log(result))
                .catch(err => console.log(err))
        }

    ```

    Debemos tener en cuenta que si queremos meter actualizar y añadir en el mismo método estático, tendremos que crear una copia de db. Algo así:

    ```javascript
    
        save() {
            const db = getDb();
            let dbOp;
            if (this._id) {
                // Update the product
                dbOp = db
                    .collection('products')
                    .updateOne({ _id: this._id }, { $set: this });
            } else {
             dbOp = db.collection('products').insertOne(this);
            }
            return dbOp
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.log(err);
                });
        }

    ```

En este código, `dbOp` se usa para almacenar la operación de base de datos que se va a realizar, que puede ser una operación de actualización (`updateOne`) o una operación de inserción (`insertOne`), dependiendo de si `this._id` existe.

La razón por la que se usa una variable separada para almacenar la operación de base de datos es para evitar la repetición de código. Sin `dbOp`, tendrías que repetir el código `.then().catch()` para manejar la promesa tanto en la rama `if` como en la `else` del código.

Al usar `dbOp`, puedes escribir el código para manejar la promesa una sola vez, después del `if/else`. Esto hace que el código sea más limpio y más fácil de mantener.


## Borrar

Para delete de un array podemos utilizar un enfoque muy sencillo que es devolver todos los objetos de un array que NO tengan la misma ID que la que nosotros pasemos como parámetro. Después, sobreescribiríamos el array original y lo actualizaríamos en la base de datos.

Para elimianr un solo producto de la base de datos, sin embargo, podemos utilizar la función deleteOne:

```javascript

static deleteById(id){
    cons db = getDb();
    return db
    .collection('nombreColeccion')
    .deleteOne({ id: new mongodb.ObjectId(id)})
    .then(result => console.log('Eliminado'))
    .catch(err => console.log(err))
}

```
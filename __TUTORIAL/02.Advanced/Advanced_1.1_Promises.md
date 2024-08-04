# Promises

En este bloque vamos a detallar cómo funcionan las promesas en Javascript y qué relación tiene con los Callback.

Una **promesa** es una operación (normalmente lo vamos a ver como una función) que va a resolverse en un momento incierto del futuro. 
Únicamente cuando la promesa se resuelva, se ejecutarán los bloques que estén encadenados a la promesa (con el.then() y el .catch(err=>))
En Express.js, las promesas se utilizan a menudo para manejar operaciones de base de datos asíncronas.

A continuación vemos un ejemplo de una promesa

```javascript
    //Tenemos un controller que va a "añadir" algo a la base de datos
    exports.postAddProduct = (req, res, next) => {
        const title = req.body.title;
        const imageUrl = req.body.imageUrl;
        const price = req.body.price;
        req.user  //Y a continuación vemos cómo se desencadena la promesa
            .createProduct({
                title: title,
                price: price,
                imageUrl: imageUrl,
            })
            .then(result => {
                console.log('Created Product');
                res.redirect('/admin/products');
            })
            .catch(err => {
                console.log(err);
            });
        };

```

En este caso 'createProduct' es un método para conectar con la Base de Datos, una operación que no sabemos cuándo se resolverá.
Al encadenar sucesivos .then().then().then().catch(), estamos determinando la secuencia en la que se resuelve esta promesa.

Las promesas son una alternativa a los callbacks para manejar la asincronía. Los callbacks son funciones que se pasan a otra función para ser ejecutadas una vez que una operación asíncrona ha terminado.


## Diferencia entre callback y promise

1. Manejo de errores: En las promesas, los errores se manejan en un bloque .catch() separado, lo que puede hacer que el manejo de errores sea más consistente y fácil de entender. En los callbacks, los errores se pasan como el primer argumento a la función de callback. 

2. Encadenamiento: Las promesas permiten un encadenamiento más limpio de operaciones asíncronas. Con los callbacks, esto puede llevar a un fenómeno conocido como "callback hell" o "pirámide de la perdición", donde el código se anida cada vez más y se vuelve ilegible.

3. Sintaxis: Las promesas pueden utilizarse con la sintaxis async/await, que puede hacer que el código asíncrono parezca más sincrónico y sea más fácil de leer y escribir.

Las ventajas de las promesas sobre los callbacks incluyen un mejor manejo de errores, un encadenamiento más limpio de operaciones asíncronas y una sintaxis más limpia con async/await. Sin embargo, los callbacks todavía se utilizan en muchos contextos y bibliotecas, y hay situaciones en las que pueden ser preferibles, dependiendo de las necesidades específicas del código.


1. Ejemplo de una promesa sencilla:

        ```javascript
        let promise = new Promise((resolve, reject) => {
        let condition = true; // puedes cambiar esto para probar el comportamiento de la promesa
        if (condition) {
            resolve("La condición fue verdadera");
        } else {
            reject("La condición fue falsa");
        }
        });

        promise
        .then(result => {
            console.log(result); // "La condición fue verdadera"
        })
        .catch(error => {
            console.log(error); // "La condición fue falsa"
        });
        ```

2. Ejemplo de una promesa con .then anidados:

        ```javascript
        let promise = new Promise((resolve, reject) => {
            resolve(1);
            });

        promise
        .then(result => {
            console.log(result); // 1
            return result * 2;
        })
        .then(result => {
            console.log(result); // 2
            return result * 2;
        })
        .then(result => {
            console.log(result); // 4
        })
        .catch(error => {
            console.log(error);
        });
        ```

3. Ejemplo de una promesa que se relaciona con un callback:

        ```javascript
        const fs = require('fs');

        function readFilePromise(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err); // si hay un error, rechaza la promesa
            } else {
                resolve(data); // si todo va bien, resuelve la promesa con los datos del archivo
            }
            });
        });
        }

        readFilePromise('example.txt')
        .then(data => {
            console.log(data); // contenido del archivo 'example.txt'
        })
        .catch(error => {
            console.log(error); // error, si ocurre alguno
        });
        ```
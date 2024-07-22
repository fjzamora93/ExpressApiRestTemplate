# Asynchronous JavaScript 

En javascript, a la hora de manejar procesos asyncronous, hay tres formas: await, promises y callbacks. Aunque generalmente vamos a utilizar promesas, vamos a dejar una explicación de cada uno:


### 1. Promesas
Introducidas en ES6, las promesas son una implementación nativa para manejar operaciones asíncronas.
Representan un valor que puede estar disponible ahora, en el futuro o nunca.

Tienen tres estados: pendiente, resuelta (con un valor) o rechazada (con un motivo de error).
Proporcionan una sintaxis más limpia y evitan el anidamiento excesivo de callbacks.


```javascript

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Operación completada después de 2 segundos");
        }, 2000);
    });

    promise.then(result => {
        console.log(result); // Imprime: "Operación completada después de 2 segundos"
    }).catch(error => {
        console.error(error);
    });

```


### 2. Async/await

El código con async/await sería similar, pero en lugar de usar .then() y .catch(), usarías try/catch y await para esperar a que se resuelva la promesa. Aquí está el mismo ejemplo, pero usando async/await.

Podemos ver dos elementos claves en el async/await:

1. async es una palabra clave que se coloca antes de una función para indicar que la función devolverá una promesa.
2. await es una palabra clave que se utiliza dentro de una función async para esperar a que se resuelva una promesa antes de continuar con la ejecución del código. 

Esto hace que el código asíncrono parezca sincrónico, lo que puede hacer que sea más fácil de leer y entender.

```javascript

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Operación completada después de 2 segundos");
        }, 2000);
    });

    async function executePromise() {
        try {
            const result = await promise;
            console.log(result); // Imprime: "Operación completada después de 2 segundos"
        } catch (error) {
            console.error(error);
        }
    }

```


### 3. Callbacks

Los callbacks son funciones que se pasan como argumentos a otras funciones. Se ejecutan después de completar una tarea específica.Comúnmente utilizados en operaciones asíncronas en Node.js y en el manejo de eventos del navegador.
Pueden generar un patrón llamado “callback hell” cuando se anidan demasiado, razón por la que no vamos a usarlos con demasiada frecuencia.
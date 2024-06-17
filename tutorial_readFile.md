# ¿Cómo funciona readFile del paquete 'fs' cuando le metes un CALLBACK?

Comencemos dejando una idea clara: fs.readFile es una función ASÍNCRONA, eso quiere decir que no va a devolver los datos de forma normal ya que necesita un CALLBACK.

Posiblemente readFile con callback sea una de las funciones propias de Node que más rompen los huevos. Comencemos viendo como funcionaría readFile en circunstancias normales (es decir, si no tuviese comportamientos raros):

```javascript

    //! ERROR: ESTA FUNCIÓN ESTÁ MAL PLANTEADA, READFILE NO ADMITE RETURN. 

    const getMiLista = () => {
        const fileContent = fs.readFile('ruta/de/archivo', (err, data) => {
            if (err) {
                return [];
            } else {
                return JSON.parse(data);
            }
        });
    };
/**
 * Ya de entrada hay algo raro... y es que la función como que intenta devolver algo en caso de error, pero no hay un TRY CATCH (obviamente sin TRY.. CATCH no va a funcionar una mierda).
 * 
 * /

```

Y antes de ir a mayores, vamos a analizar el código:

Vamos a analizar el código línea a línea:

**fs.readFile('ruta', (err, data) => {...})**: La primera línea del código nos dice que readFile va a recibir DOS parámetros: una RUTA y el CALLBACK.

**Callback (err, data)**: el callback es una función que sale de la nada y que básicamente va a ver si hay algún error en la lectura o si está todo ok. 

    1. Si hay error, manejaremos el error como queramos (por ejemplo, que devuelva un array vacío, o lo que se te ocurra).

    2. Si no hay error, normalmente guardaremos el resultado de los datos en una constante. 


### ¿Pero por qué no funciona?

Para empezar, *fs.readFile()* introduce un concepto nuevo que se llama 'callback', que es para hacer operaciones asíncronas (tócate los huevos). Vamos, que el servidor no se quede colgado.

¿Entonces cómo lo arreglamos? Bien, necesitamos pasarle un callback que se encargue del return.

```javascript
    const fs = require('fs');

    const getMiLista = cb => {
    fs.readFile('ruta/que/quieras/leer.json', (err, data) => {
        if(err){
            console.log('Primero metes el error', err);
            cb([]);
        } else {
            const contenido = JSON.parse(data);
            console.log('Contenido: ', contenido);
            cb(contenido);
        }
    });
    };

```

### ¿Y con eso ya estaríamos?

Casi, pero en realidad no. Aún falta irnos a nuestros controladores y especificar correctamente cómos e va a renderizar la página.

Al tratarse de una función asíncrona, es lógico que el resultado vendrá después de renderizar la página. Así que no le podemos decir que le vamos a dar una lista -o un contenido- cuando no tenemos ni puta idea de cuándo nos va llegar el contenido.

Para decirle al Express.js que el contenido va a llegar en otro momento, se lo decimos así:

```javascript
    router.get('/ruta/archivo', (req, res, next) => {
        MiClase.metodoDeBusqueda(contenidoAsincrono => {
            res.render('mi-vista', {
                contenidoAsincrono: contenidoAsincrono
            });
        });
    });

```

**Un matiz final**

Hay un pequeño detalle de esta función final. El metodoDeBusqueda (que por definción va a ser uno estático), recibe como parámetro único un callback, eso quiere decir que dentro de la función se está pasando como parámetro otra función completa. Es una sintaxis compleja. No te rayes si no lo terminas de pillar.




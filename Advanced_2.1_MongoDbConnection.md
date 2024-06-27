# Estableciendo una conexión a MongoDb

## Configurando Atlas

Atlas es el servicio en la nube de MongoDB. Antes de conectarnos desde nuestro código, será necesario realizar una correcta configuración de Atlas. Estos son los pasos:

1. MongoDBUsers > 
    crear un nuevo usuario (configurado para Read and Write. Lo podríamos hacer admin, pero no es lo habitual).
2. Security >
    Añadir la Ip actual a las permitidas.
    **NOTA!!** Durante el despliegue, también habrá que incliur la IP del servidor.

3. ConnectToCluster >
    Aquí aparecerá la URL que deberemos usar porsteriormente para establecer la conexión.


## Configurando nuestra APP de Express.js

1. Instalanmos mongodb

    >>npm install --save mongodb

2. Configuración de app.js (establecemos la conexión)

    ```javascript
    //importamos la conexión que hemos configurado antes desde util/database
    const mongoConnect = require('./util/database');

    //establecemos la conexión
    mongoConnect(client => {
        console.log(client);
        app.listen(3000);
    });

    ```

3. Configuación de utils/database (definimos la conexión)

    ```javascript
    const mongodb = require('mongodb');
    const MongoClient = mongodb.MongoClient;

    //Aquí vemos una promise con un callback
    const mongoConnect = callback => {
    MongoClient.connect(
        'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/test?retryWrites=true'
    )
        .then(client => {
        console.log('Connected!');
        callback(client);
        })
        .catch(err => {
        console.log(err);
        });
    };

    module.exports = mongoConnect;

    ```

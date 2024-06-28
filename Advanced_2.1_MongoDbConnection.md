# Estableciendo una conexión a MongoDb

## Configurando Atlas

Atlas es el servicio en la nube de MongoDB. Antes de conectarnos desde nuestro código, será necesario realizar una correcta configuración de Atlas. Estos son los pasos:

(Es posible que los siguientes pasos no funcionen... Igualmente no debe´ria haber mucho obstáculo)

1. MongoDBUsers > 
    crear un nuevo usuario (configurado para Read and Write. Lo podríamos hacer admin, pero no es lo habitual).
2. Security >
    Añadir la Ip a nibgictual a las permitidas.
    **NOTA!!** Durante el despliegue, también habrá que incliur la IP del servidor.

3. ConnectToCluster >
    Aquí aparecerá la URL que deberemos usar porsteriormente para establecer la conexión.


## Configurando nuestra APP de Express.js

1. Instalanmos mongodb

    >>npm install --save mongodb

2. Configuración de app.js (establecemos la conexión y la vamos a dejar abierta)

    ```javascript
    //importamos la conexión que hemos configurado antes desde util/database
    const mongoConnect = require('./util/database').mongoConnect;

    //establecemos la conexión
    mongoConnect(() => {
        app.listen(3000);
    });

    ```

3. Configuación de utils/database (definimos la conexión). Luego en la propia plataforma de Mongo, te facilitan el código que tienes que utilizar, aunque es ligeramente distinto a este de aquí. Es posible que haya que actualizar esta información. De momento, es preferible usar el código que tengo aquí:

    ```javascript

    const mongodb = require('mongodb');
    const MongoClient = mongodb.MongoClient;

    let _db;

    const mongoConnect = callback => {
    MongoClient.connect(
        'mongodb+srv://elgatobarista:CONTRASEÑA@NombreDelCluster.tqgnl5u.mongodb.net/NombreDeLaColeccion?retryWrites=true&w=majority&appName=NombreDelCluster'
        )
        .then(client => {
        console.log('Connected!');
        _db = client.db();
        callback();
        })
        .catch(err => {
        console.log(err);
        throw err;
        });
    };

    const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
    };

    exports.mongoConnect = mongoConnect;
    exports.getDb = getDb;


    ```

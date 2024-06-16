# EXPLICANDO EL DIRECCIONAMIENTO EN EXPRESS

En esta sección vamos a explicar cómo funciona el direccionamiento dentro de nuestra aplicación.

Todo parte de nuestro middle ware que está dentro de app.js. 
Aquí importaremos nuestros manejadores de rutas (admin y shop) y servirán para dar la estructura básica a nuestra web.

```javascript

    //DENTRO DE app.js

        //Creamos las constantes diciendo en qué directorio de la app están
        const adminData = require('./routes/admin');
        const shopRoutes = require('./routes/shop');

        //Y ahora le decimos al middleware que incluya todas las rutas que estén en los archivos asignados
        app.use('/admin', adminData.routes);
        app.use(shopRoutes);
    
    //DENTRO DE shop.js o admin.js

        //Pero en realidad, el paso anterior solamente es posible porque nosotros ya habíamos hecho las EPORTACIONES correspondientes dentro de shop y de admin. Estas exportaciones están en la última línea y quedaban así:

        exports.routes = router;
        exports.products = products;

        //En el caso de shop, exportamos el router de esta otra forma:

        module.exports = router;

        //Por lo que al quedar exportado directamente, también se accede al router directamente (sin tener que especificar shop.router, como con admin)

```

### Get, use y post

El siguiente punto sucederá cuando decidamos utilizar el get, use o post en nuestros Manejadores de Rutas (Route Handlers).


```javascript

        router.get('/ruta-pagina-web', (req, res, next) => { //La ruta a la que se refiere
            res.render('nombre-vista', { //El nombre de la vista con la que se responde
                variable1: 'valor1', 
                variable2 : 'valor2',
                variable3 : 'valor3'
            });
        });

```

1. Lo que haya después del get/use/post es la ruta de la web a la que va a afectar (podemos poner lo que queramos).

2. Lo que hay después del res.redirect/render/senFile es la VISTA a la que nos va a dirigir.


### VIEWS

En este punto, cabría preguntarse, ¿y cómo sabe la APP que tiene que ir a la carpeta VISTAS?

Bien, esto aparecía en la configuración original de nuestra app.js, donde indicamos lo siguiente:

```javascript

    app.set('view engine', 'ejs');
    app.set('views', 'views');
    
```


### Separando routes y controllers

Idealmente lo que a nosotros nos interesa es separar la parte lógica, de la gestión de las vistas. 
Para ello, tendremos un nuevo directorio llamado controllers donde incorporaremos toda la parte lógica.

Mientras que en routes, únicamente nos encargaremos de decir qué controlador se activa ante cada ruta.
Vamos a verlo detenidamente:

Veamos mejor con un ejemplo:

    ```javascript
    
        //Nos encontramos en el archivo controller/miControlador.js

        //Por convención, le vamos a poner get/post + nombre de la vista a la que se refiera el controlador o que quiera renderizar.
        exports.getNombreVista(req, res, next) => {
            const condicion = false;
            let valor1 = condicion === true ? 'si' : 'no'; //en este caso la variable1 vale 'no'
            res.render('ruta/vista', {
                variable1: valor1,
                variable2: 'valor2',
                variable3: 100
            });
        };

        exports.postNombreVistaConFormulario(req, res, next) => {
            const campoFormulario = req.body.campoFormulario;
            const otroCampo = req.body.otroCampo;
            res.redirect('ruta/redirección')
        }

        //Como podemos comprobar, aquí estamos toda una lógica detrás de un control, que se activará cuando se acceda a la ruta indicada. 
        //Pero para indicar qué ruta va a llamar a este controlador, tendremos que irnos a nuestro directorio routes.

        //Nos encontramos en el archivo routes/shop.js

        const micontrolador = require('controller/miControlador');
        const router = express.Router();

        router.get('ruta/que/queramos', miControlador.getNombreVista);
        router.post('ruta/que/tenga/el/form', miControlador.postNombreVistaConFormulario);

    ```

### Models y Data

Dentro de models podremos incluir todas las clases o modelos que queramos incluir en nuestra aplicación.

Por su parte, dentro de data podemos incluir nuestra lógica para  almacenar contenido (por ejemplo, un JSON).

En este punto de la aplicación, se utiliza un callback asíncrono donde nuestra clase product utiliza los métodos getProduct y save,
para llamar a nuestro fichero json y aplicar los cambios pertinentes.

Puesto que esta relación es asíncrona, utiliza una sintaxis bastante peculiar que en este momento no vamos a explicar.
Vamos a esperar a que se expliquen las promesas (promises) que simplifican en gran medida este uso.




```javascript


```






```javascript


```
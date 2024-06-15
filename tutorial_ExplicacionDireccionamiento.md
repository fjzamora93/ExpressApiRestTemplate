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

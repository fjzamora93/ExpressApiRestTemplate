# Sesiones: Login y SignUp

En este bloque vamos a ver en profundidad todo lo relacionado con el manejo de las sesiones de usuario (registrarse, logearse y que los datos de la sesión permanezcan).
Para ello, seguiremos los siguientes pasos:

**NOTA** Puesto que son muchos componentes por separado, lo ideal es observar el código en su conjunto para ver cómo queda todo integrado.



## 1. Configurando el middleware de sesión 

Aquí pondremos la configuración de app.js para las sesiones

    >>npm install express-session

```javascript
    //APP.JS
    const session = require('express-session');

    app.use(
        session({
            secret: 'my secret',
            resave: false,
            saveUninitialized: false,
            store: store // en este caso (y como veremos abajo) se están almacenando los datos de sesión en MongoDB.
        })
    );


```

## 2. Conectando con las sesiones de MongoDBStore

El siguiente paso es decidir dónde y de qué manera vamos a guardarlos datos de las sesiones. 
En este caso, vamos a guardar los datos en MongoDB, que tiene su propio módulo para poder hacerlo.

    >>npm install connect-mongodb-session
```javascript
    const MongoDBStore = require('connect-mongodb-session')(session);

    //Nuesatra URL para conectarnos
    const MONGODB_URI =
        'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/shop';


    //Creamos una nueva instancia para almacenar las sesiones de los usuarios
    const store = new MongoDBStore({
        uri: MONGODB_URI,
        collection: 'sessions'
    });


```


## 3. Encriptando la contraseña (bcript)

>>npm install bcryptjs

Al guardar las contraseñas en MongoDB, no queremos que cualquier persona con acceso a la base de datos pueda acceder a las contraseñas. Para ello, será necesario hashearlas.
    
```javascript

    //EN EL MÉTODO CONTROLLER QUE VAYA A GESTIONAR LAS CONTRASEÑAS
    const bcrypt = require('bcryptjs');

    //PARA EL SIGNUP (POST): almacena la contraseña hasheada
    exports.postSignup = (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        User.findOne({ email: email })
            .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'E-Mail exists already, please pick a different one.');
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: { items: [] }
                });
                return user.save();
                })
                .then(result => {
                res.redirect('/login');
                });
            })
            .catch(err => {
            console.log(err);
            });
        };

    //PARA EL LOGIN (POST): Compara que el hash coincide
    exports.postLogin = (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        User.findOne({ email: email })
            .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                    });
                }
                req.flash('error', 'Invalid email or password.');
                res.redirect('/login');
                })
                .catch(err => {
                console.log(err);
                res.redirect('/login');
                });
            })
            .catch(err => console.log(err));
        };


```


## 4. Creando un middleware para comprobar si el usuario está autentificado

Creamos un directorio middleware -> is.auth.js 
En este archivo devolveremos un booleano para redirigir a los uaurios que NO estén autentificado.

¿Recuerdas cómo funcionanban los next? El objetivo es que pase por este middleware antes de que entre en la sesión directamente.

```javascript
    //middleware >> is-auth.js
    module.exports = (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return res.redirect('/login');
        }
        next();
}
```

Además, crearemos un controllers >> auth.js, donde tendremos todos los controllers de autentificación (login, signup, logout), con sus respectivos POST y GET (punto anterior).




## 6. Optimizando las rutas para las sesiones

Se podría perfectamente implementar el req.session en cada controlador donde necesitemos datos de sesión (y siempre podríamos estar comprobando si la condición se cumple o no).
Pero puesto que es un código poco eficiente, vamos a optimizar la gestión de rutas para que se encarguen de desviar el tráfico de forma más automática.

Entonces, cada vez que queramos PROTEGER una vista, le daremos un tercer parámetro: isAuth.
Recordamos que isAuth es el middleware que hemos creado hace un momento para verificar if isLoggedIn.

Si NO se cumple esa condición, se redirigirá hacia la ruta de /login.
De otra manera, se aplicará el NEXT.

```javascript
    const isAuth = require('../middleware/is-auth');

    router.get('/add-product', isAuth, adminController.getAddProduct);
    router.get('/products', isAuth, adminController.getProducts);
    router.post('/add-product', isAuth, adminController.postAddProduct);
    router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
    router.post('/edit-product', isAuth, adminController.postEditProduct);
    router.post('/delete-product', isAuth, adminController.postDeleteProduct);

    module.exports = router;
```



## 7. Tokenizando con CSRF 

    >>npm install csurf

`res.locals` es un objeto en Express.js que contiene variables de respuesta locales. Estas variables son específicas de la solicitud y estarán disponibles para la vista que se está renderizando.

En este caso, `res.locals.isAuthenticated` y `res.locals.csrfToken` se están utilizando para pasar datos a la vista, que como en este caso es la propia APP, estarán disponibles en todas las vistas.

```javascript
    //APP.JS
    const csrf = require('csurf');

    const csrfProtection = csrf();

    app.use(csrfProtection);
    app.use((req, res, next) => {
        res.locals.isAuthenticated = req.session.isLoggedIn;
        res.locals.csrfToken = req.csrfToken();
    next();
    });

```
Ahora que hemos implementado el csrf, cada formulario deberá estar tokenizado.

Básicamente, cada formulario debería incorporar este código:

```html

    <form>
        <!-- Distintos campos del formulario-->
        <input type="hidden" name="_csrf" value="<%= csrfToken %>">
        <button class="btn" type="submit">Login</button>
    </form>

```


## 8. connect-flash: creando mensajes de aviso

>> npm install connect-flash

connect-flash es un middleware para Express.js que se utiliza para mostrar mensajes flash. 
Los mensajes flash son mensajes almacenados en la sesión, que se eliminan después de ser mostrados al usuario. 
Son útiles para mostrar información de una sola vez, como mensajes de éxito o error después de una acción del usuario.

```javascript
    //APP.JS: Con estas dos líneas ya podremos implementar nuestros mensajes con el req.flash
    const flash = require('connect-flash');
    app.use(flash());

    //CONTROLLERS: vamos a nuestro controller para implementar el mensaje.

    exports.postLogin = (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        User.findOne({ email: email })
            .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.'); //Los mensajes se crean como una clave-valor. Luego podremos acceder al mensaje llamando a su clave.
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                    });
                }
                req.flash('error', 'Invalid email or password.'); 
                res.redirect('/login');
                })
                .catch(err => {
                console.log(err);
                res.redirect('/login');
                });
            })
            .catch(err => console.log(err));
    };

```

En cualquier momento del código, podemos acceder a nuestro error. Los errores funcionan como clave-valor:

```javascript
    exports.getLogin = (req, res, next) => {
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: message
        });
    };
```

*Nota*: Los mensajes de flash, cuando están vacíos, siguen siendo un array. Así que en caso de que no queremos que aparezca, será necesario comprobar que la longitud del array es mayor que 0. De cualquier otra forma, el mensaje seguirá apareciendo en pantalla (aunque en este caso sería una cadena de texto que no tendría nada).
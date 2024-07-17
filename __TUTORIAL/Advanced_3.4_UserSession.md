# Sesiones: Login y SignUp

En este bloque vamos a ver en profundidad todo lo relacionado con el manejo de las sesiones de usuario (registrarse, logearse y que los datos de la sesión permanezcan).
Para ello, seguiremos los siguientes pasos:

**NOTA** Puesto que son muchos componentes por separado, lo ideal es observar el código en su conjunto para ver cómo queda todo integrado.

## Estructura base para manejar las sesiones

controllers
    |_auth.js -> el controller que se encarga de gestionar el login, logout y SignUp. Trabajarán con bcrypt para hashear las contraseñas.
middleware
    |_is-auth.js -> Un middleware cuya única función es redirigir el tráfico hacia el login si se requiere estar registrado. De lo contrario, Next.
models
    |_user.js -> El modelo de user habitual. Sin modificaciones de ningún tipo. 
routes
    |_auth.js -> Las rutas para las vistas de login y signup
    |_lasDemasRutas -> ahora deben incluir como segundo parámetro el middleware de isAuth (importado previamente) si las queremos proteger.
views
    |_auth -> Vistas para los formularios de login y signup
app.js
    |_ Casi todos los cambios los vamos a encontrar aquí, donde empezaremos a trabajar con los siguientes módulso:
        -express-session (para manejar las sesiones)
        -MongoDBStore (para almacenar los datos de sesion)
        -csrf (por seguridad)
        -flash (para mensajes informativos)



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




## 5. Optimizando las rutas para las sesiones

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
## 5. Proteger cada vista de forma individual

El último paso será ir vista por vista comprobando el booleano isAuthenticated añadiendo bloques de <% if (isAuthenticated) { %>

Puest que isAutehticated es una VARIBLE LOCAL, que ya configuramos para que estuviese disponible en todas la aplicación, no tendremos ningún problema en utilizarlo.

```html
    <% if (!isAuthenticated) { %> 
        <div style="background-color: red; margin:auto"> NO REGISTRADO </div>
    <% } else { %>
        <div style="background-color: green; margin:auto"> REGISTRADO </div>
    <% } %>
```



## CÓDIGO COMPLETO

El código completo de app.js se vería así:

```javascript
    const mongoose = require('mongoose');
    const User = require('./models/user');
    const errorController = require('./controllers/error');

    const path = require('path');
    const bodyParser = require('body-parser');

    const express = require('express');

    //MANEJO DE SESIONES (express-session + MongoDBsTORE + csrf + flash)
    const session = require('express-session');
    const MongoDBStore = require('connect-mongodb-session')(session);
    const csrf = require('csurf');
    const flash = require('connect-flash');

    const MONGODB_URI =
    'mongodb+srv://usuario:contraseña@cluster.tqgnl5u.mongodb.net/baseDeDatos?retryWrites=true&w=majority&appName=cluster';

    const app = express();
    const store = new MongoDBStore({
        uri: MONGODB_URI,
        collection: 'sessions'
    });
    const csrfProtection = csrf();


    //GESTOR DE VISTAS
    app.set('view engine', 'ejs')
    app.set('views', 'views');


    //IMPORTACIÓN DE LAS RUTAS
    const adminRoutes = require('./routes/admin')
    const recipeRoutes = require('./routes/user')
    const authRoutes = require('./routes/auth');

    app.use(bodyParser.urlencoded({ extended:true }));
    app.use(express.static(path.join(__dirname, 'public')));


    //PASO 1: CONFIGURACIÓN DEL MIDDLEWARE DE SESIÓN
    app.use(
        session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
        })
    );
    app.use(csrfProtection);
    app.use(flash());


    //PASO 2: Devolver al usuario AUTENTIFICADO EN NUESTRO REQ (si no lo está, se aplica el NEXT)
    app.use((req, res, next) => {
        if (!req.session.user) {
            return next();
        }
        User.findById(req.session.user._id)
            .then(user => {
            req.user = user; //Aquí es donde se devuelve al usuario
            next();
            })
            .catch(err => console.log(err));
    });

    //PASO 3: Establecemos variables LOCALES que podrán ser accesibles desde las VISTAS
    app.use((req, res, next) => {
        res.locals.isAuthenticated = req.session.isLoggedIn; //Ahora esta variable es accesible desde la vista (en el controller auth>login -> req.session.isLoogedIn se pondrá en TRUE)
        //Por las misma razón en el controller auth>logout, se va aplica destroy() sobre cualquier dato de la sesión.
        res.locals.csrfToken = req.csrfToken();
        next();
    });

    //
    app.use('/', recipeRoutes);
    app.use('/admin', adminRoutes);
    app.use(authRoutes);

    app.use(errorController.get404);


    //Conexión a la base de datos
    mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

```
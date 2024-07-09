# CSRF y Tokenización

Instalación:

    >>npm install csrf

CSRF es el módulo que permitirá tokenizar los formularios de la página web y añadirá un nuevo nivel de seguridad para evitar cualquier tipo de hackeo al usuario. Para usarlo, bastará con seguir los siguietnes pasos:

1. Importar CSRF : const csrf = require('csurf');
2. Utilizar CSRF como una variable LOCAL para que esté en todas las vistas.
3. Incluir el token de CSRF en las vistas para asegurar los formularios: <input type="hidden" name="_csrf" value="<%= csrfToken %>">


`res.locals` es un objeto en Express.js que contiene variables de respuesta locales. Estas variables son específicas de la solicitud y estarán disponibles para la vista que se está renderizando.
En este caso, `res.locals.isAuthenticated` y `res.locals.csrfToken` se están utilizando para pasar datos a la vista, que como en este caso es la propia APP, estarán disponibles en todas las vistas.

Aquí vemos cómo quedaría:

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
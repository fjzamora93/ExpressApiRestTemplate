# connect-flash: creando mensajes de aviso


Instalación:

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
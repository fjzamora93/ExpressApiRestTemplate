# Validation

En este punto vamos a ver cómo se realiza la validación desde el backend de la aplicación.
Vamos a utilizar express-validator CHECK, del cuál vamos a traer check y body.

Básicamente, para realizar la validación tocaremos las rutas y un poco los controllers:

Comenzaremos instalando el paquete:
>> npm install --save express-validator

1. Importaremos el módulo para poder validar:
    En nuestras rutas importaremos esto: 
    >> const { body } = require('express-validator'); 

    En nuestros controllers importaremos esto:
    >> const { validationResult } = require('express-validator');


2. Dentro de nuestra rutas, añadir un ARRAY con todos los requisitos de VALIDACIÓN a la RUTA. Básicamente es decirle a cada campo del formulario cómo se debe comportar. 


3. Al haber añadido la validación a las rutas, ahora se podrán generar errores que utilizaremos en nuestro controller para realizar la validación. Así que ahora iremos a los controllers a configurarlos correctamente. Añadir una nueva constante a cada CONTROLLER que requiera VALIDACIÓN. Esta constante será algo así:

    const errors = validationResult(req);

4. El siguiente paso dentro de nuestro CONTROLLER es verificar si errors, que es un array, está vacío o no lo está. En caso de que no esté vacío, quiere decir que vamos a arrojar algún error, por lo que pasaremos un estado de error res.status(422) y renderizaremos la vista pero con información extra:

    hasError: true
    errorMessage: errors.array()

5. Template HTML. Una vez completados estos pasos dentro de los controllers, podemos ir directamente a nuestra plantilla HTML a incluir las modificaciones pertinentes:

    a. Recuperaremos los datos rellenados anteriormente por el usuario, así que añadimos la condición de si se está editando o si existe un error (booleano que definimos anteriormente).

        value="<% if (editing || hasError) { %><%= item.valor %> <% } %>"

    b. Mostraremos en pantalla el error, en caso de existir:

        <% if (errorMessage) { %>
            <% errorMessage.forEach(function(error) { %>
              <div class="user-message user-message--error"><%= error.msg %></div>
            <% }); %>
        <% } %>
    
    c. Asignamos una clase para e.path. Opcionalmente, y para mejorar la experiencia de usuario, podemos definir una clase de CSS con el tipo de error. En este caso estaríamos buscando que el e.path sea el name, pero en la versión de Udemy se busca con e.param. 

        class="<%= validationErrors.find(e => e.path === 'nombre-del-campo') ? 'invalid' : '' %>"

    En este código asignaremos una clase cuando busque un error. Si el path (que es el campo del formulario, el name) aparece en el error, se asignará la clase 'invalid', que posteriormente podremos definir dentro de nuestro CSS. De cualquier otro modo, no habrá ninguna clase.

## Modificación de la ruta

```javascript

    //En las últimas versiones lo podemos requerir directamente, sin incluir el /check
    const { check, body } = require('express-validator');


    router.post(
    '/signup',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject(
                'E-Mail exists already, please pick a different one.'
                );
            }
            });
        })
        .normalizeEmail(),
        body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
        )
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
            }
            return true;
        })
    ],
    authController.postSignup
    );

```

Además, es una buena práctica limpiar el código poniéndolo en minúsculas, quitando espacios (trim), etc.


## Modificación de los controllers

Aunque no es estrictamente necesario, modificaremos los controllers para dar cierta información al usuario sobre por qué ha fallado el envío del formulario. Dentro de este punto habrá que hacer varias implementaciones:

a. Mostrar en pantalla un mensaje con el tipo de error (se lo pasamos como un parámetro al controlller).
b. Guardar la información que ya ha enviado el usuario anteriormente y que el value del formulario tome la información que rellenó anteriormente para que pueda corregirlla.

```javascript

    exports.postSignup = (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
            });
        }

        bcrypt
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
            // return transporter.sendMail({
            //   to: email,
            //   from: 'shop@node-complete.com',
            //   subject: 'Signup succeeded!',
            //   html: '<h1>You successfully signed up!</h1>'
            // });
            })
            .catch(err => {
            console.log(err);
            });
        };

```

## Modificación del HTML

Dentro del HTML, deberemos añadir a cada campo del formulario el value="" correspondiente a aquello que ya se haya rellenado anteriormente en caso de que algo saliese mal y se redirigiese a la misma página.


Eso quiere decir que cuando se accede a una página de forma normal, con el GET, será necesario pasar estos mismos parámetros aunque en este caso estarán vacíos, simplementa para que no de error la página.

```html
    <% if (errorMessage) { %>
            <div class="user-message user-message--error"><%= errorMessage %></div>
        <% } %>
        <form class="product-form" action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>" method="POST">
            <div class="form-control">
                <label for="title">Title</label>
                <input 
                    class="<%= validationErrors.find(e => e.path === 'title') ? 'invalid' : '' %>"
                    type="text" 
                    name="title" 
                    id="title" 
                    value="<% if (editing || hasError) { %><%= product.title %><% } %>">
            </div>


```

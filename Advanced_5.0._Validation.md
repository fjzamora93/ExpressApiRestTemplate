# Validation

En este punto vamos a ver cómo se realiza la validación desde el backend de la aplicación.
Vamos a utilizar express-validator CHECK, del cuál vamos a traer check y body.

Básicamente, para realizar la validación tocaremos las rutas y un poco los controllers:

1. Añadir un ARRAY con todos los requisitos de VALIDACIÓN a la RUTA.

Routes >> rutas post
    Aquí modificaremos la ruta para añadir a aquellas routes de POST todas las validaciones que queramos hacer. Básicamente crearemos un ARRAY con todas las condiciones que deben cumplir cada uno de los campos del formulario del body. Tal que así:

>>npm install --save express-validator
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


2. Modificación de los controllers

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

3. Modificación del HTML

Dentro del HTML, deberemos añadir a cada campo del formulario el value="" correspondiente a aquello que ya se haya rellenado anteriormente en caso de que algo saliese mal y se redirigiese a la misma página.


Eso quiere decir que cuando se accede a una página de forma normal, con el GET, será necesario pasar estos mismos parámetros aunque en este caso estarán vacíos, simplementa para que no de error la página.
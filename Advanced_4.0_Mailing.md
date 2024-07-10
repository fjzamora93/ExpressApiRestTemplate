# Envío de mensajes

Normalmente nunca vamos a utilizar un servidor propio para enviar mensajes, ya que es algo complejo, costoso y que requiere mucha seguridad.
En su lugar, vamos a usar un servicio de un tercero.

En este caso, vamos a trabajar con SendGrid, que tiene un plan gratuito.


## Instalación

>npm install nodemailer nodemailer-sendgrid-transport

Con ese paquete podremos empezar a gestionar los emails dentro de node.

## Uso

Desde nuestro controller auth.js vamos a gestionarlo todo.
Únicamente vamos a modificar el código de auth.js para trabajar con los mails.

Importamos nodemailer = requiere('nodemailer');
const sendgridTransport = requiere('nodemailer-sendgrid-transport')

```javascript
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: // aquí insertar el código de la página web entre comillas 'SG.irOLRZ...'
  }
}));

```

Acto seguido, debemos incluir el código de que enviará un email. Por lo general, este email se enviará al momento del SignUp, aunque podemos incluir el envío el email en cualquier otro momento cuando creamos oportuno.
Recuerda incluir este código dentro de un .then()

```javascript
transporter.sendMail({
  to: 'recipient@example.com',
  from: 'sender@example.com',
  subject: 'Test Email',
  text: 'This is a test email from nodemailer and SendGrid.',
  html: '<h1>This is a test email from nodemailer and SendGrid.</h1>'
});

```

Si está dentro de una promesa, quedaría así:

```javascript
.then(result =>{
    res.redirect('/login'); //IMPORTANTE REDIRIGIR ANTES DE ENVIAR EL EMAIL, PARA EVITAR QUE SE QUEDE ATASCADO EL TRÁFICO
    return transporter.sendMail({
        to: 'recipient@example.com',
        from: 'sender@example.com',
        subject: 'Test Email',
        text: 'This is a test email from nodemailer and SendGrid.',
        html: '<h1>This is a test email from nodemailer and SendGrid.</h1>'
    });  
})
.catch(err=> console.log(err))

```

Es importante que se redirija antes de que se envíe el email. En una APP pequeña esto no es un problema, pero en aplicaciones grandes puede ralentizarse el tráfico si esperamos a que mande el email y luego redirija.
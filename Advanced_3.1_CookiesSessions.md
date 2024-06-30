# Sesiones y cookies

## ¿Qué es una cookie?

Tenemos que tener en cuenta que las cookies se guardan dentro del navegador del usuario, eso hace que se puedan MANIPULAR. Por lo tanto nunca vamos a guardar datos sensibles en el navegador.

Sí que podríamos almacenar datos que queramos pasar de un lugar a otro de la web y que no comprometan la seguridad. 

    res.setHeader('Set-Cookie', 'loggedIn=True');

Donde Set-Cookie es una palabra reservada y el segundo parámetro es la pareja de clave-valor que queramos guardar. Posteriormente, podremos recuperar esta información así:

    const isLoogedIn = req.get('cookie');

Pero como decíamos, esta no es la forma habitual de usar las cookies. Ya que son manipulables.

## ¿Cómo utilizar las cookies de forma segura?

Básicamente tenemos que hashearlas y almacenarlas en una base de datos del servidor. Así de simple.

1. Guardarlas como session con un hash

    >>npm install express-session

    Y dentro de app.js podremos meter la session configurada -consultar doc.

2. Guardarlas en la base de datos, como MongoDB.

    >>npm install connect-mongodb-session

### CONTINUAR CON LA CLASE AQUÍ
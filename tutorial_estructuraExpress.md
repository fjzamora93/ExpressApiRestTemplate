# 1. Estructura de directorios de Express.js

PROYECTO
|_node_modules
|    |_Toda la movida de módulos, se genera automático.
|
|_public (los static de django)
|   |_css
|   |_img / assets 
|
|_routes
|_util
|_views
    |_includes (las plantillas para ejs)      
    |_layout (para pug o hbs, no los vamos a usar)
    cada página en formato .ejs, con su código.

app.js
package-lock.json
package.json


# 2. Autogenerar un proyecto

Sin embargo, para facilitar la creación de un proyecto se pueden utilizarse los siguientes comandos:

```
    npm install -g express-generator //instalación global
    express myapp
    cd myapp
    npm install //  y desde aquí instalar dependencias
```

Estos comandos generarán esta estructura: 

myapp/
├── bin/
│   └── www
|__controllers
|   |__ toda la parte lógica
|__models
|   |__ los modelos que vayamos a usar para almacenar datos
|__data
|   |__ aquí almacenaríamos los datos (al menos provisionalmente)
├── public/
│   ├── images/
│   ├── javascripts/
│   └── stylesheets/
├── routes/
│   ├── index.js
│   └── users.js
├── views/
│   ├── error.jade
│   ├── index.jade
│   └── layout.jade
├── app.js
├── package.json
└── README.md

# Subiendo archivos

La subida de todo tipo de archivos requiere de un tratamiento especial. Para empezar, estos archivos no se pueden subir directamente a la base de datos, ya que son demasiado pesados. Y por otro lado tenemos que entender que estos archivos deben convertirse a un formato inteligible.

A continuación vamos a ver los pasos que hay que seguir en la subida de archivos:

## 1. Instalación del paquete

>>npm install --save multer

Multer es el módulo con el que vamos a trabajar a la hora de subir archivos a nuestra página web.


## 2. Modificación de las vistas

Todos los campos que sean referidos a subida de archivos deberán tener un tipo de encriptado en concreto (en el formulario) y nos aseguramos de que el input del objeto sea el correcto.


```html

<!--- Añadimos un nuevo tipo de encriptado a nuestro formulario para decirle que  habrá un remezcladillo--->
    <form class="product-form" 
        action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>" 
        method="POST" 
        enctype="multipart/form-data">

<!--- Especificamos el tipo de input para imagen --->
    <div class="form-control">
        <label for="image">Image</label>
        <input 
            type="file" 
            name="image" 
            id="image" >
    </div>

```


## 3. Modificación de app.js

Importamos los módulos que nos interesan para procesar los archivos (multer)

```javascript

    const multer = require('multer');

/*FILESTORAGE es un objeto de configuración para multer.diskStorage, que determina cómo se almacenan los archivos cargados. 
En este caso, los archivos se guardarán en el directorio 'images' y el nombre del archivo se generará a partir de la fecha y hora actuales, seguidas del nombre original del archivo. **/

    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images');
        },
        filename: (req, file, cb) => {
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    });

/* fileFilter: Esta es una función que multer utiliza para filtrar qué archivos se deben aceptar. En este caso, solo se aceptarán archivos con los tipos MIME 'image/png', 'image/jpg' y 'image/jpeg'. **/

    const fileFilter = (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };


/* app.use(...): Aquí se está utilizando multer como middleware en la aplicación Express.js. Se configura para usar el almacenamiento y el filtro de archivos definidos anteriormente, y se espera que el archivo cargado se envíe como parte de un campo llamado 'image' en la solicitud **/

    app.use(multer({ 
        storage: fileStorage, 
        fileFilter: fileFilter 
        }).single('image')
    );


//Servimos las imágenes de manera estática para que la ruta sea accesible por el cliente

    app.use('/images', express.static(path.join(__dirname, 'images')));

```


## 4. Modificar el controller para que procese las imágenes

Dentro del controller, utilizaremos una nueva constante con req.file.

req.file es el middleware que se encargaría de manejar la subida de archivos y que configuramos previamente desde nuestra app.js.


```javascript
    exports.postAddRecipe = (req, res, next) =>{
        const nombre = req.body.nombre;
        const description = req.body.description;
        const image = req.file; // aquí hacemos directamente req.file
```


A partir de aquí, simplemente será necesario implementar la lógica de lo que queramos hacer con el archivo subido.
Por ejemplo, lo más común es que queramos guardar en la base de datos la ruta estática del archivo subido. 
Para ello, bastará con que asignemos a nuestro item.imageUrl, el valor del path.

Tal que así:

item.imageUrl = image.path;

Esta operación será necesaria en el POST de añadir un nuevo objeto o al modificar uno ya existente.

```javascript

const myItem = new Item({
        nombre : nombre, 
        descripcion : descripcion,
        image : image.path
    });

```
Todavía cabría esperar que se realizasen un par de consideraciones adicionales. Por ejemplo, 
¿qué hacemos en caso de que no se añada la imagen?, ¿es obligatorio subir un archivo?

¿En el caso de editar una imagen que ya tenía una previamente, cómo lo hacemos para mantener la antigua si no hay ninguna?

Para ello, podemos escribir el siguiente código:

```javascript
    console.log(image.path);
        if (image) {
            if (recipe.image) {
                fileHelper.deleteFile(recipe.image);
            }
            recipe.image = image.path;
        }
        return recipe.save().then(result => {
            console.log('actulización', result);
            res.redirect('/');
        });
```

## 5. Actualizar las rutas absolutas de la plantilla

Como paso final, habrá que actualizar las rutas absolutas de toda la plantilla.
Para ello, será suficiente con añadir una / delante de cada url de imagen. De esta forma estaremos diciendo que busque desde la raíz allí donde hayamos indicado.

```html

    <img src="/<%= item.image %>" alt="alt de la imagen?">

```

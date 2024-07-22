# Manejando PDFs

En caso de que queramos permitir subida y bajada de PDFs por parte del usuario, lo haremos a través de MULTER.
En este caso, bastará con añadir una línea más de código en la que indiquemos que también se pueden utilizar PDFs.

```javascript
    const fileFilter = (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'application/pdf'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };
```

# Convirtiendo el DOM a PDF

Para ello, utilizaremos el  módulo de pdfkit, para lo cuál será necesario tenerlo instalado:

    >>npm install pdf-lib pdfkit

Una vez instalado, bastará con modificar dos archivos:
1. Crear un router + controller en el que se maneje la creación de pdfs.
2. Actualizar el app.js para incluir dicho router (sin más)

## Modificación (o creación) del router + controller

Para este ejemplo, hemos decidido recuperar el modelo directamente desde la base de datos. Es decir, hemos pasado la ID del item como un parámetro al router y desde ahí lo buscamos en nuestra base de datos para convertir los campos que nos interesen a PDF.

Una segunda opción, sería enviar los datos desde un FORMULARIO que podría ser recuperado, aunque esta opción es más compleja que obtenerlos directamente desde la base de datos utilizando el findById().

```javascript

    const express = require('express');
    const PDFDocument = require('pdfkit');
    const Recipe = require('../models/recipe');  
    const router = express.Router();

    router.get('/generate-pdf/:recipeId', (req, res, next) => {
        const recipeId = req.params.recipeId;

        Recipe.findById(recipeId)
            .then(receta => {
            if (!receta) {
                return res.status(404).send('Recipe not found');
            }

            const doc = new PDFDocument();

            // Configura la cabecera de respuesta para descargar el PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${receta.nombre}.pdf`);

            // Envía el PDF como respuesta
            doc.pipe(res);

            // Agrega contenido al PDF
            doc.fontSize(25).text(receta.nombre, {
                align: 'center'
            });

            doc.moveDown();
            doc.fontSize(18).text('Descripción:');
            doc.fontSize(14).text(receta.descripcion);

            doc.moveDown();
            doc.fontSize(18).text('Ingredientes:');
            receta.ingredientes.forEach(ingrediente => {
                doc.fontSize(14).text(`- ${ingrediente}`);
            });

            //Agrega la imagen al PDF al final para que no se superponga
            const imagePath = path.join(__dirname, '..', receta.image);
            doc.image(imagePath, {
                fit: [500, 400],
                align: 'center',
                valign: 'center'
            });

            // Finaliza el documento
            doc.end();
            })
            .catch(err => next(err));
        });



module.exports = router;

```
Dentro de app.js quedaría así:

```javascript
    const pdfRoutes = require('./routes/pdf');

    // ...

    app.use(pdfRoutes);
```

# Recuperando datos de una página (mi/ruta/:id)

La sintaxis para recuperar datos desde el html para pasarlos al controlador es muy sencilla:

Básicamente conssite en poner dos puntos delante de la variable (o el dato) que queramos recuperar,
suponiendo que el documento html previamente ya nos esté redirigiendo a un enlace que contenga esa información.

Por ejemplo:
```html
    <a href="/admin/edit/<%= objeto.id %>">Botón para redireccionar</a>
```

Esto os llevará a una ruta, que al mismo tiempo llamará a un controlador, qu etendrá esta forma:

```javascript

router.get('/ruta/:id', (req, res, next) => {
    const idRecuperada = req.params.recetaId; 
    res.render('edit-recipe' , {
            id : idRecuperada
        });
    });

```

Cabría añadir que si estamos utilizando esta misma ID para recuperar un objeto, deberemos llamar al método correspondiente de nuestro modelo para que la información se recupere correctamente.

## Recuperando otros parámetros

Hasta ahora hemos visto cómo recuperar parámetros relacionados con el objeto que estamos trabajando.

Pero también nosotros podemos insertar nuestros propias parámetros del html, como cuando vemos rutas
con esta estructura:

    http://url/?edit=true&parametro=false

La recuperación de estos parámetros tiene varias fases (por un lado en nuestra vista de origen, por otro lado en nuestro controlador, y finalmente verificando que están insertados estos parámetros en la siguiente vista a la que se esté redirigiendo).

### Insertando el parámetro en la URL de nuestra vista de origen (a href)

Como vemos a continuación, en nuestro enlace o formulario de origen, vamos a incluir varios parámetros.
El primero efectivamente es un atributo de nuestro objeto, pero el otro lo hemos insertado manualmente.

Los podemos encadenar con el símbolo ampersán &.

<a href="/admin/edit-product/<%= product._id %>?edit=true" class="btn">Edit</a>


### Recuperando el parámetro desde nuestro controlador

Esta es la parte más sencilla, simplemente tenemos que encargarnos 

```javascript
    const nombre = req.query.nombreParametro;
    const editMode = req.query.edit;
```

Sea lo que hubiese en el link de la vista de origen, lo podremos recuperar como un parámetro.


### Incluyendo una veficación en nuestra vista de destino para comprobar el parámetro

Finalmente, esta información la podremos usar perfectamente en la vista que estemos renderizando.

```javascript

    <form action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>" method="POST">

 ```

 Por ejemplo, aquí estamos diciendo que dependiendo de si 'editing' está en true o false, 
 la acción será una u otra. Esto es extremadamente conveniente para pasar información.
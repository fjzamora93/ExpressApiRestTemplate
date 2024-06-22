# Recuperando datos de una página

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
    const idRecuperada = parseInt(req.params.id);
    res.render('edit-recipe' , {
            id : idRecuperada
        });
    });

```

Cabría añadir que si estamos utilizando esta misma ID para recuperar un objeto, deberemos llamar al método correspondiente de nuestro modelo para que la información se recupere correctamente.
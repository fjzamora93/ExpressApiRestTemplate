# ERRORES HABITUALES USANDO NODE Y EXPRESS

A la hora de establecer los middleware, es importante recordar que, salvo que haya un next, el servidor va a quedarse con la primera página que encuentre. Si estás utilizando un 'use', y alguna página encaja con ese 'use' (donde la ruta no tiene que ser exacta), no va a seguir buscando en el resto de rutas, aunque las sucesivas encagen exactamente con el get.


```javascript
    //Poner el use SIEMPRE al final
    app.use('/', (req, res, next) => {
        console.log(recetasJSON)
        res.render('index', {
            recetas: recetasJSON
        });
    })
```
# Conceptos básicos dentro de Express.js

## MIDDLEWARE

El concepto de middleware es CRUCIAL para entender cómo está montado Express.
Básicamente existen tres métodos que dan lugar a este middleware:

### 1 GET -> para cuando queremos enviar exactamente lo ruta que nos han pedido

Si el usuario introduce exactamente una ruta, o utiliza un enlace que lleva directamente a la ruta especificada, este middleware devolverá una respuesta. 

    ```javascript
    router.get('/add-product', (req, res, next) => {
        res.render('add-product', {
            pageTitle: 'Add Product',
            });
        });
    ```

###  2 POST -> lo que hacemos ante un evento -como un botón que se pulsa

Al contrario que en el caso anterior, el post solamente funcionará cuando se active el action='post'. Tendrá como función principal redirigir al desencadenarse el evento.

    ```javascript
    router.post('/add-product', (req, res, next) => {
        products.push({ title: req.body.title });
        res.redirect('/');
    });
    ```


###  3 USER -> nos va a dar un 'prefijo' de ruta, con más rutas dentro que serán o nada (/) o los get que pongan

Es similar al get, pero no tiene ninguna restricción ni involucra que haya que escribir exactamente la ruta completa.

Por esta misma razón, el use se utiliza como prefijo para una sección de la página. Por ejemplo 
    
    tudominio.com/shop/
    tudominio.com/admin/

Mientras que el get llevaría a una ruta concreta

    tudominio.com/shop/producto
    tudominio.com/admin/perfil

En definitiva, el use puede utilizarse como una pasarela.



## RESPUESTAS y REQUIRES (res.sendFile, res.render, res.redirect)

### res.sendFile

Se utiliza para manejar archivos de html estáticos. No permite introducir variables ni utilizar plantillas tipo EJS o pug. Así que no vamos a perder el tiempo con el sendFile.


### res.render

Se utiliza para crear página web dinámicas con plantillas tipo EJS o pug. Permite introducir variables. Es equivalente al return render de django.

    ```javascript

    router.get('/add-product', (req, res, next) => {
        res.render('add-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            activeAddProduct: true
        });
    });

    ```
En django veríamos algo parecido a esto:

    ```python

    def add_product(request):
        return render(request, 'add_product.html')
    ```

### res.redirect

Sencillamente redirige a donde le digamos. Lo veremos habitualmente en el POST.
Es decir, después de que un evento suceda con éxito (logearse, por ejemplo), se producirá un redireccionamiento automático.

    ```javascript

    router.post('/add-product', (req, res, next) => {
        res.redirect('/');
    });

    ```
En django veríamos algo parecido a esto:

    ```python

    def submit_product(request):
      if request.method == 'POST': 
          return redirect('home') 

    ```


### req.body.campo-formulario

En Express.js, req.body es un objeto que contiene datos enviados en el cuerpo de la solicitud HTTP (normalmente viene de un form).
La estructura para crear este objeto es la típica de los objetos de javascript, y la manejaremos dentro de nuestro Middleware:

    ```javascript
    const datosDeMiFormulario = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        siguienteCampo: req.body.siguienteCampo
        };

    miLista.push(datosDeMiFormulario);

    ```

*NOTA: Para que req.body esté disponible, necesitas utilizar middleware como body-parser o las capacidades integradas de Express para analizar el cuerpo de la solicitud.*
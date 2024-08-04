# Utilizando Req para guardar datos

Sí, puedes agregar propiedades personalizadas al objeto `req` (request) en Express.js. Esto puede ser útil para almacenar información que quieres tener disponible en diferentes partes de tu aplicación durante el ciclo de vida de una solicitud.

Por ejemplo, puedes tener un middleware que autentica al usuario y luego almacena la información del usuario en `req.user`. Luego, en los controladores de ruta posteriores, puedes acceder a `req.user` para obtener la información del usuario.

Aquí tienes un ejemplo simplificado de cómo podría funcionar:

```javascript
    // Middleware de autenticación
    app.use((req, res, next) => {
    // Simula la autenticación
    req.user = 'usuario';
    next

    ();


    });

    // Ruta
    app.get('/', (req, res) => {
    res.send(`Hola, ${req.user}`);
    });
```

En este ejemplo, el middleware de autenticación se ejecuta antes de cualquier ruta. Autentica al usuario (en este caso, simplemente asigna una cadena estática a `req.user`, pero en una aplicación real, probablemente buscarías al usuario en una base de datos). Luego, en la ruta, puedes acceder a `req.user` para obtener la información del usuario.

Es importante tener en cuenta que las propiedades que agregas a `req` solo están disponibles durante el ciclo de vida de la solicitud actual. No se conservan entre diferentes solicitudes. Si necesitas almacenar datos entre solicitudes, tendrías que usar una sesión o una base de datos.
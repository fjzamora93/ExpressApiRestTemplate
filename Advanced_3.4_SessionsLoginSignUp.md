# Sesiones: Login y SignUp

En este bloque vamos a ver en profundidad todo lo relacionado con el manejo de las sesiones de usuario (registrarse, logearse y que los datos de la sesión permanezcan).
Para ello, seguiremos los siguientes pasos:

## 1. Configurando app.js

Aquí pondremos la configuración de app.js para las sesiones


```javascript
    //Código
```


## 2. Encriptando la contraseña

    
```javascript
    //Código
```

## 3. Tokenizando con CSRF 

```javascript
    //Código
```

## 4. Optimizando las rutas para las sesiones

Se podría perfectamente implementar el req.session en cada controlador donde necesitemos datos de sesión.
Pero puesto que es un código innecesario, vamos a crear un nuevo directorio donde vamos a manejar los datos de sesión.
Posteriormente, y con las mismas, le pasaremos estos datos de sesión a las Rutas si siguen las condiciones que nosotros marquemos.

```javascript
    //Código
```
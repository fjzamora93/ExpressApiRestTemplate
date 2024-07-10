# Restaurando la contraseña y restrigiendo la autorización

## Restringiendo autorizaciones

Para restringir autorizaciones, bastará con implementar cuando sea pertinente un bloque de if() else() em el controlador afectado para verificar que el find({}) de mongoose devuelve no solo los item/productos que se estén buscando, sino aquellos donde la idUsuario del producto sea la misma que la que se está ausando en req.user. 

No tiene más misterio la forma de restringir autorizaciones.


## Restaurando contraseña

El sistema para restaurar la contraseña se basa en utilizar tokens, emails y fechas de expiración para los token. Veamos cómo lo haríamos:

### 1. Crear nuevas vistas para resetPassword

Empezaremos creando nuevas vistas en views/auth

1. Una con un formulario para introducir el email y resetear la contraseña
    reset.ejs
2. Otra vista con un formulario para introducir y confirmar la nueva contraseña.
    new-password.ejs

### 2. Modificar el models.user para introducir el token

Como campo opcional en el models.user se introducirá un Token y una fecha de expiración para dicho token. Este token será el que se utilice al enviar el email y restaurar la contraseña. 

```javascript
    const userSchema = new Schema({
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        resetToken: String,
        resetTokenExpiration: Date,
        //Demás atributos del modelo(
    })
```

### 3. Crear nuevos controllers en auth.js

Crearemos 4 nuevos controladores en auth.js:
1. getReset, para renderizar la vista e iniciar el reseteo.
    exports.getReset = (req, res, next) => {

2. postReset, para enviar el email de dereseto.
    exports.postReset = (req, res, next) => {

3. getNewPassword, para obtener la vista con el formulario de reseteo.
    exports.getNewPassword = (req, res, next) => {

4. postNewPassword, para enviar la nueva contraseña.
    exports.postNewPassword = (req, res, next) => {


En todo el proceso, se verificará que el token coincide con el usuario asignado. Puesto que dicho token estará guardando en nuestra base de datos, es un proceso sencillo.
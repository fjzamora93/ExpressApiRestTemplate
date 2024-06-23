# ¿Cómo manejamos arrays dentro de un formulario?

Imagínate que tienes un formulario donde quieres que el usuario vaya añadiendo objetos -tantos como él quiera. ¿Cómo lo vamos a gestionar?

# Paso 1

Nos aseguramos de que el body-parser está en 'true' (por defecto lo poníamos en false).
Vamos a nuestro fichero principal (app.js) y aquí buscamos esta línea de código:


```javascript
    app.use(bodyParser.urlencoded({ extended:true }));
```

Con esto ya podremos manejar los arrays. ¿Pero qué debemos hacerles?

Dentro de nuestro html, cada item de nuestro array tendrá el mismo nombre (name), tal que así:
Como vemos, el nombre es este: name= 'nombre-que-queramos[]'

Es de suponer que al hacer click en el botón de abajo, se añadirá un nuevo campo con exactamente los mismos datos.

```html
    <input type="text" name="item[]" value="<%= ingr %>">
    <button type="button" onclick="addItem()"> 
```

Finalmente iremos a nuestro controlador a termina de configurar nuestro array.
Dentro de nuestro controlador, guardaremos el valor del input como si fuese una constante normal.

```javascript
    //código anterior
    const campoNormal = req.body.name-campo-normal;
    const campoArray = req.body.name-array-del-formulario;
    const miClase = new Class(campoNormal, campoArray);
```
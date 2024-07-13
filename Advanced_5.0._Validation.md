# Validation

En este punto vamos a ver cómo se realiza la validación desde el backend de la aplicación.
Básicamente, para realizar la validación tocaremos dos archivos:

1. Añadir un ARRAY con todos los requisitos de VALIDACIÓN a la RUTA.

Routes >> rutas post
    Aquí modificaremos la ruta para añadir a aquellas routes de POST todas las validaciones que queramos hacer. Básicamente crearemos un ARRAY con todas las condiciones que deben cumplir cada uno de los campos del formulario del body. Tal que así:

```javascript

```

Además, es una buena práctica limpiar el código poniéndolo en minúsculas, quitando espacios (trim), etc.


2. Modificación de los controllers

Aunque no es estrictamente necesario, modificaremos los controllers para dar cierta información al usuario sobre por qué ha fallado el envío del formulario. Dentro de este punto habrá que hacer varias implementaciones:

a. Mostrar en pantalla un mensaje con el tipo de error (se lo pasamos como un parámetro al controlller).
b. Guardar la información que ya ha enviado el usuario anteriormente y que el value del formulario tome la información que rellenó anteriormente para que pueda corregirlla.

```javascript

```

3. Modificación del HTML

Dentro del HTML, deberemos añadir a cada campo del formulario el value="" correspondiente a aquello que ya se haya rellenado anteriormente en caso de que algo saliese mal y se redirigiese a la misma página.


Eso quiere decir que cuando se accede a una página de forma normal, con el GET, será necesario pasar estos mismos parámetros aunque en este caso estarán vacíos, simplementa para que no de error la página.
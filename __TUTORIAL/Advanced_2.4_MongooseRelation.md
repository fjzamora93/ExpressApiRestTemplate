# Relaciones entre documentos con Mongoose (FETCH)

El enfoque del FETCH es completamente distinto al de la POPULACIÓN. Cuando populamos, nos traemos el objeto completo. En este caso, únicamente nos traemos la referencia. Eso quiere decir que en algún momento tendremos que hacer un fetchAll.

La populación y el Fetch son dos enfoques. En este apartado vamos a ver cómo se gestiona con un Fetch.

Para empezar, vamos a comenzar con un caso sencillo. Imaginemos que tenemos una relación de uno a muchos. Donde un USER puede tener varios ITEMS. A la hora de construir nuestro modelo, debería quedar algo así:

```javascript

    const UserSchema = new Schema({
        nombre : type: string,
        itemList : [{
            type: Schema.Types.ObjectId,
            ref: 'Items'
        }]
    })

```

Aquí ya vemos varios aspectos a comentar:

1. El array se declara usando los corchetes y dentro las llaves [{}]

2. Existe una "ref", la ref es un mecanismo interno de Mongoose. Básicamente tenemos que poner en PLURAL el nombre de nuestra collection. Si nuestra collection se llama 'Item', nuestra ref será 'Items'. Si nuestra collection se llama 'Recipe', la ref será 'Recipes'. 

3. Únicamente estamos pasando la referencia, tal y como está planteado no tendríamos acceso a todos los datos que nos interesan. Si lo intentásemos, únicamente obtendríamos el string. Así que tenemos que dar un paso más allá:

### Accediendo a los datos referenciados

Para acceder a los datos referenciados dentro de un array iremos a nuestro Controller correspondiente y, ahora sí, crearemos una promesa que nos devuelva todas las correspondencias en la orden de búsqueda utilizando el método facilitado por mongoose de .find ({ $in: })

Para ello haremos lo siguiente:
1. Creamos una variable que será un array con todas las IDs que queramos.
2. Utilizamos el método estático de nuestro modelo para buscar siguiendo el criterio dado.

```javascript
    exports.getBookmark = (req, res, next) => {
        const itemsIds = req.user.itemList;
        ItemList.find({ _id: { $in: bookmarkIds } })
            .then(items => {
                res.render('ruta/vista', {
                    items: items
                });
            })
            .catch(err => console.log(err));
    }
```

Ahora items es es un array de OBJETOS (y no solo un array de strings). Y puesto que es un array, podemos iterar sobre él de la forma habitual dentro de nuestro html.

```html

    <% for (let item in items) { %>
        item.nombre
        item.descripcion
        item.numero
    <% } %>

```
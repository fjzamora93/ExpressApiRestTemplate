# Conexión a BBDD con Mongoose

Mongoose es una poderosa herramienta que facilita la conexión a BBDD y además nos permite instanciar objetos que directamente ya tienen incorporados los métodos. Por lo que nos podemos centrar en la parte lógica del código y no tanto en lo que viene siendo la conexión a BBDD.

## 1. Instalación de mongoose

>> npm install mongoose

## 2. Preparando la conexión (app.js)

Para empezar, podemos eliminar el documento 'utils/database.js', ya que vamos a facilitar la conexión a la BBDD con Mongoose.
Vamos a nuestra app.js y desde ahí establecemos la conexión.

    ```javascript
        const mongoose = require('mongoose');

        mongoose
        .connect(
            'mongodb+srv://USUARIO:CONTRASEÑA@NOMBREDELCLUSTER-ntrwp.mongodb.net/COLECCIÓN?retryWrites=true'
        )
        .then(result => {
            User.findOne().then(user => {
            if (!user) {
                const user = new User({
                name: 'Max',
                email: 'max@test.com',
                cart: {
                    items: []
                }
                });
                user.save();
            }
            });
            app.listen(3000);
        })
        .catch(err => {
            console.log(err);
        });
    ```

El resultado del establecimiento de la conexión debería ser algo parecido a esto.

## 3. Instanciando modelos

Ahora viene la siguiente parte. Puesato que no vamos a crear nuestros propios métodos CRUD, vamos a simplificar el proceso utilizando los que ofrece la CLASE creada por Mongoose para nuestros modelos.

El código de un modelo, debería ser algo parecido a esto:

```javascript

    const mongoose = require('mongoose'); //importamos mongoose
    const Schema = mongoose.Schema; //importamos el schema, para poder usar los métodos

    //Instanciamos nuestro modelo como un SCHEMA. 
    const productSchema = new Schema({
        //Seguimos esta estructura para ir creando los campos de nuestro modelo
        title: {
            type: String,
            required: true
        },
        // Introducimos un campo para referenciar a OTRO OBJETO de la BBDD
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    });

```
## Operaciones CRUD

### FindById() / Find()

El método .find() -que nos devuelve TODO-, o findById(que nos devuelve por ID), SIEMPRE devuelve una promesa ASÍNCRONA.
Así que la forma correcta de usarlo será siempre encandenarlo así:

    Modelo.find({ criterioDeBúsqueda })
        .then(itemEncontrado => {
            itemEncontrado.campo = 'modificaciones que queramos hacer'; 
        })
        .catch(err => console.log (err))

Eso quiere decir que, sea lo que sea que queramos hacerle al objeto (remplazarlo, eliminarlo... ) será encadenando la promesa.
Veamos cómo se usa:


### Save
El método .save() guarda automáticamente el objeto. Si no existe, lo crea; si ya existe, lo remplaza. 
Se puede utilizar de la siguiente manera:

```javascript

    exports.postAddProduct = (req, res, next) => {
        const title = req.body.title;
        const product = new Product({
            title: title,
            userId: req.user
        });
        product
            .save() 
            .then(result => {
                res.redirect('/admin/products');
                })
            .catch(err => {
            console.log(err);
            });
        };

```

En el supuesto de que quisiéramos remplazar el proceso sería exactamente el mismo. 
Primero utilizaríamos el método estático Model.findByID() y lo encadenaríamos con un .then(producto.save()).
Lo vemos aquí:

```javascript
    exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            return product.save();
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    };

```

### DELETE (remove está deprecated)

Es un método un poco peculiar, su sintaxis es esta:

Product.findByIdAndDelete(id).then().catch()

Es de esperar que al llamar a este méotod únicamente vamos a hacer un redirect y no vamos a implementar ninguna lógica adicional.


## UserSchema Methods

Podemos crear nuestros propios métodos e incorporarlos a los modelos de Mongoose.

La sintaxis es esta:

    modeloSchema.methods.nombreMetodo = function(param){
        //implementación de toda la lógica qu equeramos
    }


Para ello, nos vamos a nuestro modelo y lo haremos así:

```javascript

    //Suponmoe que tenemos este modelo (Usuario + Carro de la compra):

    const userSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        cart: {
            items: [
            {
                productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
                },
                quantity: { type: Number, required: true }
            }
            ]
        }
    });

    //Y ahora necesitamos un método para "añadir al carrito". Lo implementamos así.

    userSchema.methods.addToCart = function(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
            });
        }
        const updatedCart = {
            items: updatedCartItems
        };
        this.cart = updatedCart;
        return this.save();
        };
```


## Populate

Es una opción poco usual, pero es posible que queramos rellenar un campo con todo lo que haya dentro de otro documento. 
Para ello, utilizaremos populate.

El método populate() de Mongoose se utiliza para reemplazar automáticamente los campos en los documentos que son referencias a otros documentos con los documentos completos a los que se refieren.

Por ejemplo, supongamos que tienes dos modelos, User y Post, y cada Post tiene un campo author que es una referencia a un User:

```javascript

    const userSchema = new mongoose.Schema({ name: String });
    const User = mongoose.model('User', userSchema);

    const postSchema = new mongoose.Schema({
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    });
    const Post = mongoose.model('Post', postSchema);
```
Si obtienes un post de la base de datos, el campo author será solo el ID del autor. Pero si usas populate('author'), Mongoose automáticamente reemplazará el ID del autor con el documento completo del usuario.

Ahora post.author es un objeto completo con todos los campos del usuario, no solo su ID.

Esto es útil cuando tienes relaciones entre documentos y quieres trabajar con los documentos completos, no solo con sus IDs. Sin embargo, ten en cuenta que populate() realiza consultas adicionales a la base de datos, por lo que puede tener un impacto en el rendimiento.
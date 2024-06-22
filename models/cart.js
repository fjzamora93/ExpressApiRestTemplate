const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Buscamos por el índice. El índice lo necesitamos para saber en qué parte del array está el producto que vamos a actualizar.
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );

      //Pero no solo hay que saber su posición... también necesitamos el producto en sí mismo, para actualizarlo.
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      // Incrementar cantidad si existe el producto.
      if (existingProduct) {
        updatedProduct = { ...existingProduct }; //los tres puntos es para hacer una copia del objeto
        updatedProduct.qty = updatedProduct.qty + 1; //modificamos la cantidad sumándole 1
        cart.products = [...cart.products]; //! ??? me podré cargar esta línea
        cart.products[existingProductIndex] = updatedProduct; // usamos el índice y lo remplazamos por el producto modificado
      } else {
        //En el else creamos una copia del carro y le añadimos el producto actualizado, sin más. 
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice; //el +productPrice convierte a número el valor de esa varaiable.
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }
};

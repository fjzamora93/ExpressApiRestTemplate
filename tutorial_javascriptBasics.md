# Javascript Basics: conceptos básicos

## 1. Operadores ternarios

La mejor forma de explicar lo que es un operador ternario es recordar cómo se comporta en Python:

    ```python
        condicion1 if condicion1 == True else condicion2
    ```

En javascript hay una forma muy similar de crear este tipo de condicionales en una sola línea.

    ```javascript
    path === '/mi/ruta/archivo/' ? true : false;

    ```
La primera parte de la sentencia path === 'ruta' es el booleano que va a comparar. 

La segunda parte de la sentencia ? true:false son las posibles opciones que podría devolver. Para este caso, o true (si se cumple el condicional) o false (si no se cumple).

Al mismo tiempo, este operador ternario puede introducirse dentro de un return, o incluso almacenarse en una variable: 

    ```javascript
        const miVariable = path === '/mi/ruta/archivo/' ? true : false;

    ```

## 2. Iteración for each

En javascrit existen distintas formas de iterar un foreach. Muy resumidamente, vamos a mencionar las 3 y centrarnos en la tercera:

1. Como en Python: for (let item in list). Esta forma no se utiliza, ya que se basa en iterar el índice.

2. Propia de Javascript (útil, versátil y no da conflictos de ningún tipo):

    ```javascript
    for (let element of list){
        console.log(element.name)
    }
    ```

3. La forma resumida, perfecta para mapeos o aplicar funciones a cada objeto iterado.

    ```javascript
    list.forEach(element => function(element));
    ```

Como puede comprobarse, esta tercera forma puede empezar a complicarse dependiendo de cuánto queramos reducir el código o cómo queramos complicar nuestra función anónima.


## 3. Función flecha

El equivalnete a una lambda en Python. Las funciones anónimas en Javascript pueden complicarse bastnate, en tanto se puede recortar código de todas partes. Veamos ejemplos

    ```javascript

    //Función flecha con dos parámetros
    const miFuncion = (unParametro, dosParametros) => {
        console.log(unParametro);
        console.log(dosParametros);
    }


    //Función flecha con solo un parámetro
    const miFuncion2 = unSoloParametro => otraFuncionExterna(unSoloParametro);


    //Función flecha sin parámetros
    const miFuncionSinParametros = () => {
        console.log('Esta función no recibe parámetros');
    }

    ```

**NOTA:** *Si una función flecha no tiene llaves {}, entonces lo que está a la derecha de la flecha => se devuelve implícitamente.*



## 4. Función flecha + forEach

Es habitual encontrar una función flecha unida a un forEach. En este caso, se retornará una lista a la que se le ha aplicado la función flecha a cada objeto iterado.


    ```javascript
    const numeros = [1, 2, 3, 4, 5];
    const numerosIncrementados = [];

    numeros.forEach(numero => numerosIncrementados.push(numero + 1));

    console.log(numerosIncrementados); // [2, 3, 4, 5, 6]

    ```



## 5. Objeto literal

Una estructura muy común en Javascript y que después en Typescript da lugar a los interfaces.

Lo pondremos aquí por ser de uso recurrente:

    ```javascript
    let miObjeto = {
        nombre: "Juan",
        apellido: "Ramirez",
        saludar: function() {
            console.log(`Hola, soy ${this.nombre} ${this.apellido}. ¡Mucho gusto!`);
        }
    };
    ```

En este caso, la función flecha NO VA A FUNCIONAR. Ya que devolver UNDEFINED. Sencillamente hay que declarar la función siguiendo el método tradicional.

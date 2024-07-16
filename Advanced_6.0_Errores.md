# Gestión de Errores

Por lo general, vamos a tener que enfrentarnos a dos tipos de errores fundamentales:

400: son errores del lado del cliente, generalmente página no encontrada o un formulario rellenado de forma incorrecta.

500: Errores del lado del servidor. Es un grupo muy heterogéneo de errores, donde uno de los más frecuentes es una conexión fallida a la base de datos.

## Errores del servidor (500)

Podemos manejar los errores de múltiples maneras. Por ejemplo, si es un error temporal, podemos incluir una línea de código que simplemente avise de que algo ha salido mal y lo intente más tarde.

Por el contrario, si existe la posibilidad de que el error perdure en el tiempo, la mejor opción es redirigir al usuario a una página de error. ¿Y cómo haremos esto? Desde el catch(err)
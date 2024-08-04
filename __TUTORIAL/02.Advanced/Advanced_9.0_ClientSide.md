# Sección 22: añadiendo Javascript para manejar las vistas en el cliente

No siempre vamos a querer renderizar, recargar o redirigir a una página.
En ocasiones simplmente queremos que el servidor haga lo que tenga que hacer y, con un poco de Javascript, que los elementos de la página se actualicen por sí mismos.

Esto es el caso en el que queramos eliminar algo, editar algún dato personal, o, a lo mejor, crear algo rápidamente para la propia página.

En este caso, lo que modificaremos serán:

1. Las propias vistas incluirán enlace a un javascript.
2. El javascript que manejará la lógica de lo que pasa en el cliente.
3. La ruta se actualiza con nombres más apropiados al tipo de respuesta que se va a dar.
4. Los controllers se actualizan para enviar información en JSON pero no redirigir ni renderizar ninguna página nueva.
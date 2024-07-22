
## Restringiendo autorizaciones

Para restringir autorizaciones, bastará con implementar cuando sea pertinente un bloque de if() else() em el controlador afectado para verificar que el find({}) de mongoose devuelve no solo los item/productos que se estén buscando, sino aquellos donde la idUsuario del producto sea la misma que la que se está ausando en req.user. 

No tiene más misterio la forma de restringir autorizaciones.
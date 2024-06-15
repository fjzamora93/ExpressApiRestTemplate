//Importaciones
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//Configuración de la vista (usamos EJS)
app.set('view engine', 'ejs');
app.set('views', 'views');

//Rutas
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//Para la gestión de los datos
app.use(bodyParser.urlencoded({ extended: false }));

//Para acceder a los archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Rutas
app.use('/admin', adminData.routes);
app.use(shopRoutes);

//Manejo de errores
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

//Escuchando en el puerto 3000 (o el que queramos)
app.listen(3000);

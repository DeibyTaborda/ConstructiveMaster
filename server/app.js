const express = require('express');
const app = express();
const port = 3001;
const db = require('../server/db/db');
const cors = require('cors');
// const multer = require('multer');
// const upload = multer();

//middlware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(upload.none());
app.use(cors());

app.use((req, res, next) => {
    console.log(`Solicitud ${req.method} a ${req.url}`);
    next();
});

app.use('/uploads', express.static('uploads'));


//importación de rutas
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
const super_adminRoutes = require('./routes/super_admin');


app.use(clientRoutes);
app.use(adminRoutes);
app.use(super_adminRoutes);



app.listen(port, () => console.log(`Servidor en el puerto ${port}`));

const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const {actualizarEstadoTrabajos} = require('./middleware/actualizarEstadoTrabajo');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const multer = require('multer');
// const upload = multer();

//middlware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

actualizarEstadoTrabajos();
app.use((req, res, next) => {
    console.log(`Solicitud ${req.method} a ${req.url}`);
    next();
});

app.use('/uploads', express.static('uploads'));
dotenv.config();


//importación de rutas
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
const super_adminRoutes = require('./routes/super_admin');
const routesCompartidas = require('./routes/routesCompartidas')
const routesProfesional = require('./routes/profesional');


app.use(clientRoutes);
app.use(adminRoutes);
app.use(super_adminRoutes);
app.use(routesCompartidas);
app.use(routesProfesional);



app.listen(port, () => console.log(`Servidor en el puerto ${port}`));

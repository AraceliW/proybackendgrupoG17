const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const eventoRoutes = require('./routes/evento.routes');
const tipoEntradaRoutes = require('./routes/tipoEntrada.routes');
const compraRoutes = require('./routes/compra.routes');
const ticketRoutes = require('./routes/ticket.routes');
const reclamoRoutes = require('./routes/reclamo.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const reporteRoutes = require('./routes/reporte.routes');
const adminCompraRoutes = require('./routes/adminCompra.routes');
const adminTicketRoutes = require('./routes/adminTicket.routes');
const adminUsuarioRoutes = require('./routes/adminUsuario.routes');
const adminEventoRoutes = require('./routes/adminEvento.routes');
const homeRoutes = require('./routes/home.routes');
const mercadoPagoRoutes = require('./routes/mercadoPago.routes');


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('src/uploads'));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api', tipoEntradaRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reclamos', reclamoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/admin/compras', adminCompraRoutes);
app.use('/api/admin/tickets', adminTicketRoutes);
app.use('/api/admin/usuarios', adminUsuarioRoutes);
app.use('/api/admin/eventos', adminEventoRoutes);
app.use('/api/home', homeRoutes);
app.use('/uploads', express.static('src/uploads'));
app.use('/api/mercadopago', mercadoPagoRoutes);


app.get('/', (req, res) => {
  res.json({
    mensaje: 'API DIBUTICK funcionando correctamente'
  });
});

module.exports = app;
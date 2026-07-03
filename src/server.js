require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/database');
const iniciarJobExpirarCompras = require('./jobs/expirarCompras.job');

require('./models');

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente');

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos');

    iniciarJobExpirarCompras();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
};

iniciarServidor();
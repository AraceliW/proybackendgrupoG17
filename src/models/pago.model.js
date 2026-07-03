const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define('Pago', {
  mercadoPagoId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metodoPago: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado', 'cancelado'),
    defaultValue: 'pendiente'
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Pago;
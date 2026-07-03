const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Compra = sequelize.define('Compra', {
  codigoCompra: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  fechaCompra: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'expirada', 'cancelada'),
    defaultValue: 'pendiente'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  comision: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fechaVencimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaConfirmacion: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Compra;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  codigoQR: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  codigoTicket: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  fechaGeneracion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('activo', 'usado', 'cancelado'),
    defaultValue: 'activo'
  },
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Ticket;
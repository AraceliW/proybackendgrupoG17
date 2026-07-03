const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reclamo = sequelize.define('Reclamo', {
  asunto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_proceso', 'resuelto'),
    defaultValue: 'pendiente'
  },
  respuestaAdmin: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Reclamo;
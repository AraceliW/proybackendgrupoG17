const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoEntrada = sequelize.define('TipoEntrada', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stockDisponible: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stockReservado: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 0
  },
  estado: {
    type: DataTypes.ENUM('disponible', 'agotado', 'inactivo'),
    defaultValue: 'disponible'
  }
});

module.exports = TipoEntrada;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistorialAcceso = sequelize.define('HistorialAcceso', {
  ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  navegador: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fechaAcceso: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = HistorialAcceso;
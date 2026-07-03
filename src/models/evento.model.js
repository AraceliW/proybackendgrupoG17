const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evento = sequelize.define('Evento', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  categoriaDeporte: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: 'General'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estadio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ciudad: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: 'Sin especificar'
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  longitud: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  youtubeVideoId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imagenBanner: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'finalizado'),
    defaultValue: 'activo'
  },
  imagenMiniatura: {
  type: DataTypes.STRING,
  allowNull: true
  },
  galeriaImagenes: {
  type: DataTypes.JSON,
  allowNull: true
  }
});

module.exports = Evento;
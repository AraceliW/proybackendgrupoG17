const { body } = require('express-validator');

const validarEvento = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),

  body('categoriaDeporte')
    .notEmpty()
    .withMessage('La categoría es obligatoria'),

  body('fecha')
    .notEmpty()
    .withMessage('La fecha es obligatoria'),

  body('hora')
    .notEmpty()
    .withMessage('La hora es obligatoria'),

  body('estadio')
    .notEmpty()
    .withMessage('El estadio es obligatorio'),

  body('ciudad')
    .notEmpty()
    .withMessage('La ciudad es obligatoria'),

  body('precioBase')
    .isFloat({ gt: 0 })
    .withMessage('El precio debe ser mayor que cero'),

  body('capacidad')
    .isInt({ gt: 0 })
    .withMessage('La capacidad debe ser mayor que cero')
];

module.exports = {
  validarEvento
};
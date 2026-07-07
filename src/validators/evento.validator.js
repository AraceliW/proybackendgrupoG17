const { body } = require('express-validator');

const validarEvento = [

  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),

  body('descripcion')
    .notEmpty()
    .withMessage('La descripción es obligatoria'),

  body('categoriaDeporte')
    .notEmpty()
    .withMessage('La categoría es obligatoria'),

  body('fecha')
    .notEmpty()
    .withMessage('La fecha es obligatoria'),

  body('hora')
    .notEmpty()
    .withMessage('La hora es obligatoria'),

  body('generalPrecio')
  .isFloat({ min: 1 })
  .withMessage('El precio General debe ser mayor a 0'),

  body('generalStock')
    .isInt({ min: 0 })
    .withMessage('El stock General debe ser mayor o igual a 0'),

  body('estadio')
    .notEmpty()
    .withMessage('El estadio es obligatorio'),

  body('ciudad')
    .notEmpty()
    .withMessage('La ciudad es obligatoria'),

  body('direccion')
    .notEmpty()
    .withMessage('La dirección es obligatoria'),

  body('youtubeVideoId')
    .optional()

];

module.exports = {
  validarEvento
};
const { body } = require('express-validator');

const validarTipoEntrada = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre del tipo de entrada es obligatorio'),

  body('precio')
    .isFloat({ gt: 0 })
    .withMessage('El precio debe ser mayor que cero'),

  body('stock')
    .isInt({ gt: 0 })
    .withMessage('El stock debe ser mayor que cero')
];

module.exports = {
  validarTipoEntrada
};
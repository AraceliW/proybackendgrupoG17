const { body } = require('express-validator');

const validarReservaCompra = [
  body('tipoEntradaId')
    .isInt({ gt: 0 })
    .withMessage('El tipoEntradaId debe ser un número válido'),

  body('cantidad')
    .isInt({ gt: 0 })
    .withMessage('La cantidad debe ser mayor que cero')
];

module.exports = {
  validarReservaCompra
};
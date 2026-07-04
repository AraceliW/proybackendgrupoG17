const { body } = require('express-validator');

const validarCrearReclamo = [
    body('asunto')
    .notEmpty()
    .withMessage('El asunto es obligatorio'),

  body('descripcion')
    .notEmpty()
    .withMessage('La descripción es obligatoria')
];

const validarResponderReclamo = [
  body('respuestaAdmin')
    .notEmpty()
    .withMessage('La respuesta del administrador es obligatoria')
];

module.exports = {
  validarCrearReclamo,
  validarResponderReclamo
};
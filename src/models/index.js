const Usuario = require('./usuario.model');
const Evento = require('./evento.model');
const TipoEntrada = require('./tipoEntrada.model');
const Compra = require('./compra.model');
const DetalleCompra = require('./detalleCompra.model');
const Pago = require('./pago.model');
const Ticket = require('./ticket.model');
const Reclamo = require('./reclamo.model');
const Auditoria = require('./auditoria.model');
const HistorialAcceso = require('./historialAcceso.model');

// Usuario - Compra
Usuario.hasMany(Compra, {
  foreignKey: 'usuarioId',
  as: 'compras'
});

Compra.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

// Usuario - Reclamo
Usuario.hasMany(Reclamo, {
  foreignKey: 'usuarioId',
  as: 'reclamos'
});

Reclamo.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

// Usuario - Auditoria
Usuario.hasMany(Auditoria, {
  foreignKey: 'usuarioId',
  as: 'auditorias'
});

Auditoria.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

// Usuario - HistorialAcceso
Usuario.hasMany(HistorialAcceso, {
  foreignKey: 'usuarioId',
  as: 'historialAccesos'
});

HistorialAcceso.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

// Evento - TipoEntrada
Evento.hasMany(TipoEntrada, {
  foreignKey: 'eventoId',
  as: 'tiposEntrada'
});

TipoEntrada.belongsTo(Evento, {
  foreignKey: 'eventoId',
  as: 'evento'
});

// Compra - DetalleCompra
Compra.hasMany(DetalleCompra, {
  foreignKey: 'compraId',
  as: 'detalles'
});

DetalleCompra.belongsTo(Compra, {
  foreignKey: 'compraId',
  as: 'compra'
});

// TipoEntrada - DetalleCompra
TipoEntrada.hasMany(DetalleCompra, {
  foreignKey: 'tipoEntradaId',
  as: 'detallesCompra'
});

DetalleCompra.belongsTo(TipoEntrada, {
  foreignKey: 'tipoEntradaId',
  as: 'tipoEntrada'
});

// Compra - Pago
Compra.hasOne(Pago, {
  foreignKey: 'compraId',
  as: 'pago'
});

Pago.belongsTo(Compra, {
  foreignKey: 'compraId',
  as: 'compra'
});

// Compra - Ticket
Compra.hasOne(Ticket, {
  foreignKey: 'compraId',
  as: 'ticket'
});

Ticket.belongsTo(Compra, {
  foreignKey: 'compraId',
  as: 'compra'
});

module.exports = {
  Usuario,
  Evento,
  TipoEntrada,
  Compra,
  DetalleCompra,
  Pago,
  Ticket,
  Reclamo,
  Auditoria,
  HistorialAcceso
};
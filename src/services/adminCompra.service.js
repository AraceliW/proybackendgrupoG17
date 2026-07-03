const { Op } = require('sequelize');
const { Compra, DetalleCompra, TipoEntrada, Evento, Usuario, Ticket } = require('../models');

const listarCompras = async ({ estado, codigoCompra, mes, anio }) => {
  const whereCompra = {};

  if (estado) {
    whereCompra.estado = estado;
  }

  if (codigoCompra) {
    whereCompra.codigoCompra = {
      [Op.iLike]: `%${codigoCompra}%`
    };
  }

  if (mes && anio) {
    const inicio = new Date(anio, mes - 1, 1);
    const fin = new Date(anio, mes, 1);

    whereCompra.fechaCompra = {
      [Op.gte]: inicio,
      [Op.lt]: fin
    };
  }

  return await Compra.findAll({
    where: whereCompra,
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'apellido', 'email']
      },
      {
        model: DetalleCompra,
        as: 'detalles',
        include: [
          {
            model: TipoEntrada,
            as: 'tipoEntrada',
            include: [
              {
                model: Evento,
                as: 'evento'
              }
            ]
          }
        ]
      },
      {
        model: Ticket,
        as: 'ticket'
      }
    ],
    order: [['fechaCompra', 'DESC']]
  });
};

const obtenerCompraPorId = async (id) => {
  return await Compra.findByPk(id, {
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'apellido', 'email']
      },
      {
        model: DetalleCompra,
        as: 'detalles',
        include: [
          {
            model: TipoEntrada,
            as: 'tipoEntrada',
            include: [
              {
                model: Evento,
                as: 'evento'
              }]
            }]
      },
      {
        model: Ticket,
        as: 'ticket'
      }
    ]
  });
};

module.exports = {
  listarCompras,
  obtenerCompraPorId
};
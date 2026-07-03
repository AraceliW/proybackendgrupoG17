const { Op } = require('sequelize');
const { Compra, DetalleCompra, TipoEntrada, Evento, Usuario } = require('../models');

const reporteVentas = async ({ mes, anio }) => {
  const whereCompra = {
    estado: 'confirmada'
  };

  if (mes && anio) {
    const inicio = new Date(anio, mes - 1, 1);
    const fin = new Date(anio, mes, 1);

    whereCompra.fechaConfirmacion = {
      [Op.gte]: inicio,
      [Op.lt]: fin
    };
  }

  const compras = await Compra.findAll({
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
      }
    ],
    order: [['fechaConfirmacion', 'DESC']]
  });

  return compras;
};

module.exports = {
  reporteVentas
};
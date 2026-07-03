const { Evento, TipoEntrada, DetalleCompra, Compra } = require('../models');

const listarEventosAdmin = async () => {
  const eventos = await Evento.findAll({
    include: [
      {
        model: TipoEntrada,
        as: 'tiposEntrada',
        include: [
          {
            model: DetalleCompra,
            as: 'detallesCompra',
            include: [
              {
                model: Compra,
                as: 'compra',
                where: { estado: 'confirmada' },
                required: false
              }
            ],
            required: false
          }
        ]
      }
    ],
    order: [['fecha', 'ASC']]
  });

  return eventos.map((evento) => {
    let stockTotal = 0;
    let stockDisponible = 0;
    let entradasVendidas = 0;
    let recaudacion = 0;

    evento.tiposEntrada.forEach((tipo) => {
      stockTotal += tipo.stock;
      stockDisponible += tipo.stockDisponible;

      tipo.detallesCompra.forEach((detalle) => {
        if (detalle.compra && detalle.compra.estado === 'confirmada') {
          entradasVendidas += detalle.cantidad;
          recaudacion += Number(detalle.subtotal);
        }
      });
    });

    const porcentajeVendido =
      stockTotal > 0 ? Number(((entradasVendidas / stockTotal) * 100).toFixed(2)) : 0;

    return {
      id: evento.id,
      nombre: evento.nombre,
      categoriaDeporte: evento.categoriaDeporte,
      fecha: evento.fecha,
      hora: evento.hora,
      estadio: evento.estadio,
      ciudad: evento.ciudad,
      estado: evento.estado,
      entradasVendidas,
      recaudacion,
      stockTotal,
      stockDisponible,
      porcentajeVendido
    };
  });
};

module.exports = {
  listarEventosAdmin
};
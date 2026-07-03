const { Op } = require('sequelize');
const {
  Compra,
  DetalleCompra,
  TipoEntrada,
  Evento,
  Usuario,
  Ticket
} = require('../models');

const obtenerDashboard = async ({ mes, anio }) => {
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

  const comprasConfirmadas = await Compra.findAll({
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
    order: [['fechaConfirmacion', 'DESC']]
  });

  const usuariosRegistrados = await Usuario.count();
  const eventosActivos = await Evento.count({
    where: { estado: 'activo' }
  });
  const ticketsEmitidos = await Ticket.count();

  let entradasVendidas = 0;
  let recaudacionTotal = 0;

  const ventasEventoMap = {};
  const ventasCategoriaMap = {};
  const ventasMesMap = {};

  comprasConfirmadas.forEach((compra) => {
    recaudacionTotal += Number(compra.total);

    const fecha = new Date(compra.fechaConfirmacion);
    const claveMes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

    if (!ventasMesMap[claveMes]) {
      ventasMesMap[claveMes] = {
        mes: claveMes,
        entradasVendidas: 0,
        recaudacion: 0
      };
    }

    ventasMesMap[claveMes].recaudacion += Number(compra.total);

    compra.detalles.forEach((detalle) => {
      entradasVendidas += detalle.cantidad;
      ventasMesMap[claveMes].entradasVendidas += detalle.cantidad;

      const tipoEntrada = detalle.tipoEntrada;
      const evento = tipoEntrada?.evento;

      const nombreEvento = evento?.nombre || 'Sin evento';
      const categoria = tipoEntrada?.nombre || 'Sin categoría';

      if (!ventasEventoMap[nombreEvento]) {
        ventasEventoMap[nombreEvento] = {
          evento: nombreEvento,
          entradasVendidas: 0,
          recaudacion: 0
        };
      }

      ventasEventoMap[nombreEvento].entradasVendidas += detalle.cantidad;
      ventasEventoMap[nombreEvento].recaudacion += Number(detalle.subtotal);

      if (!ventasCategoriaMap[categoria]) {
        ventasCategoriaMap[categoria] = {
          categoria,
          cantidad: 0,
          recaudacion: 0,
          porcentaje: 0
        };
      }

      ventasCategoriaMap[categoria].cantidad += detalle.cantidad;
      ventasCategoriaMap[categoria].recaudacion += Number(detalle.subtotal);
    });
  });

  const promedioPorEntrada =
    entradasVendidas > 0 ? recaudacionTotal / entradasVendidas : 0;

  const ventasPorEvento = Object.values(ventasEventoMap)
    .sort((a, b) => b.entradasVendidas - a.entradasVendidas);

  const ventasPorCategoria = Object.values(ventasCategoriaMap).map((item) => ({
    ...item,
    porcentaje:
      entradasVendidas > 0
        ? Number(((item.cantidad / entradasVendidas) * 100).toFixed(2))
        : 0
  }));

  const ventasPorMes = Object.values(ventasMesMap).sort((a, b) =>
    a.mes.localeCompare(b.mes)
  );

  const ultimasCompras = comprasConfirmadas.slice(0, 5).map((compra) => ({
    id: compra.id,
    codigoCompra: compra.codigoCompra,
    cliente: `${compra.usuario?.nombre || ''} ${compra.usuario?.apellido || ''}`.trim(),
    email: compra.usuario?.email,
    total: Number(compra.total),
    estado: compra.estado,
    fechaConfirmacion: compra.fechaConfirmacion,
    ticket: compra.ticket
      ? {
          codigoTicket: compra.ticket.codigoTicket,
          pdfUrl: compra.ticket.pdfUrl,
          estado: compra.ticket.estado
        }
      : null
  }));

  return {
    tarjetas: {
      entradasVendidas,
      recaudacionTotal,
      usuariosRegistrados,
      eventosActivos,
      ticketsEmitidos,
      compradoresUnicos: new Set(comprasConfirmadas.map(c => c.usuarioId)).size,
      promedioPorEntrada
    },
    graficos: {
      ventasPorMes,
      ventasPorEvento,
      ventasPorCategoria
    },
    tablas: {
      ultimasCompras,
      eventosMasVendidos: ventasPorEvento.slice(0, 5)
    }
  };
};

module.exports = {
  obtenerDashboard
};
const cron = require('node-cron');
const { Op } = require('sequelize');

const {
  Compra,
  DetalleCompra,
  TipoEntrada
} = require('../models');

const iniciarJobExpirarCompras = () => {

  cron.schedule('* * * * *', async () => {

    console.log('Verificando compras vencidas...');

    try {

      const comprasVencidas = await Compra.findAll({

        where: {
          estado: 'pendiente',
          fechaVencimiento: {
            [Op.lt]: new Date()
          }
        },

        include: [
          {
            model: DetalleCompra,
            as: 'detalles'
          }
        ]

      });

      for (const compra of comprasVencidas) {

        for (const detalle of compra.detalles) {

          const tipoEntrada = await TipoEntrada.findByPk(detalle.tipoEntradaId);

          if (!tipoEntrada) continue;

          await tipoEntrada.update({

            stockDisponible:
              tipoEntrada.stockDisponible + detalle.cantidad,

            stockReservado:
              tipoEntrada.stockReservado - detalle.cantidad

          });

        }

        await compra.update({

          estado: 'expirada'

        });

        console.log(
          `Compra ${compra.codigoCompra} expirada correctamente`
        );

      }

    } catch (error) {

      console.error(error);

    }

  });

};

module.exports = iniciarJobExpirarCompras;
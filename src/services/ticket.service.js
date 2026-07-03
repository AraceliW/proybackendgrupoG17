const QRCode = require('qrcode');
const { Ticket } = require('../models');
const pdfService = require('./pdf.service');

console.log('PDF SERVICE:', pdfService);

const generarCodigoTicket = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DBT-${new Date().getFullYear()}-${random}`;
};

const crearTicket = async (compra) => {
  const codigoTicket = generarCodigoTicket();

  const datosQR = {
    codigoTicket,
    compraId: compra.id,
    sistema: 'DIBUTICK'
  };

  const codigoQR = await QRCode.toDataURL(JSON.stringify(datosQR));

  const ticket = await Ticket.create({
    compraId: compra.id,
    codigoTicket,
    codigoQR,
    estado: 'activo'
  });

  const pdfUrl = await pdfService.generarPdfTicket({
    ticket,
    compra
  });

  ticket.pdfUrl = pdfUrl;
  await ticket.save();

  return ticket;
};

module.exports = {
  crearTicket
};
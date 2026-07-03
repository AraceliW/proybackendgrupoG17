const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generarPdfTicket({ ticket, compra }) {
  return new Promise((resolve, reject) => {
    const carpetaTickets = path.join(__dirname, '../uploads/tickets');

    if (!fs.existsSync(carpetaTickets)) {
      fs.mkdirSync(carpetaTickets, { recursive: true });
    }

    const nombreArchivo = `ticket-${ticket.codigoTicket}.pdf`;
    const rutaArchivo = path.join(carpetaTickets, nombreArchivo);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(rutaArchivo);

    doc.pipe(stream);

    doc.fontSize(24).text('DIBUTICK', { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text('Ticket de entrada', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Código Ticket: ${ticket.codigoTicket}`);
    doc.text(`Código Compra: ${compra.codigoCompra}`);
    doc.text(`Estado Compra: ${compra.estado}`);
    doc.text(`Total: $${compra.total}`);
    doc.text(`Fecha Confirmación: ${compra.fechaConfirmacion}`);

    doc.moveDown();

    const qrBase64 = ticket.codigoQR.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(qrBase64, 'base64');

    doc.image(qrBuffer, {
      fit: [180, 180],
      align: 'center'
    });

    doc.moveDown();
    doc.fontSize(10).text('Presentá este ticket al ingresar al evento.', {
      align: 'center'
    });

    doc.end();

    stream.on('finish', () => {
      resolve(`/uploads/tickets/${nombreArchivo}`);
    });

    stream.on('error', reject);
  });
}

module.exports.generarPdfTicket = generarPdfTicket;
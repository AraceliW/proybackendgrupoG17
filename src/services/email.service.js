const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const enviarTicketPorEmail = async ({ usuario, ticket, compra }) => {
  const pdfPath = ticket.pdfUrl.replace('/uploads', 'src/uploads');

  const info = await transporter.sendMail({
    from: `"DIBUTICK" <${process.env.EMAIL_USER}>`,
    to: usuario.email,
    subject: 'Tu entrada DIBUTICK',
    html: `
      <h2>¡Compra confirmada!</h2>
      <p>Gracias por comprar en <b>DIBUTICK</b>.</p>
      <p><b>Código de compra:</b> ${compra.codigoCompra}</p>
      <p><b>Código de ticket:</b> ${ticket.codigoTicket}</p>
      <p><b>Total:</b> $${compra.total}</p>
      <p>Adjuntamos tu entrada en PDF.</p>
    `,
    attachments: [
      {
        filename: `ticket-${ticket.codigoTicket}.pdf`,
        path: pdfPath
      }
    ]
  });

  console.log('Correo enviado:', info.response);

  return info;
};

module.exports = {
  enviarTicketPorEmail
};
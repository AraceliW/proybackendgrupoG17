const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
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
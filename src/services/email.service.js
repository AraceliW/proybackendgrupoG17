const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const enviarTicketPorEmail = async ({ usuario, ticket, compra }) => {
  const pdfPath = path.join(
    process.cwd(),
    ticket.pdfUrl.replace('/uploads', 'src/uploads')
  );

  const pdfBuffer = fs.readFileSync(pdfPath);

  const info = await resend.emails.send({
    from: 'DIBUTICK <onboarding@resend.dev>',
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
        content: pdfBuffer
      }
    ]
  });

  console.log('Correo enviado:', info);
  return info;
};

module.exports = {
  enviarTicketPorEmail
};
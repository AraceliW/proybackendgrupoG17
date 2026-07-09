const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const enviarTicketPorEmail = async ({ usuario, ticket, compra }) => {
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
      <p>Tu entrada ya está disponible en tu perfil.</p>
    `
  });

  console.log('Correo enviado:', info);
  return info;
};

module.exports = {
  enviarTicketPorEmail
};
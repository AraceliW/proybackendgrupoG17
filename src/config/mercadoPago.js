const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const preference = new Preference(client);

module.exports = {
  preference
};
const axios = require("axios");

const obtenerCoordenadas = async (direccionCompleta) => {
    try {

        const url =
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccionCompleta)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        const { data } = await axios.get(url);

        if (data.status !== "OK") {
            return null;
        }

        return {
            latitud: data.results[0].geometry.location.lat,
            longitud: data.results[0].geometry.location.lng
        };

    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    obtenerCoordenadas
};
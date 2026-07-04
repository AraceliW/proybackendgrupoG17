const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, HistorialAcceso } = require('../models');

const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
  );
};

const registrar = async (req, res) => {
  try {
    const { nombre, apellido, dni, email, password, telefono } = req.body;

    const usuarioExiste = await Usuario.findOne({ where: { email } });

    if (usuarioExiste) {
      return res.status(400).json({
        mensaje: 'El email ya se encuentra registrado'
      });
    }

    if (!nombre || !apellido || !dni || !email || !password) {
      return res.status(400).json({
        mensaje: 'Faltan datos obligatorios'
      });
    } 

    const passwordHasheada = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      apellido,
      dni,
      email,
      password: passwordHasheada,
      telefono,
      provider: 'local',
      rol: 'cliente'
    });

    const token = generarToken(usuario);

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });
    }

    if (!usuario.estado) {
      return res.status(403).json({
        mensaje: 'Usuario inactivo'
      });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas'
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        mensaje: 'Email y contraseña son obligatorios'
      });
    }

    await HistorialAcceso.create({
      usuarioId: usuario.id,
      ip: req.ip,
      navegador: req.headers['user-agent']
    });

    const token = generarToken(usuario);

    res.json({
      mensaje: 'Login correcto',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

module.exports = {
  registrar,
  login
};
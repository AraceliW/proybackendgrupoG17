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

const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      dni: usuario.dni,
      email: usuario.email,
      telefono: usuario.telefono,
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

const loginGoogle = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const nombre = payload.given_name || 'Usuario';
    const apellido = payload.family_name || '';

    let usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      usuario = await Usuario.create({
        nombre,
        apellido,
        email,
        password: null,
        rol: 'cliente',
        estado: true
      });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: 'Login con Google exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        dni: usuario.dni,
        telefono: usuario.telefono
      }
    });

  } catch (error) {
    res.status(401).json({
      mensaje: 'Error al iniciar sesión con Google',
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
      dni: usuario.dni,
      email: usuario.email,
      telefono: usuario.telefono,
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

const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, apellido, dni, telefono } = req.body;

    await req.usuario.update({
      nombre,
      apellido,
      dni,
      telefono
    });

    res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: {
        id: req.usuario.id,
        nombre: req.usuario.nombre,
        apellido: req.usuario.apellido,
        dni: req.usuario.dni,
        email: req.usuario.email,
        telefono: req.usuario.telefono,
        rol: req.usuario.rol
      }
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

module.exports = {
  registrar,
  loginGoogle,
  login,
  actualizarPerfil
};
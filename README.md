# 🎟️ DIBUTICK - Backend

Backend de **DIBUTICK**, una plataforma web para la gestión y venta de entradas para eventos deportivos.

El sistema permite administrar eventos, tipos de entrada, compras, pagos mediante Mercado Pago, generación automática de tickets con código QR, reclamos y un panel de administración.

---

# 📌 Tecnologías utilizadas

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT
- bcrypt
- Mercado Pago SDK
- Nodemailer
- QRCode
- PDFKit
- Multer
- Express Validator
- Helmet
- Morgan
- CORS

---

# 📁 Estructura del proyecto

```
src
│
├── config
├── controllers
├── jobs
├── middlewares
├── models
├── routes
├── services
├── uploads
├── validators
│
├── app.js
└── server.js
```

---

# ⚙️ Instalación

## Clonar el proyecto

```bash
git clone https://github.com/AraceliW/proybackendgrupoG17.git
```

Ingresar al proyecto

```bash
cd backend-dibutick
```

Instalar dependencias

```bash
npm install
```

---

# 🔐 Variables de entorno

Copiar el archivo

```
.env.example
```

como

```
.env
```

y completar las variables correspondientes.

---

# 🗄️ Base de datos

Crear una base de datos PostgreSQL llamada:

```
dibutick_db
```

Configurar las credenciales en el archivo `.env`.

---

# ▶️ Ejecutar el proyecto

Modo desarrollo

```bash
npm run dev
```

Modo producción

```bash
npm start
```

El servidor quedará disponible en:

```
http://localhost:3000
```

---

# 📮 Colección Postman

La colección de pruebas se encuentra en:

```
docs/postman/
```

Importar:

- Dibutick.postman_collection.json
- Dibutick.postman_environment.json

---

# 💳 Mercado Pago Sandbox

Para realizar pruebas de pago:

1. Configurar `MP_ACCESS_TOKEN` en `.env`.
2. Ejecutar ngrok para exponer el backend.

```bash
ngrok http 3000
```

3. Actualizar la variable:

```
BACKEND_URL
```

con la URL generada por ngrok.

4. Utilizar cuentas **Test Seller** y **Test Buyer** proporcionadas por Mercado Pago.

---

# ✨ Funcionalidades

## Usuarios

- Registro
- Login
- JWT
- Roles
- Perfil

## Eventos

- Crear eventos
- Editar eventos
- Eliminar eventos
- Subir imágenes

## Entradas

- Administración de tipos de entrada
- Stock disponible

## Compras

- Reserva de entradas
- Confirmación de compra
- Expiración automática de reservas

## Mercado Pago

- Creación de preferencia
- Checkout Sandbox
- Webhook
- Confirmación automática del pago

## Tickets

- Generación automática
- Código QR
- Validación
- Cancelación
- Reenvío por correo electrónico

## Reclamos

- Creación
- Respuesta del administrador

## Administración

- Dashboard
- Reportes
- Gestión de usuarios
- Gestión de compras
- Gestión de tickets

---

# 🔒 Seguridad

- JWT Authentication
- Roles de usuario
- Passwords encriptadas con bcrypt
- Helmet
- CORS
- Rate Limiter
- Validaciones con Express Validator

---

# 👥 Integrantes

- Agustín Callata
- Araceli Lopez
- Matias Ortega

---

# 📄 Licencia

Proyecto desarrollado con fines académicos.
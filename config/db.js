require('dotenv').config();
const mongoose = require('mongoose');

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const bd = process.env.DB_NAME;
const host = process.env.DB_HOST;
const options = process.env.DB_OPTIONS;

const uri = `mongodb+srv://${user}:${password}@${host}/${bd}${options}`;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function conectarDB() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log(`✅ Conexión exitosa con la bd ${bd}`);
  } catch (error) {
    console.error("❌ Fallo al conectar con la bd:", error);
  }
}

module.exports = { conectarDB, mongoose };
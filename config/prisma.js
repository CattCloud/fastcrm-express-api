const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const verificarConexionPostgres = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Conectado a PostgreSQL con Prisma");
  } catch (error) {
    console.error("❌ Error al conectar a PostgreSQL:", error);
    process.exit(1); // Opcional: detener si falla
  }
};

module.exports = { prisma,verificarConexionPostgres};
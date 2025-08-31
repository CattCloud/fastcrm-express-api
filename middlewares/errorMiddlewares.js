const { AppError } = require("../utils/AppError");

// Detectar y transformar errores de Mongoose
function mongooseErrorTransform(err, req, res, next) {

  if (err.name === "ValidationError") {
    const mensajes = Object.values(err.errors).map(e => e.message);
    return next(new AppError(`Error de validación: ${mensajes.join(", ")}`, 400, "validacion"));
  }

  if (err.name === "CastError") {
    return next(new AppError(`Formato inválido en el campo '${err.path}' con valor '${err.value}'`, 400, "cast"));
  }

  if (err.code && err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return next(new AppError(`El valor '${err.keyValue[campo]}' ya existe en el campo '${campo}'`, 409, "duplicado"));
  }

  if (err.name === "DocumentNotFoundError") {
    return next(new AppError("Documento no encontrado", 404, "no-encontrado"));
  }

  if (err.name === "StrictModeError") {
    return next(new AppError(`Campo '${err.path}' no está permitido en el esquema`, 400, "estricto"));
  }

  if (err.name === "DisconnectedError") {
    return next(new AppError("No hay conexión con la base de datos", 503, "conexion"));
  }

  if (err.name === "ParallelSaveError") {
    return next(new AppError("Conflicto: documento guardado en paralelo", 409, "concurrencia"));
  }

  if (err.name === "VersionError") {
    return next(new AppError("Conflicto de versión en documento", 409, "version"));
  }

  return next(err);
}

function errorHandler(err, req, res, next) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      estado: err.status,
      mensaje: err.message,
      tipo: err.tipo
    });
  } else {
    console.error('ERROR NO OPERACIONAL', err);
    res.status(500).json({
      status: err.status || "error",
      message: "Algo salió mal en el servidor",
      tipo: err.tipo || "general"
    });
  }
};


module.exports = { mongooseErrorTransform ,errorHandler};

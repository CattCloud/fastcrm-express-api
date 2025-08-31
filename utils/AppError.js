class AppError extends Error {
    constructor(message, statusCode=500, tipo = 'general') {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.tipo = tipo; // Tipo de error personalizado
        this.isOperational = true; // Indica que es un error esperado
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {AppError};
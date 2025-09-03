const cors = require('cors');

const middlewareCors = cors({
  origin: 'http://localhost:5173', // o '*' para permitir todos los orígenes (solo en desarrollo)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
});

module.exports = middlewareCors;

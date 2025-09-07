const cors = require('cors');

const middlewareCors = cors({
  origin: 'http://localhost:5173' || "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
});

module.exports = middlewareCors;

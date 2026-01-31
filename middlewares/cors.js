const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://fastcrm-react-app-fat3.onrender.com'
];

const middlewareCors = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
});

module.exports = middlewareCors;


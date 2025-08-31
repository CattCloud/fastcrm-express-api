const { mongoose } = require("../config/db.js");

const UnlistedTagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    trim: true
  },
  vecesDetectada: {
    type: Number,
    default: 1,
    min: 1
  },
  normalizada: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  promovida: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("UnlistedTag", UnlistedTagSchema);
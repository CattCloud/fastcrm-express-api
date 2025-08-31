const { mongoose } = require("../config/db.js");

const SuggestedTagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  visible: {
    type: Boolean,
    default: true
  },
  uso: {
    type: Number,
    default: 0,
    min: 0
  },
  bloqueada: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Para createdAt y updatedAt
});

module.exports = mongoose.model("SuggestedTag", SuggestedTagSchema);
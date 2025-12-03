const mongoose = require('mongoose');

const ConversionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  result: { type: Number, required: true },
  rate: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversion', ConversionSchema);

const mongoose = require('mongoose');

const fraudAppSchema = new mongoose.Schema({
  app_name: { type: String, required: true },
  developer: String,
  category: { type: String, required: true },
  risk_level: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
  reported_on: { type: Date, default: Date.now },
  status: { type: String, enum: ['Reported', 'Under Investigation', 'Blocked', 'Resolved'], default: 'Reported' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const fraudUrlSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  risk_level: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
  detected_on: { type: Date, default: Date.now },
  status: { type: String, enum: ['Reported', 'Under Investigation', 'Blocked', 'Resolved'], default: 'Reported' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const FraudApp = mongoose.model('FraudApp', fraudAppSchema);
const FraudUrl = mongoose.model('FraudUrl', fraudUrlSchema);

module.exports = { FraudApp, FraudUrl };
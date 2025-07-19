const { FraudApp, FraudUrl } = require('../models/FraudData');

// --- Combined Data Fetching ---
exports.getAllFraudData = async (req, res) => {
  try {
    const [apps, urls] = await Promise.all([
      FraudApp.find().populate('reportedBy', 'name email').sort({ reported_on: -1 }),
      FraudUrl.find().populate('reportedBy', 'name email').sort({ detected_on: -1 })
    ]);
    res.json({ apps, urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Fraud App Management ---
exports.createFraudApp = async (req, res) => {
  try {
    const fraudApp = await FraudApp.create({ ...req.body, reportedBy: req.user.id });
    res.status(201).json(fraudApp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateFraudApp = async (req, res) => {
  try {
    const app = await FraudApp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    res.json(app);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFraudApp = async (req, res) => {
  try {
    const app = await FraudApp.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    await app.deleteOne();
    res.json({ message: 'Fraud app deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Fraud URL Management ---
exports.createFraudUrl = async (req, res) => {
  try {
    const url = await FraudUrl.create({ ...req.body, reportedBy: req.user.id });
    res.status(201).json(url);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateFraudUrl = async (req, res) => {
  try {
    const url = await FraudUrl.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }
    res.json(url);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFraudUrl = async (req, res) => {
  try {
    const url = await FraudUrl.findById(req.params.id);
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }
    await url.deleteOne();
    res.json({ message: 'Fraud URL deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
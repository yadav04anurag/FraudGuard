const { FraudApp, FraudUrl } = require('../models/FraudData');

// @desc    Get all publicly visible fraud data
// @route   GET /api/fraud-data
// @access  Private (any authenticated user)
exports.getPublicFraudData = async (req, res) => {
  try {
    // For the public feed, we only show verified items or items under investigation
    const urls = await FraudUrl.find({ status: { $in: ['Blocked', 'Resolved', 'Under Investigation'] } })
      .sort({ detected_on: -1 });
      
    const apps = await FraudApp.find({ status: { $in: ['Blocked', 'Resolved', 'Under Investigation'] } })
      .sort({ reported_on: -1 });

    // For the recent activity feed, we get the latest 5 of any status
    const recentUrls = await FraudUrl.find({}).sort({ detected_on: -1 }).limit(5);
    const recentApps = await FraudApp.find({}).sort({ reported_on: -1 }).limit(5);

    res.json({
      publicUrls: urls,
      publicApps: apps,
      recentActivity: [...recentUrls, ...recentApps].sort((a, b) => 
        (b.detected_on || b.reported_on) - (a.detected_on || a.reported_on)
      ).slice(0, 7) // Get the top 7 most recent items combined
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Allow a user to report a new fraudulent URL
// @route   POST /api/fraud-data/report
// @access  Private (any authenticated user)
exports.reportFraudUrl = async (req, res) => {
  const { url, category } = req.body;

  if (!url || !category) {
    return res.status(400).json({ message: 'Please provide a URL and a category.' });
  }

  try {
    const existingUrl = await FraudUrl.findOne({ url });
    if (existingUrl) {
      return res.status(400).json({ message: 'This URL has already been reported.' });
    }

    const newFraudUrl = await FraudUrl.create({
      url,
      category,
      reportedBy: req.user.id,
      status: 'Reported', // Default status for user submissions
      risk_level: 'Medium', // Default risk, admin can change
    });

    res.status(201).json(newFraudUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const PowerStatus = require('../models/PowerStatus');

// @desc    Get current power grid status
// @route   GET /api/power-status
// @access  Public
const getPowerStatus = async (req, res, next) => {
  try {
    let status = await PowerStatus.findOne().sort({ updatedAt: -1 });
    if (!status) {
      status = await PowerStatus.create({
        isPowerOn: true,
        reason: 'Grid operating normally',
        expectedRestorationTime: 'N/A',
      });
    }
    res.json(status);
  } catch (error) {
    next(error);
  }
};

// @desc    Update power grid status
// @route   PUT /api/power-status
// @access  Private (Admin)
const updatePowerStatus = async (req, res, next) => {
  try {
    const { isPowerOn, reason, expectedRestorationTime } = req.body;

    let status = await PowerStatus.findOne();

    if (status) {
      status.isPowerOn = isPowerOn;
      status.reason = reason || status.reason;
      status.expectedRestorationTime = expectedRestorationTime || 'N/A';
      status.updatedBy = req.user._id;
      const updatedStatus = await status.save();
      res.json(updatedStatus);
    } else {
      const newStatus = await PowerStatus.create({
        isPowerOn,
        reason: reason || 'Grid Status Updated',
        expectedRestorationTime: expectedRestorationTime || 'N/A',
        updatedBy: req.user._id,
      });
      res.status(201).json(newStatus);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getPowerStatus, updatePowerStatus };
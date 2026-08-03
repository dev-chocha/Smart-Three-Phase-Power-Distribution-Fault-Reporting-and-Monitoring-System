const mongoose = require('mongoose');

const powerStatusSchema = new mongoose.Schema(
  {
    isPowerOn: {
      type: Boolean,
      required: true,
      default: true,
    },
    reason: {
      type: String,
      default: 'Normal Operation',
    },
    expectedRestorationTime: {
      type: String,
      default: 'N/A',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PowerStatus', powerStatusSchema);
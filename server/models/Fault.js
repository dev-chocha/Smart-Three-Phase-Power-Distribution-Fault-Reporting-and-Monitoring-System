const mongoose = require('mongoose');

const faultSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Fault title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Transformer',
        'Distribution Line',
        'Pole Damage',
        'Cable Fault',
        'Fuse Failure',
        'Meter Problem',
        'Street Light',
        'Low Voltage',
        'Power Failure',
        'Other',
      ],
    },
    severity: {
      type: String,
      required: [true, 'Severity level is required'],
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Rejected'],
      default: 'Pending',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    village: {
      type: String,
      required: [true, 'Village is required'],
    },
    exactLocation: {
      type: String,
      required: [true, 'Exact location details are required'],
    },
    gpsLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    imageUrl: {
      type: String,
      default: '',
    },
    assignedEngineer: {
      type: String,
      default: 'Not Assigned',
    },
    repairTime: {
      type: String,
      default: 'To be determined',
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fault', faultSchema);
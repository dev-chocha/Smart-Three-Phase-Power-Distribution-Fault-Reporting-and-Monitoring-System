const Fault = require('../models/Fault');

// Generate unique Complaint ID (e.g., FLT-20260803-9821)
const generateComplaintId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `FLT-${dateStr}-${randomStr}`;
};

// @desc    Create new fault complaint
// @route   POST /api/faults
// @access  Private (Citizen)
const createFault = async (req, res, next) => {
  try {
    const { title, category, severity, description, village, exactLocation, latitude, longitude } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const fault = await Fault.create({
      complaintId: generateComplaintId(),
      reporter: req.user._id,
      title,
      category,
      severity,
      description,
      village,
      exactLocation,
      gpsLocation: {
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
      },
      imageUrl,
    });

    res.status(201).json(fault);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's reported faults
// @route   GET /api/faults/myfaults
// @access  Private (Citizen)
const getMyFaults = async (req, res, next) => {
  try {
    const faults = await Fault.find({ reporter: req.user._id }).sort({ createdAt: -1 });
    res.json(faults);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reported faults
// @route   GET /api/faults
// @access  Private (Admin)
const getAllFaults = async (req, res, next) => {
  try {
    const { status, severity, category, search } = req.query;

    let query = {};

    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { village: { $regex: search, $options: 'i' } },
      ];
    }

    const faults = await Fault.find(query)
      .populate('reporter', 'name email mobileNumber')
      .sort({ createdAt: -1 });

    res.json(faults);
  } catch (error) {
    next(error);
  }
};

// @desc    Update fault status / assign engineer
// @route   PUT /api/faults/:id
// @access  Private (Admin)
const updateFaultStatus = async (req, res, next) => {
  try {
    const { status, assignedEngineer, repairTime, remarks } = req.body;

    const fault = await Fault.findById(req.params.id);

    if (!fault) {
      return res.status(404).json({ message: 'Fault complaint not found' });
    }

    if (status) fault.status = status;
    if (assignedEngineer) fault.assignedEngineer = assignedEngineer;
    if (repairTime) fault.repairTime = repairTime;
    if (remarks !== undefined) fault.remarks = remarks;

    const updatedFault = await fault.save();
    res.json(updatedFault);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a fault complaint
// @route   DELETE /api/faults/:id
// @access  Private (Admin)
const deleteFault = async (req, res, next) => {
  try {
    const fault = await Fault.findById(req.params.id);

    if (!fault) {
      return res.status(404).json({ message: 'Fault complaint not found' });
    }

    await fault.deleteOne();
    res.json({ message: 'Fault complaint removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFault,
  getMyFaults,
  getAllFaults,
  updateFaultStatus,
  deleteFault,
};
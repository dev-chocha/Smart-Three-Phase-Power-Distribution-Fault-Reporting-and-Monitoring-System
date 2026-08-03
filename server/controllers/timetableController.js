const Timetable = require('../models/Timetable');

// @desc    Get complete weekly schedule
// @route   GET /api/timetable
// @access  Public
const getTimetable = async (req, res, next) => {
  try {
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timetable = await Timetable.find();

    // Sort response chronologically by day
    const sorted = timetable.sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));
    res.json(sorted);
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Upsert day schedule slot
// @route   POST /api/timetable
// @access  Private (Admin)
const createOrUpdateSlot = async (req, res, next) => {
  try {
    const { day, slots } = req.body;

    let daySchedule = await Timetable.findOne({ day });

    if (daySchedule) {
      daySchedule.slots = slots;
      daySchedule.updatedBy = req.user._id;
      const updated = await daySchedule.save();
      return res.json(updated);
    }

    const created = await Timetable.create({
      day,
      slots,
      updatedBy: req.user._id,
    });

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

// @desc    Update single timetable entry
// @route   PUT /api/timetable/:id
// @access  Private (Admin)
const updateTimetable = async (req, res, next) => {
  try {
    const { day, slots } = req.body;
    const schedule = await Timetable.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule entry not found' });
    }

    if (day) schedule.day = day;
    if (slots) schedule.slots = slots;
    schedule.updatedBy = req.user._id;

    const updated = await schedule.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single timetable day entry
// @route   DELETE /api/timetable/:id
// @access  Private (Admin)
const deleteTimetable = async (req, res, next) => {
  try {
    const schedule = await Timetable.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule entry not found' });
    }
    await schedule.deleteOne();
    res.json({ message: 'Day schedule removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTimetable,
  createOrUpdateSlot,
  updateTimetable,
  deleteTimetable,
};
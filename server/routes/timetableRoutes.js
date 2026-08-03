const express = require('express');
const router = express.Router();
const {
  getTimetable,
  createOrUpdateSlot,
  updateTimetable,
  deleteTimetable,
} = require('../controllers/timetableController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getTimetable);
router.post('/', protect, adminOnly, createOrUpdateSlot);
router.put('/:id', protect, adminOnly, updateTimetable);
router.delete('/:id', protect, adminOnly, deleteTimetable);

module.exports = router;
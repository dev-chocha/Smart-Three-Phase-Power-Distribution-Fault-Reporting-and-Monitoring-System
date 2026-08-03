const express = require('express');
const router = express.Router();
const {
  createFault,
  getMyFaults,
  getAllFaults,
  updateFaultStatus,
  deleteFault,
} = require('../controllers/faultController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('image'), createFault);
router.get('/myfaults', protect, getMyFaults);
router.get('/', protect, adminOnly, getAllFaults);
router.put('/:id', protect, adminOnly, updateFaultStatus);
router.delete('/:id', protect, adminOnly, deleteFault);

module.exports = router;
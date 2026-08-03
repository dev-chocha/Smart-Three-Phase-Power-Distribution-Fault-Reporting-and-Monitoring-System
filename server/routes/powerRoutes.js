const express = require('express');
const router = express.Router();
const { getPowerStatus, updatePowerStatus } = require('../controllers/powerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getPowerStatus);
router.put('/', protect, adminOnly, updatePowerStatus);

module.exports = router;
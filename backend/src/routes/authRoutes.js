const express = require('express');
const router = express.Router();
const { syncUser } = require('../controllers/authController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');

router.post('/sync', verifyFirebaseToken, syncUser);

module.exports = router;

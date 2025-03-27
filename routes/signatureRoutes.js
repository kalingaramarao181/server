const express = require('express');
const { signDocument, getSignatures } = require('../controllers/signatureController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/sign', protect, signDocument);
router.get('/:documentId', protect, getSignatures);

module.exports = router;

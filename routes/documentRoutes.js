const express = require('express');
const multer = require('multer');
const { uploadDocument, assignSigners, getUserDocuments, signDocument, downloadDocument, getAssignedDocuments,  } = require('../controllers/documentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getDocumentBySignerId } = require('../models/documentModel');

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// authorize(['document_owner', 'team_admin']),

const upload = multer({ storage });

// Routes
router.post('/upload', protect,  upload.single('document'), uploadDocument);
router.post('/assign-signers', protect, authorize(['document_owner', 'team_admin']), assignSigners);
router.get('/my-documents/:id', protect, getUserDocuments);
router.post('/sign', protect, authorize(['user', 'team_member']), signDocument);
router.get('/download/:id', protect, downloadDocument);
router.get('/document-by-signer/:signerId', protect, getAssignedDocuments);

module.exports = router;

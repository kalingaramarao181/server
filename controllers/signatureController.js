const db = require('../config/db');
const crypto = require('crypto');
const moment = require('moment');
const { sendNotification } = require('./notificationController');

// Generate Digital Signature
const signDocument = (req, res) => {
    const { documentId } = req.body;
    const userId = req.user.id;

    // Generate signature using SHA256
    const signature = crypto.createHash('sha256').update(`${documentId}-${userId}-${Date.now()}`).digest('hex');

    db.query(
        `INSERT INTO signatures (document_id, user_id, signature) VALUES (?, ?, ?)`,
        [documentId, userId, signature],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Notify document owner
            db.query(`SELECT owner_id FROM documents WHERE id = ?`, [documentId], (err, results) => {
                if (results.length > 0) {
                    sendNotification(results[0].owner_id, `Your document has been signed by ${req.user.name}.`, req.app.get('io'));
                }
            });

            res.status(201).json({ message: "Document signed successfully", signature });
        }
    );
};

// Get Signatures for a Document
const getSignatures = (req, res) => {
    const { documentId } = req.params;

    db.query(
        `SELECT u.name, s.signature, s.signed_at FROM signatures s JOIN users u ON s.user_id = u.id WHERE s.document_id = ?`,
        [documentId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
};

module.exports = { signDocument, getSignatures };

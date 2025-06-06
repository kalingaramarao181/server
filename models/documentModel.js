const db = require('../config/db');

const Document = {
    upload: (userId, signerUser, title, filePath, status = 'pending') => {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO documents (user_id, signer_email, title, file_path, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
                [userId, signerUser, title, filePath, status],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    },

    update: (documentId, userId, signerUser, title, filePath, status = 'signed', signerRole = 'signer') => {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE documents SET title = ?, file_path = ?, status = ?, created_at = NOW() WHERE id = ?`,
                [ title, filePath, status, documentId],
                (err, updateResult) => {
                    if (err) return reject(err);
    
                    db.query(
                        `INSERT INTO document_signers (document_id, user_id, signer_role, status) VALUES (?, ?, ?, ?)`,
                        [documentId, userId, signerRole, status],
                        (err, signerResult) => {
                            if (err) return reject(err);
    
                            resolve({
                                documentUpdate: updateResult,
                                signerInsert: signerResult
                            });
                        }
                    );
                }
            );
        });
    },
    

    addSigners: (documentId, signerIds) => {
        return new Promise((resolve, reject) => {
            const values = signerIds.map(id => [documentId, id, 'pending']);
            db.query(
                `INSERT INTO document_signers (document_id, signer_id, status) VALUES ?`,
                [values],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    },

    getDocumentsByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM documents WHERE user_id = ?`,
                [userId],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    },

    getDocumentById: (documentId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM documents WHERE id = ?`,
                [documentId],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result[0]);
                }
            );
        });
    },

    getDocumentsBySignerId: (signerEmail) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM documents WHERE signer_email = ?`,
                [signerEmail],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }   
            );
        });
    },

    updateStatus: (documentId, status) => {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE documents SET status = ? WHERE id = ?`,
                [status, documentId],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    },

    markSignerAsSigned: (documentId, signerId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE document_signers SET status = 'signed', signed_at = NOW() WHERE document_id = ? AND signer_id = ?`,
                [documentId, signerId],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    }
};


module.exports = Document;

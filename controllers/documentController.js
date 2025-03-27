const Document = require('../models/documentModel');
const path = require('path');
const fs = require('fs');
const sendEmail = require("../utils/emailService");
const getEmailTemplate = require('../utils/getEmailTamplate');

// Upload Document
const uploadDocument = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
        const filePath = req.file.path.replace(/\\/g, '/');
        await Document.upload(req.user.id, req.body.signerUser, req.file.filename, filePath);

        const signerUserEmail = req.body.signerUserEmail; 
        console.log(signerUserEmail);
        

        if (signerUserEmail) {
            const subject = "New Document Assigned for Signing";
            const text = `You have been assigned a new document for signing. Access it here: ${filePath}`;
            const html = getEmailTemplate(filePath)

            await sendEmail(signerUserEmail, subject, text, html);
        }

        res.status(201).json({ message: "Document uploaded successfully and email sent!" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Assign Signers to Document
const assignSigners = async (req, res) => {
    const { documentId, signerIds } = req.body;
    
    if (!signerIds || !signerIds.length) {
        return res.status(400).json({ message: "At least one signer is required" });
    }

    try {
        await Document.addSigners(documentId, signerIds);
        res.status(200).json({ message: "Signers assigned successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get User Documents
const getUserDocuments = async (req, res) => {
    try {
        const documents = await Document.getDocumentsByUserId(req.params.id);
        res.status(200).json(documents);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getAssignedDocuments = async (req, res) => {
    try {
        const documents = await Document.getDocumentsBySignerId(req.params.signerId);
        res.status(200).json(documents);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};



// Mark Document as Signed
const signDocument = async (req, res) => {
    const { documentId } = req.body;       

    try {
        await Document.markSignerAsSigned(documentId, req.user.id);

        const remainingSigners = await Document.getSignersPending(documentId);
        if (remainingSigners.length === 0) {
            await Document.updateStatus(documentId, 'signed');
        }

        res.status(200).json({ message: "Document signed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// Download Document
const downloadDocument = async (req, res) => {
    try {
        const document = await Document.getDocumentById(req.params.id);
        if (!document) return res.status(404).json({ message: "Document not found" });

        const filePath = path.join(__dirname, '..', document.file_path);
        res.download(filePath, document.file_name);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { uploadDocument, assignSigners, getUserDocuments, signDocument, downloadDocument, getAssignedDocuments };

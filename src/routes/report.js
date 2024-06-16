const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const admin = require('firebase-admin');
const upload = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const db = require('../config/firestore');

// GET all reports (filtered by authenticated user)
router.get('/report', authMiddleware, async (req, res) => {
    try {
        const reportsSnapshot = await db.collection('reports').where('user_id', '==', req.userId).get();
        const reports = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ message: 'Reports retrieved successfully.', data: reports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// POST new report for the authenticated user
router.post('/report', authMiddleware, upload.single('photo'), async (req, res) => {
    const { name, email, phone_number, address, city, province, many_have, affected_body_part, prediction, score, latitude, longitude } = req.body;

    try {
        const newReport = {
            user_id: req.userId,
            name,
            email,
            phone_number,
            address,
            city,
            province,
            many_have,
            affected_body_part,
            prediction,
            score,
            latitude: parseFloat(latitude) || null,
            longitude: parseFloat(longitude) || null,
            createdAt: new Date()
        };

        // Handle file upload if available
        if (req.file) {
            const bucket = admin.storage().bucket();
            const fileName = `reports/${req.file.originalname}`;
            const file = bucket.file(fileName);

            const stream = file.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype
                }
            });

            stream.on('error', (err) => {
                console.error('Upload error:', err);
                return res.status(500).json({ message: 'An error occurred while uploading the file. Please try again later.' });
            });

            stream.on('finish', async () => {
                // Make the file publicly accessible
                await file.makePublic();
                newReport.photo = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

                // Save report to Firestore
                try {
                    const reportRef = await db.collection('reports').add(newReport);
                    res.json({ message: 'Report added successfully.', data: { id: reportRef.id, ...newReport } });
                } catch (error) {
                    console.error('Firestore error:', error);
                    res.status(500).json({ message: 'An error occurred while saving the report. Please try again later.' });
                }
            });

            stream.end(req.file.buffer);
        } else {
            // Save report to Firestore if no file uploaded
            const reportRef = await db.collection('reports').add(newReport);
            res.json({ message: 'Report added successfully.', data: { id: reportRef.id, ...newReport } });
        }
    } catch (error) {
        console.error('Unexpected error:', error); // Clearly logging error
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// GET report by ID (ensure only the owner can access)
router.get('/report/:id', authMiddleware, async (req, res) => {
    try {
        const reportRef = db.collection('reports').doc(req.params.id);
        const reportDoc = await reportRef.get();

        if (!reportDoc.exists) {
            return res.status(404).json({ message: 'Report not found.' });
        }

        if (reportDoc.data().user_id !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized access to view report.' });
        }

        res.json({ message: 'Report details retrieved successfully.', data: { id: reportDoc.id, ...reportDoc.data() } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

module.exports = router;

// src/routes/report.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const admin = require('firebase-admin');
const upload = require('../middleware/upload'); 
const { body, validationResult } = require('express-validator');
const db = require('../config/firestore');

// GET all reports
router.get('/report', authMiddleware, async (req, res) => {
    try {
        const reportsSnapshot = await db.collection('reports').get();
        const reports = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ message: 'Reports retrieved successfully.', data: reports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// GET report by ID
router.put('/report/:id', authMiddleware, upload.single('photo'), async (req, res) => {
    const { id } = req.params;
    const { name, phone_number } = req.body;

    try {
        const reportRef = db.collection('reports').doc(id);
        const reportDoc = await reportRef.get();

        if (!reportDoc.exists) {
            return res.status(404).json({ message: 'Report not found.' });
        }

        const updatedData = {
            name: name || reportDoc.data().name,
            phone_number: phone_number || reportDoc.data().phone_number,
            photo: req.file ? req.file.path : reportDoc.data().photo
        };

        await reportRef.update(updatedData);

        res.json({ message: 'Report updated successfully.', data: { id: id, ...updatedData } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});


// POST new report
router.post('/report', authMiddleware, async (req, res) => {
    const { name, email, phone_number, address, city, province, many_have, affected_body_part, prediction, score, latitude, longitude } = req.body;
    
    try {
        const newReport = {
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

        // Periksa 
        if (req.file) {
            const fileUpload = await admin.storage().bucket().upload(req.file.path, {
                destination: `reports/${req.file.originalname}`, 
                metadata: {
                    contentType: req.file.mimetype
                }
            });

            // Dapatkan URL file yang diunggah
            newReport.photo = fileUpload[0].metadata.mediaLink;
        }

        // Tambahkan data laporan ke Firestore
        const reportRef = await db.collection('reports').add(newReport);
        res.json({ message: 'Laporan berhasil ditambahkan.', data: { id: reportRef.id, ...newReport } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti.' });
    }
});

// PUT update report by ID
router.put('/report/:id', authMiddleware, upload.single('photo'), [
    body('name').optional().notEmpty().withMessage('Name must not be empty'),
    body('phone_number').optional().notEmpty().withMessage('Phone number must not be empty')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone_number } = req.body;
    try {
        const reportRef = db.collection('reports').doc(req.params.id);
        const reportDoc = await reportRef.get();
        if (!reportDoc.exists) {
            return res.status(404).json({ message: 'Report not found.' });
        }

        const updatedData = {
            name: name || reportDoc.data().name,
            phone_number: phone_number || reportDoc.data().phone_number,
            photo: req.file ? req.file.path : reportDoc.data().photo
        };
        await reportRef.update(updatedData);
        res.json({ message: 'Report updated successfully.', data: { id: req.params.id, ...updatedData } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// DELETE report by ID
router.delete('/report/:id', authMiddleware, async (req, res) => {
    try {
        const reportRef = db.collection('reports').doc(req.params.id);
        const reportDoc = await reportRef.get();
        if (!reportDoc.exists) {
            return res.status(404).json({ message: 'Report not found.' });
        }

        await reportRef.delete();
        res.json({ message: 'Report deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

module.exports = router;

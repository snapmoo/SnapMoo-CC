// src/routes/report.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
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
router.get('/report/:id', authMiddleware, async (req, res) => {
    try {
        const reportRef = db.collection('reports').doc(req.params.id);
        const reportDoc = await reportRef.get();
        if (!reportDoc.exists) {
            return res.status(404).json({ message: 'Report not found.' });
        }
        res.json({ message: 'Report details retrieved successfully.', data: { id: reportDoc.id, ...reportDoc.data() } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// POST new report
router.post('/report', authMiddleware, upload.single('photo'), [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('phone_number').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('province').notEmpty().withMessage('Province is required'),
    body('many_have').isInt({ min: 1 }).withMessage('Must be at least 1'),
    body('affected_body_part').notEmpty().withMessage('Affected body part is required'),
    body('prediction').notEmpty().withMessage('Prediction is required'),
    body('score').isInt({ min: 0 , max: 100 }).withMessage('Score must be between 0 and 100'),
    body('latitude').optional().isFloat().withMessage('Latitude must be a number'),
    body('longitude').optional().isFloat().withMessage('Longitude must be a number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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
            photo: req.file ? req.file.path : null,
            createdAt: new Date()
        };
        const reportRef = await db.collection('reports').add(newReport);
        res.json({ message: 'Report added successfully.', data: { id: reportRef.id, ...newReport } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
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

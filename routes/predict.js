const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const admin = require('firebase-admin');
let predictions = [];

router.post('/predict', authMiddleware, upload.single('photo'), (req, res) => {
    // Dummy prediction logic
    const prediction = {
        prediction_id: predictions.length + 1,
        result: 'Healthy',
        score: 90,
        created_at: new Date(),
    };
    predictions.push(prediction);
    res.json({ message: 'Prediction successful.', data: prediction });
});

router.get('/history', authMiddleware, (req, res) => {
    res.json({ message: 'Prediction history retrieved successfully.', data: predictions });
});

router.post('/history', authMiddleware, (req, res) => {
    const { prediction_id, result, score, created_at } = req.body;
    const newPrediction = { prediction_id, result, score, created_at: new Date(created_at) };
    predictions.push(newPrediction);
    res.json({ message: 'Prediction history added successfully.' });
});

module.exports = router;

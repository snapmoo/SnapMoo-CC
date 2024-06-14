const express = require('express');
const router = express.Router();
const db = require('../config/firestore');
const authMiddleware = require('../middleware/auth');

// Function to get the current highest predict_id
async function getCurrentMaxPredictId() {
    const snapshot = await db.collection('history').orderBy('predict_id', 'desc').limit(1).get();
    if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return doc.data().predict_id;
    } else {
        return 0; // If no documents found, start predict_id from 0
    }
}

// GET prediction history
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const historySnapshot = await db.collection('history').where('user_id', '==', req.userId).get();
        const history = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ message: 'Prediction history retrieved successfully.', data: history });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// POST add prediction history
router.post('/history', authMiddleware, async (req, res) => {
    const { result, score, created_at } = req.body;
    try {
        const currentMaxPredictId = await getCurrentMaxPredictId();
        const prediction_id = currentMaxPredictId + 1;

        console.log('Generated predict_id:', prediction_id);

        const newHistory = {
            user_id: req.userId,
            predict_id, // Use predict_id instead of prediction_id
            result,
            score,
            created_at: new Date(created_at),
            is_saved: false
        };

        const historyRef = await db.collection('history').add(newHistory);
        res.status(201).json({ message: 'Prediction history added successfully.', data: { id: historyRef.id, ...newHistory } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// PUT update saved status for a history record
router.put('/history/:id/save', authMiddleware, async (req, res) => {
    try {
        const historyRef = db.collection('history').doc(req.params.id);
        const historyDoc = await historyRef.get();
        if (!historyDoc.exists) {
            return res.status(404).json({ message: 'History record not found.' });
        }

        const isSaved = req.body.is_saved;

        await historyRef.update({ is_saved: isSaved });
        res.status(200).json({ message: 'History record saved status updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// GET all bookmarked history
router.get('/history/saved', authMiddleware, async (req, res) => {
    try {
        const savedHistorySnapshot = await db.collection('history').where('user_id', '==', req.userId).where('is_saved', '==', true).get();
        const savedHistory = savedHistorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ message: 'Saved prediction history retrieved successfully.', data: savedHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

module.exports = router;

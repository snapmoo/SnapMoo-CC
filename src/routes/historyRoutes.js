// src/routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/firestore');
const authMiddleware = require('../middleware/auth');
const admin = require('firebase-admin');
const upload = require('../middleware/upload');

// GET prediction history for the authenticated user
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

// POST add prediction history for the authenticated user
router.post('/history', authMiddleware, upload.single('photo'), async (req, res) => {
    const { result, score, created_at } = req.body;
    try {
        const newHistory = {
            user_id: req.userId,
            result,
            score,
            created_at: new Date(created_at),
            is_saved: false
        };

        if (req.file) {
            const bucket = admin.storage().bucket();
            const fileName = `history/${req.file.originalname}`;
            const file = bucket.file(fileName);

            const stream = file.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype
                }
            });

            stream.on('error', (err) => {
                console.error('Upload error:', err);
                return res.status(500).json({ message: 'Error uploading file. Please try again later.' });
            });

            stream.on('finish', async () => {
                await file.makePublic();
                newHistory.photo = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

                try {
                    const historyRef = await db.collection('history').add(newHistory);
                    res.status(201).json({ message: 'Prediction history added successfully.', data: { id: historyRef.id, ...newHistory } });
                } catch (error) {
                    console.error('Firestore error:', error);
                    res.status(500).json({ message: 'Error saving prediction history. Please try again later.' });
                }
            });

            stream.end(req.file.buffer);
        } else {
            const historyRef = await db.collection('history').add(newHistory);
            res.status(201).json({ message: 'Prediction history added successfully.', data: { id: historyRef.id, ...newHistory } });
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// PUT update saved status for a history record for the authenticated user
router.put('/history/save/:id', authMiddleware, async (req, res) => {
    try {
        const historyRef = db.collection('history').doc(req.params.id);
        const historyDoc = await historyRef.get();
        if (!historyDoc.exists) {
            return res.status(404).json({ message: 'History record not found.' });
        }
        if (historyDoc.data().user_id !== req.userId) {
            return res.status(403).json({ message: 'Forbidden. You do not have access to this record.' });
        }

        const isSaved = req.body.is_saved;
        await historyRef.update({ is_saved: isSaved });
        res.status(200).json({ message: 'History record saved status updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// GET all bookmarked history for the authenticated user
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

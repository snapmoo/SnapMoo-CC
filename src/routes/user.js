// src/routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const db = require('../config/firestore');

// GET user profile
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json([{ message: 'User not found.' }]);
        }
        res.json([{ message: 'User profile retrieved successfully.', data: { id: userDoc.id, ...userDoc.data() } }]);
    } catch (error) {
        console.error(error);
        res.status(500).json([{ message: 'An unexpected error occurred. Please try again later.' }]);
    }
});

// PUT update user profile
router.put('/user', authMiddleware, upload.single('photo'), [
    body('name').optional().notEmpty().withMessage('Name must not be empty'),
    body('phone_number').optional().notEmpty().withMessage('Phone number must not be empty')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone_number } = req.body;
    try {
        const userRef = db.collection('users').doc(req.userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json([{ message: 'User not found.' }]);
        }

        const updatedData = {
            name: name || userDoc.data().name,
            phone_number: phone_number || userDoc.data().phone_number,
            photo: req.file ? req.file.path : userDoc.data().photo
        };
        await userRef.update(updatedData);
        res.json([{ message: 'User profile updated successfully.', data: { id: req.userId, ...updatedData } }]);
    } catch (error) {
        console.error(error);
        res.status(500).json([{ message: 'An unexpected error occurred. Please try again later.' }]);
    }
});

module.exports = router;

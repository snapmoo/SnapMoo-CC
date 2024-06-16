const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const db = require('../config/firestore');
const admin = require('firebase-admin');

// GET user profile
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Construct photo URL if exists
        const photoURL = userDoc.data().photo ? `https://storage.googleapis.com/${admin.storage().bucket().name}/${userDoc.data().photo}` : null;

        res.json({
            message: 'User profile retrieved successfully.',
            data: {
                id: userDoc.id,
                ...userDoc.data(),
                photo: photoURL
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
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
            return res.status(404).json({ message: 'User not found.' });
        }

        let updatedData = {
            name: name || userDoc.data().name,
            phone_number: phone_number || userDoc.data().phone_number,
            photo: userDoc.data().photo // default to current photo if not updated
        };

        // Handle file upload if a new photo is provided
        if (req.file) {
            const bucket = admin.storage().bucket();
            const fileName = `users/${req.file.originalname}`;
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
                updatedData.photo = fileName; // store only the file name for storage in Firestore

                // Update user profile with new photo URL
                await userRef.update(updatedData);

                // Construct photo URL
                updatedData.photo = fileName; // store only the file name for storage in Firestore
                const photoURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

                res.json({
                    message: 'User profile updated successfully.',
                    data: {
                        id: req.userId,
                        ...updatedData,
                        photo: photoURL
                    }
                });
            });

            stream.end(req.file.buffer);
        } else {
            // Update user profile without changing the photo
            await userRef.update(updatedData);

            // Construct photo URL if exists
            const photoURL = userDoc.data().photo ? `https://storage.googleapis.com/${admin.storage().bucket().name}/${userDoc.data().photo}` : null;

            res.json({
                message: 'User profile updated successfully.',
                data: {
                    id: req.userId,
                    ...updatedData,
                    photo: photoURL
                }
            });
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

module.exports = router;

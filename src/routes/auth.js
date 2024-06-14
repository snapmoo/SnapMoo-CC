// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../config/firestore');
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

// Register user
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone_number').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone_number } = req.body;
    try {
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (!userSnapshot.empty) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 8);
        const newUser = { name, email, password: hashedPassword, phone_number, createdAt: new Date() };
        const userRef = await db.collection('users').add(newUser);

        res.json({ message: 'User registered successfully.', data: { id: userRef.id, ...newUser } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// Login user
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (userSnapshot.empty) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const userDoc = userSnapshot.docs[0];
        const user = userDoc.data();

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: userDoc.id }, secret, { expiresIn: '1h' });

        // Construct photo URL if exists
        const photoURL = user.photo ? `${req.protocol}://${req.get('host')}/uploads/${user.photo}` : null;

        res.json({ 
            message: 'Login successful.', 
            data: { 
                user_id: userDoc.id, 
                name: user.name, 
                email: user.email,
                token, 
                photo: photoURL
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

module.exports = { router };

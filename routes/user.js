const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

let users = []; // should be the same array from auth.js

router.get('/user', authMiddleware, (req, res) => {
    const user = users.find(user => user.id === req.userId);
    if (user) {
        res.json({ message: 'User profile retrieved successfully.', data: user });
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
});

router.put('/user', authMiddleware, upload.single('photo'), (req, res) => {
    const { name, phone_number } = req.body;
    const user = users.find(user => user.id === req.userId);
    if (user) {
        user.name = name || user.name;
        user.phone_number = phone_number || user.phone_number;
        user.photo = req.file ? req.file.path : user.photo;
        res.json({ message: 'User profile updated successfully.' });
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
});

module.exports = router;

// src/routes/articleRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/firestore');

// GET all articles
router.get('/articles', async (req, res) => {
    try {
        const articlesSnapshot = await db.collection('articles').get();
        const articles = articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ message: 'Articles retrieved successfully.', data: articles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

module.exports = router;

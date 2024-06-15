// src/routes/articleRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/firestore');
const authMiddleware = require('../middleware/auth');

// GET all articles
router.get('/articles', authMiddleware, async (req, res) => {
    try {
        const query = req.query.q;
        let articlesRef = db.collection('articles');

        if (query) {
            articlesRef = articlesRef.where('title', '>=', query).where('title', '<=', query + '\uf8ff');
        }

        const articlesSnapshot = await articlesRef.get();

        if (articlesSnapshot.empty) {
            res.status(404).json({ message: 'No articles found.' });
            return;
        }

        const articles = [];
        articlesSnapshot.forEach(doc => {
            const article = doc.data();
            articles.push({ id: doc.id, ...article });
        });

        res.status(200).json({ message: 'Articles retrieved successfully.', data: articles });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

module.exports = router;

// src/routes/articleRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/firestore');


// GET all articles
router.get('/articles', async (req, res) => {
    try {
        const articlesSnapshot = await db.collection('articles').get();
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
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// Search articles
router.get('/articles/search', async (req, res) => {
    try {
        const query = req.query.q;
        let articlesRef = db.collection('articles');

        if (query) {
            articlesRef = articlesRef.where('title', 'like', `%${query}%`).orderBy("desc");
        }

        const articlesSnapshot = await articlesRef.get();

        if (articlesSnapshot.empty) {
            res.status(404).json({ message: 'No articles found.' });
            return;
        }

        const articles = [];
        articlesSnapshot.forEach(doc => {
            const article = doc.data();
            if (article.date) {
                article.date = convertTimestampToReadableDate(article.date);
            }
            articles.push({ id: doc.id, ...article });
        });

        res.status(200).json({ message: 'Articles retrieved successfully.', data: articles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});


module.exports = router;

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

// GET saved articles
router.get('/articles/saved', async (req, res) => {
    try {
        const savedArticlesSnapshot = await db.collection('articles').where('is_saved', '==', true).get();
        const savedArticles = savedArticlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ message: 'Saved articles retrieved successfully.', data: savedArticles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

// PUT update saved status for an article
router.put('/articles/:id/save', async (req, res) => {
    try {
        const articleRef = db.collection('articles').doc(req.params.id);
        const articleDoc = await articleRef.get();
        if (!articleDoc.exists) {
            return res.status(404).json({ message: 'Article not found.' });
        }

        await articleRef.update({ is_saved: true });
        res.status(200).json({ message: 'Article saved successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

module.exports = router;

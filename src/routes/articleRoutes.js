// articleRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../config/firestore');

function convertTimestampToReadableDate(timestamp) {
    const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
    return moment(date).format('MMM DD, YYYY');
}

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

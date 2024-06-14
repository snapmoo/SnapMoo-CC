// src/routes/articleRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/firestore');
const moment = require('moment');

function convertTimestampToReadableDate(timestamp) {
    const seconds = timestamp._seconds;
    const nanoseconds = timestamp._nanoseconds;

    // Buat objek Date berdasarkan seconds dan nanoseconds
    const date = new Date(seconds * 1000 + nanoseconds / 1000000);

    // Format tanggal menggunakan Moment.js
    return moment(date).format('MMMM DD, YYYY [at] h:mm:ss.SSS A [UTC]Z');
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

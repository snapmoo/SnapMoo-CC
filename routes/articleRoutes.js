const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
// GET /articles/pmk
router.get('/articles/pmk', (req, res) => {
  try {
    const article = {
      title: "Understanding and Preventing PMK Disease in Cattle",
      content: "PMK disease, also known as Pleuropneumonia, Mastitis, and Ketosis, is a common health issue in cattle... [full content of the article]",
      author: "Salsa Kece Badai",
      published_at: "2003-11-18",
      link: "https://ejournal.upbatam.ac.id/index.php/jif/article/view/6373"
    };

    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
  }
});

module.exports = router;

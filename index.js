// index.js
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
const port = 8080;

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://snapmoo.firebaseio.com'
    // storageBucket: 'your-project-id.appspot.com' // Uncomment if using Firebase Storage
});

const authRoutes = require('./src/routes/auth').router;
const userRoutes = require('./src/routes/user');
const reportRoutes = require('./src/routes/report');
const articleRoutes = require('./src/routes/articleRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added for URL-encoded body parsing

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', reportRoutes);
app.use('/api', articleRoutes); // Add this line for article routes

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    if (err) {
        res.status(err.status || 500).json({ message: err.message || 'An unexpected error occurred. Please try again later.' });
    } else {
        next();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// index.js
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const path = require('path');

const app = express();
const port = 8080;

const authRoutes = require('./src/routes/auth').router;
const userRoutes = require('./src/routes/user');
const reportRoutes = require('./src/routes/report');
const articleRoutes = require('./src/routes/articleRoutes');
const historyRoutes = require('./src/routes/historyRoutes');

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', reportRoutes);
app.use('/api', articleRoutes);
app.use('/api', historyRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Success' });
});

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

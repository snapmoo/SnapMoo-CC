const express = require('express');
const admin = require('firebase-admin'); // Add this line for Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Add this line for Firebase Admin SDK

const app = express();
const port = 3000;

// Inisialisasi Firebase Admin SDK dengan konfigurasi dari serviceAccountKey.json
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
     databaseURL: 'https://tesfirestore-425317.firebaseio.com' // Jika Anda menggunakan Realtime Database
    // storageBucket: 'your-project-id.appspot.com' // Jika Anda menggunakan Firebase Storage
});

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const predictRoutes = require('./routes/predict');
const reportRoutes = require('./routes/report');
const articleRoutes = require('./routes/articleRoutes');

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', predictRoutes);
app.use('/api', reportRoutes);
app.use('/api', articleRoutes);

app.use((err, req, res, next) => {
    if (err) {
        res.status(err.status || 500).json({ message: err.message || 'An unexpected error occurred. Please try again later.' });
    } else {
        next();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

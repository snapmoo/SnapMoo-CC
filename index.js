const express = require('express');
const app = express();
const port = 3000;

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

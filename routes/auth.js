const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const admin = require('firebase-admin');
let users = [];
const secret = 'your_jwt_secret';

router.post('/register', (req, res) => {
    const { name, email, password, phone_number } = req.body;
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'Email already exists.' });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { id: users.length + 1, name, email, password: hashedPassword, phone_number };
    users.push(newUser);
    res.json({ message: 'User registered successfully.' });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
    res.json({ message: 'Login successful.', data: { user_id: user.id, name: user.name, token } });
});

module.exports = router;

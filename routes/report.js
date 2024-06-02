const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

let reports = [];

router.get('/report', authMiddleware, (req, res) => {
    res.json({ message: 'Reports retrieved successfully.', data: reports });
});

router.get('/report/:id', authMiddleware, (req, res) => {
    const report = reports.find(r => r.report_id === parseInt(req.params.id));
    if (report) {
        res.json({ message: 'Report details retrieved successfully.', data: report });
    } else {
        res.status(404).json({ message: 'Report not found.' });
    }
});

router.post('/report', authMiddleware, upload.single('photo'), (req, res) => {
    const { name, email, phone_number, address, city, province, many_have, affected_body_part, prediction, score } = req.body;
    const newReport = {
        report_id: reports.length + 1,
        name,
        email,
        phone_number,
        address,
        city,
        province,
        many_have,
        affected_body_part,
        prediction,
        score,
        photo: req.file ? req.file.path : null,
    };
    reports.push(newReport);
    res.json({ message: 'Report added successfully.' });
});

module.exports = router;

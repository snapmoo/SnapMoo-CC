const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase Admin SDK (pastikan sudah terhubung dengan proyek Firebase Anda)
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: 'gs://apksnapmoo.appspot.com' // Ganti dengan URL bucket storage Anda
});

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Pastikan hanya menerima jenis file tertentu jika diperlukan
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images and videos are allowed.'));
        }
    }
});

module.exports = upload;

const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

router.use(isAdmin);

router.get('/dashboard', admin.dashboard);
router.get('/surat/:id', admin.detailSurat);
router.post('/surat/:id/status', admin.updateStatus);
router.get('/warga', admin.semuaWarga);

module.exports = router;

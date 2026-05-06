const express = require('express');
const router = express.Router();
const warga = require('../controllers/wargaController');
const { isWarga } = require('../middleware/auth');

router.use(isWarga);

router.get('/dashboard', warga.dashboard);
router.get('/ajukan', warga.showFormSurat);
router.post('/ajukan', warga.ajukanSurat);
router.get('/surat/:id', warga.detailSurat);

module.exports = router;

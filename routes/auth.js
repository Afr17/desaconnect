const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { isGuest } = require('../middleware/auth');

router.get('/login', isGuest, auth.showLogin);
router.post('/login', isGuest, auth.login);
router.get('/register', isGuest, auth.showRegister);
router.post('/register', isGuest, auth.register);
router.get('/logout', auth.logout);

router.get('/admin-login', isGuest, auth.showAdminLogin);
router.post('/admin-login', isGuest, auth.adminLogin);
router.get('/admin-logout', auth.adminLogout);

module.exports = router;

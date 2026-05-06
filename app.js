require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================
// VIEW ENGINE
// ========================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ========================
// MIDDLEWARE
// ========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'desaconnect_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 jam
}));

app.use(flash());

// ========================
// GLOBAL LOCALS
// ========================
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.warga = req.session.warga || null;
  res.locals.admin = req.session.admin || null;
  res.locals.desaNama = process.env.DESA_NAMA || 'Desa Sukamaju';
  res.locals.desaKabupaten = process.env.DESA_KABUPATEN || 'Kabupaten Tasikmalaya';
  next();
});

// ========================
// ROUTES
// ========================
app.use('/auth', require('./routes/auth'));
app.use('/warga', require('./routes/warga'));
app.use('/admin', require('./routes/admin'));

// Halaman utama - PERBAIKAN: Mengarah ke warga/home
app.get('/', (req, res) => {
  if (req.session.warga) return res.redirect('/warga/dashboard');
  if (req.session.admin) return res.redirect('/admin/dashboard');
  res.render('warga/home', { title: 'Selamat Datang' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Halaman Tidak Ditemukan' });
});

// Error handler - PERBAIKAN agar variabel 'title' selalu terkirim
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', { 
        title: 'Terjadi Kesalahan', // Menambahkan title agar header.ejs tidak error[cite: 1]
        message: err.message, 
        error: process.env.NODE_ENV === 'development' ? err : {} 
    });
});

// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
  console.log(`\n🏡 DesaConnect berjalan di http://localhost:${PORT}`);
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}\n`);
});
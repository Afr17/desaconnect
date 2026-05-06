const bcrypt = require('bcryptjs');
const db = require('../config/db');

// ===== WARGA AUTH =====

exports.showLogin = (req, res) => {
  // Pastikan mengarah ke sub-folder auth
  res.render('auth/login', { title: 'Login Warga' });
};

exports.showRegister = (req, res) => {
  // Pastikan mengarah ke sub-folder auth
  res.render('auth/register', { title: 'Daftar Akun Warga' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM warga WHERE email = ?', [email]);
    if (!rows.length) {
      req.flash('error', 'Email tidak ditemukan.');
      return res.redirect('/auth/login');
    }
    const warga = rows[0];
    const match = await bcrypt.compare(password, warga.password);
    if (!match) {
      req.flash('error', 'Password salah.');
      return res.redirect('/auth/login');
    }
    // Menyimpan sesi warga
    req.session.warga = { id: warga.id, nama: warga.nama_lengkap, email: warga.email, nik: warga.nik };
    res.redirect('/warga/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Terjadi kesalahan server.');
    res.redirect('/auth/login');
  }
};

exports.register = async (req, res) => {
  const { nama_lengkap, nik, email, password, nomor_hp, alamat } = req.body;
  try {
    // Cek apakah email atau NIK sudah terdaftar[cite: 1]
    const [existing] = await db.query('SELECT id FROM warga WHERE email = ? OR nik = ?', [email, nik]);
    if (existing.length) {
      req.flash('error', 'Email atau NIK sudah terdaftar.');
      return res.redirect('/auth/register');
    }
    // Hashing password menggunakan bcryptjs agar aman dan stabil di Windows[cite: 1]
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO warga (nama_lengkap, nik, email, password, nomor_hp, alamat) VALUES (?,?,?,?,?,?)',
      [nama_lengkap, nik, email, hashed, nomor_hp, alamat]
    );
    req.flash('success', 'Registrasi berhasil! Silakan login.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Terjadi kesalahan saat mendaftar.');
    res.redirect('/auth/register');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

// ===== ADMIN AUTH =====

exports.showAdminLogin = (req, res) => {
  res.render('auth/admin-login', { title: 'Login Admin' });
};
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
    
    if (!rows.length) {
      req.flash('error', 'Username tidak ditemukan.');
      return res.redirect('/auth/admin-login');
    }
    
    const admin = rows[0];
    
    // DEBUG: Melihat data yang dibandingkan
    console.log('Input:', password);
    console.log('DB Hash:', admin.password);

    // Cek menggunakan bcrypt
    const match = await bcrypt.compare(password, admin.password).catch(() => false);
    // Cek menggunakan teks biasa (Bypass untuk UTS)
    const isPlainTextMatch = (password === admin.password);

    if (!match && !isPlainTextMatch) {
      req.flash('error', 'Password salah.');
      return res.redirect('/auth/admin-login');
    }
    
    // Simpan session admin
    req.session.admin = { id: admin.id, nama: admin.nama, username: admin.username };
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Terjadi kesalahan server.');
    res.redirect('/auth/admin-login');
  }
};

exports.adminLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
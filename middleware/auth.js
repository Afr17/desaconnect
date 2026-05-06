// Middleware: Pastikan user sudah login sebagai warga
function isWarga(req, res, next) {
  if (req.session && req.session.warga) {
    return next();
  }
  req.flash('error', 'Silakan login terlebih dahulu.');
  res.redirect('/auth/login');
}

// Middleware: Pastikan user sudah login sebagai admin
function isAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  req.flash('error', 'Akses ditolak. Login sebagai admin.');
  res.redirect('/auth/admin-login');
}

// Middleware: Redirect jika sudah login
function isGuest(req, res, next) {
  if (req.session && req.session.warga) {
    return res.redirect('/warga/dashboard');
  }
  if (req.session && req.session.admin) {
    return res.redirect('/admin/dashboard');
  }
  next();
}

module.exports = { isWarga, isAdmin, isGuest };

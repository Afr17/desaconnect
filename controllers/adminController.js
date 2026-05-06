const db = require('../config/db');

exports.dashboard = async (req, res) => {
  try {
    const [suratList] = await db.query(
      `SELECT s.*, w.nama_lengkap, w.nik, w.nomor_hp
       FROM surat s
       JOIN warga w ON s.warga_id = w.id
       ORDER BY s.tanggal_pengajuan DESC`
    );
    const [stats] = await db.query(
      `SELECT
        COUNT(*) as total,
        SUM(status = 'Pending') as pending,
        SUM(status = 'Diproses') as diproses,
        SUM(status = 'Selesai') as selesai,
        SUM(status = 'Ditolak') as ditolak
       FROM surat`
    );
    const [wargaCount] = await db.query('SELECT COUNT(*) as total FROM warga');
    res.render('admin/dashboard', {
      title: 'Dashboard Admin',
      surat: suratList,
      stats: stats[0],
      wargaTotal: wargaCount[0].total,
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal memuat data.');
    res.redirect('/');
  }
};

exports.detailSurat = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT s.*, w.nama_lengkap, w.nik, w.nomor_hp, w.alamat, w.email
       FROM surat s JOIN warga w ON s.warga_id = w.id
       WHERE s.id = ?`,
      [id]
    );
    if (!rows.length) {
      req.flash('error', 'Surat tidak ditemukan.');
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/detail-surat', { title: 'Detail Surat', surat: rows[0] });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, catatan_admin } = req.body;
  const validStatus = ['Pending', 'Diproses', 'Selesai', 'Ditolak'];
  if (!validStatus.includes(status)) {
    req.flash('error', 'Status tidak valid.');
    return res.redirect(`/admin/surat/${id}`);
  }
  try {
    await db.query(
      'UPDATE surat SET status = ?, catatan_admin = ? WHERE id = ?',
      [status, catatan_admin || null, id]
    );
    req.flash('success', `Status surat berhasil diubah ke "${status}".`);
    res.redirect(`/admin/surat/${id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal mengubah status.');
    res.redirect(`/admin/surat/${id}`);
  }
};

exports.semuaWarga = async (req, res) => {
  try {
    const [wargaList] = await db.query(
      `SELECT w.*, COUNT(s.id) as total_surat
       FROM warga w LEFT JOIN surat s ON w.id = s.warga_id
       GROUP BY w.id ORDER BY w.created_at DESC`
    );
    res.render('admin/warga', { title: 'Data Warga', warga: wargaList });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
};

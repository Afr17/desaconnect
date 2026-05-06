const db = require('../config/db');
const { nanoid } = require('nanoid');

// Generate kode surat unik
function generateKodeSurat() {
  const prefix = 'DC';
  const year = new Date().getFullYear();
  const unique = nanoid(6).toUpperCase();
  return `${prefix}-${year}-${unique}`;
}

exports.dashboard = async (req, res) => {
  try {
    const wargaId = req.session.warga.id;
    const [suratList] = await db.query(
      'SELECT * FROM surat WHERE warga_id = ? ORDER BY tanggal_pengajuan DESC',
      [wargaId]
    );
    const [stats] = await db.query(
      `SELECT
        COUNT(*) as total,
        SUM(status = 'Pending') as pending,
        SUM(status = 'Diproses') as diproses,
        SUM(status = 'Selesai') as selesai
       FROM surat WHERE warga_id = ?`,
      [wargaId]
    );
    // Di dalam exports.dashboard
    res.render('warga/dashboard', {
      title: 'Dashboard Warga',
      surat: suratList,
      stats: stats[0],
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal memuat data.');
    res.redirect('/');
  }
};

exports.showFormSurat = (req, res) => {
  res.render('warga/form-surat', { title: 'Ajukan Surat' });
};

exports.ajukanSurat = async (req, res) => {
  const { jenis_surat, keperluan } = req.body;
  const wargaId = req.session.warga.id;
  try {
    const kode = generateKodeSurat();
    await db.query(
      'INSERT INTO surat (kode_surat, warga_id, jenis_surat, keperluan) VALUES (?,?,?,?)',
      [kode, wargaId, jenis_surat, keperluan]
    );
    req.flash('success', `Surat berhasil diajukan! Kode pelacakan Anda: ${kode}`);
    res.redirect('/warga/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal mengajukan surat.');
    res.redirect('/warga/ajukan');
  }
};

exports.detailSurat = async (req, res) => {
  const { id } = req.params;
  const wargaId = req.session.warga.id;
  try {
    const [rows] = await db.query(
      'SELECT * FROM surat WHERE id = ? AND warga_id = ?',
      [id, wargaId]
    );
    if (!rows.length) {
      req.flash('error', 'Surat tidak ditemukan.');
      return res.redirect('/warga/dashboard');
    }
    res.render('warga/detail-surat', { title: 'Detail Surat', surat: rows[0] });
  } catch (err) {
    console.error(err);
    res.redirect('/warga/dashboard');
  }
};

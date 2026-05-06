const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Mengambil dari ENV jika ada
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'desaconnect',
  waitForConnections: true,
  connectionLimit: 10
});

// Test koneksi saat startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Database terhubung:', process.env.DB_NAME);
    conn.release();
  } catch (err) {
    console.error('❌ Gagal terhubung ke database:', err.message);
  }
})();

module.exports = db;
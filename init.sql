-- DesaConnect Database Initialization
-- Run this script to set up the database schema

CREATE DATABASE IF NOT EXISTS desaconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE desaconnect;

-- Tabel Admin
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Warga
CREATE TABLE IF NOT EXISTS warga (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_lengkap VARCHAR(100) NOT NULL,
  nik VARCHAR(16) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nomor_hp VARCHAR(15),
  alamat TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Surat
CREATE TABLE IF NOT EXISTS surat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_surat VARCHAR(20) NOT NULL UNIQUE,
  warga_id INT NOT NULL,
  jenis_surat ENUM(
    'Surat Keterangan Domisili',
    'Surat Keterangan Tidak Mampu',
    'Surat Keterangan Usaha',
    'Surat Pengantar KTP',
    'Surat Keterangan Kelahiran',
    'Surat Keterangan Kematian',
    'Surat Izin Keramaian',
    'Surat Keterangan Lainnya'
  ) NOT NULL,
  keperluan TEXT NOT NULL,
  status ENUM('Pending', 'Diproses', 'Selesai', 'Ditolak') DEFAULT 'Pending',
  catatan_admin TEXT,
  tanggal_pengajuan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tanggal_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warga_id) REFERENCES warga(id) ON DELETE CASCADE
);

-- Seed: Admin default (password: admin123)
INSERT INTO admin (nama, username, password) VALUES
('Administrator Desa', 'admin', '$2b$10$rQZ9mX1Y3kL5pN7vT4uOaOQGJqKlMnPsRtUwVxYzAbCdEfGhIjKlM');

-- Seed: Warga contoh (password: warga123)
INSERT INTO warga (nama_lengkap, nik, email, password, nomor_hp, alamat) VALUES
('Budi Santoso', '3201010101010001', 'budi@email.com', '$2b$10$rQZ9mX1Y3kL5pN7vT4uOaOQGJqKlMnPsRtUwVxYzAbCdEfGhIjKlM', '08123456789', 'Jl. Merdeka No. 1, RT 01/RW 01');

<?php
$servername = "localhost";
$username = "root";
$password = "";  // Default Laragon tidak menggunakan password
$dbname = "toko_bangunan";

// Buat koneksi
$conn = new mysqli($servername, $username, $password, $dbname);

// Periksa koneksi
if ($conn->connect_error) {
    // Jika database belum ada, buat database terlebih dahulu
    $conn = new mysqli($servername, $username, $password);
    if ($conn->connect_error) {
        die("Koneksi gagal: " . $conn->connect_error);
    }
    
    // Buat database
    $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
    if ($conn->query($sql) === TRUE) {
        $conn->select_db($dbname);
        
        // Buat tabel produk
        $sql = "CREATE TABLE IF NOT EXISTS produk (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            nama VARCHAR(100) NOT NULL,
            harga INT(11) NOT NULL,
            stok INT(11) NOT NULL,
            gambar VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        
        if ($conn->query($sql) === FALSE) {
            die("Gagal membuat tabel: " . $conn->error);
        }
    } else {
        die("Gagal membuat database: " . $conn->error);
    }
}
?>

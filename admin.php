<?php
// Mulai session
session_start();

require_once 'config.php';

// Set pesan notifikasi
if (isset($_SESSION['pesan'])) {
    $pesan = $_SESSION['pesan'];
    $tipe_pesan = $_SESSION['tipe_pesan'] ?? 'sukses';
    unset($_SESSION['pesan']);
    unset($_SESSION['tipe_pesan']);
}

// Tambah produk baru
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['tambah_produk'])) {
    $nama = $_POST['nama'];
    $harga = $_POST['harga'];
    $stok = $_POST['stok'];
    // Default placeholder SVG
    $defaultImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg width="150" height="150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" preserveAspectRatio="none"%3E%3Crect width="150" height="150" fill="%23f0f0f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" fill="%23999" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" dy=".3em"%3EProduk%3C/text%3E%3C/svg%3E';
    $gambar = !empty($_POST['gambar']) ? $_POST['gambar'] : $defaultImage;
    
    $sql = "INSERT INTO produk (nama, harga, stok, gambar) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("siis", $nama, $harga, $stok, $gambar);
    
    if ($stmt->execute()) {
        $_SESSION['pesan'] = "Produk berhasil ditambahkan";
        $_SESSION['tipe_pesan'] = 'sukses';
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit();
    } else {
        $error = "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Ambil daftar produk
$sql = "SELECT * FROM produk ORDER BY id DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Toko Bangunan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1, h2 {
            color: #333;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
        }
        input[type="text"],
        input[type="number"],
        input[type="url"] {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #45a049;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .pesan {
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .sukses {
            background-color: #dff0d8;
            color: #3c763d;
        }
        .error {
            background-color: #f2dede;
            color: #a94442;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Admin Toko Bangunan</h1>
        
        <?php if (isset($pesan) || isset($_SESSION['pesan'])): ?>
            <?php 
                $pesan_display = $pesan ?? $_SESSION['pesan'] ?? '';
                $tipe = $tipe_pesan ?? $_SESSION['tipe_pesan'] ?? 'sukses';
            ?>
            <div class="pesan <?php echo $tipe; ?>"><?php echo htmlspecialchars($pesan_display); ?></div>
            <?php 
                // Hapus pesan dari session setelah ditampilkan
                unset($_SESSION['pesan']);
                unset($_SESSION['tipe_pesan']);
            ?>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
            <div class="pesan error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        
        <h2>Tambah Produk Baru</h2>
        <form method="POST" action="">
            <div class="form-group">
                <label for="nama">Nama Produk:</label>
                <input type="text" id="nama" name="nama" required>
            </div>
            
            <div class="form-group">
                <label for="harga">Harga (Rp):</label>
                <input type="number" id="harga" name="harga" min="0" required>
            </div>
            
            <div class="form-group">
                <label for="stok">Stok:</label>
                <input type="number" id="stok" name="stok" min="0" required>
            </div>
            
            <div class="form-group">
                <label for="gambar">URL Gambar (opsional):</label>
                <input type="url" id="gambar" name="gambar" placeholder="https://example.com/image.jpg">
            </div>
            
            <button type="submit" name="tambah_produk">Tambah Produk</button>
        </form>
        
        <h2>Daftar Produk</h2>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Gambar</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($result->num_rows > 0): ?>
                    <?php $no = 1; ?>
                    <?php while($row = $result->fetch_assoc()): ?>
                        <tr>
                            <td><?php echo $no++; ?></td>
                            <td><?php echo htmlspecialchars($row['nama']); ?></td>
                            <td>Rp <?php echo number_format($row['harga'], 0, ',', '.'); ?></td>
                            <td><?php echo $row['stok']; ?></td>
                            <td><img src="<?php echo htmlspecialchars($row['gambar']); ?>" alt="<?php echo htmlspecialchars($row['nama']); ?>" style="width: 50px; height: 50px; object-fit: cover;"></td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="5">Tidak ada produk</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</body>
</html>

<?php $conn->close(); ?>

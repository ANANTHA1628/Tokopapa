/* ============================================
   INISIALISASI VARIABEL GLOBAL
   ============================================ */
// Array untuk menyimpan daftar produk
let products = [];

// Array untuk menyimpan isi keranjang belanja
let cart = [];

// Array untuk menyimpan riwayat transaksi
let orderHistory = [];


/* ============================================
   FUNGSI LOAD DATA
   ============================================ 
   Memuat data dari localStorage dan inisialisasi data default
   ============================================ */
function loadData() {
    // Fungsi untuk membuat placeholder gambar SVG
    const createPlaceholderImage = (text) => {
        const displayText = text ? encodeURIComponent(text) : 'No+Image';
        return `data:image/svg+xml;charset=UTF-8,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" preserveAspectRatio="none"%3E%3Crect width="300" height="200" fill="%23f0f0f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" fill="%23999" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" dy=".3em"%3E${displayText}%3C/text%3E%3C/svg%3E`;
    };

    // Fungsi untuk memuat data dari localStorage
    products = JSON.parse(localStorage.getItem('products')) || [];
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    
    // Perbarui produk yang ada untuk memastikan tidak ada yang menggunakan placeholder.com
    let needsUpdate = false;
    products = products.map(product => {
        if (!product.image || product.image.includes('via.placeholder.com') || product.image.includes('placeholder.com')) {
            needsUpdate = true;
            return {
                ...product,
                image: createPlaceholderImage(product.name)
            };
        }
        return product;
    });
    
    // Inisialisasi data default jika kosong
    if (products.length === 0) {
        // Data produk default
        products = [
            { 
                id: 1, 
                name: 'Semen Tiga Roda 40kg', 
                price: 65000, 
                stock: 100, 
                image: createPlaceholderImage('Semen Tiga Roda')
            },
            { 
                id: 2, 
                name: 'Cat Tembok Avian', 
                price: 250000, 
                stock: 50, 
                image: createPlaceholderImage('Cat Tembok Avian')
            },
            { 
                id: 3, 
                name: 'Paku Baja 2 inch', 
                price: 5000, 
                stock: 200, 
                image: createPlaceholderImage('Paku Baja 2 inch')
            }
        ];
        needsUpdate = true;
    }
    
    // Simpan kembali jika ada perubahan
    if (needsUpdate) {
        saveData();
    }
    
    // Muat informasi kontak
    loadContactInfo();
    
    // Update tampilan keranjang
    updateCartCount();
}

// Fungsi untuk memuat informasi kontak
function loadContactInfo() {
    console.log('Memuat informasi kontak...');
    
    // Data default
    const defaultContact = {
        phone: '+62 123 4567 8900',
        address: 'Jl. Contoh No. 123, Kota Contoh',
        email: 'info@tokobangunan.com',
        hours: 'Senin - Jumat: 08:00 - 17:00, Sabtu: 08:00 - 15:00',
        maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345!2d106.123456!3d-6.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDcjMjQuNCJTIDEwNsKwMDcjMjQuNCJF!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid'
    };

    // Coba ambil dari localStorage
    let contactInfo;
    try {
        const stored = localStorage.getItem('contactInfo');
        contactInfo = stored ? JSON.parse(stored) : {};
        console.log('Data kontak yang dimuat:', contactInfo);
    } catch (e) {
        console.error('Gagal memuat data kontak:', e);
        contactInfo = {};
    }

    // Gabungkan dengan data default
    contactInfo = { ...defaultContact, ...contactInfo };
    console.log('Data kontak setelah digabung:', contactInfo);

    // Isi form kontak di admin
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        console.log('Mengisi form kontak admin...');
        const phoneInput = document.getElementById('contact-phone');
        const addressInput = document.getElementById('contact-address');
        const emailInput = document.getElementById('contact-email');
        const hoursInput = document.getElementById('contact-hours');
        const mapsInput = document.getElementById('contact-maps');
        
        if (phoneInput) phoneInput.value = contactInfo.phone || '';
        if (addressInput) addressInput.value = contactInfo.address || '';
        if (emailInput) emailInput.value = contactInfo.email || '';
        if (hoursInput) hoursInput.value = contactInfo.hours || '';
        if (mapsInput) mapsInput.value = contactInfo.maps || '';
        
        console.log('Form kontak berhasil diisi');
    }

    // Update tampilan kontak di halaman depan
    updateContactDisplay(contactInfo);
    
    return contactInfo;
}

// Fungsi untuk memperbarui tampilan kontak di halaman depan
function updateContactDisplay(contactInfo) {
    console.log('Memperbarui tampilan kontak:', contactInfo);
    
    // Update nomor telepon
    const phoneEl = document.getElementById('contact-phone');
    if (phoneEl) {
        phoneEl.textContent = contactInfo.phone || 'Belum diisi';
        phoneEl.parentElement.style.display = 'flex';
    }

    // Update email
    const emailEl = document.getElementById('contact-email');
    if (emailEl) {
        emailEl.textContent = contactInfo.email || 'Belum diisi';
        emailEl.parentElement.style.display = 'flex';
    }
    
    // Update alamat
    const addressEl = document.getElementById('contact-address');
    if (addressEl) {
        addressEl.textContent = contactInfo.address || 'Belum diisi';
        addressEl.parentElement.style.display = 'flex';
    }
    
    // Update jam operasional
    const hoursEl = document.getElementById('contact-hours');
    if (hoursEl) {
        hoursEl.textContent = contactInfo.hours || 'Belum diisi';
        hoursEl.parentElement.style.display = 'flex';
    }

    // Update peta jika ada
    const mapContainer = document.getElementById('map-container');
    const mapIframe = document.getElementById('contact-map');
    
    if (mapContainer && mapIframe) {
        if (contactInfo.maps && contactInfo.maps.trim()) {
            let mapsUrl = contactInfo.maps.trim();
            
            // Pastikan URL memiliki protokol
            if (!/^https?:\/\//i.test(mapsUrl)) {
                mapsUrl = 'https://' + mapsUrl;
            }
            
            console.log('Mencoba menampilkan peta dengan URL:', mapsUrl);
            
            try {
                // Validasi URL
                new URL(mapsUrl);
                
                // Set iframe src
                mapIframe.src = mapsUrl;
                mapContainer.style.display = 'block';
                console.log('Peta berhasil ditampilkan');
            } catch (e) {
                console.error('URL peta tidak valid:', e);
                mapContainer.style.display = 'none';
            }
        } else {
            console.log('URL peta kosong');
            mapContainer.style.display = 'none';
        }
    } else {
        console.log('Elemen peta tidak ditemukan');
    }
}

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    // Cek apakah elemen form kontak ada di halaman
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const contactInfo = {
            phone: document.getElementById('contact-phone')?.value || '',
            address: document.getElementById('contact-address')?.value || '',
            email: document.getElementById('contact-email')?.value || '',
            hours: document.getElementById('contact-hours')?.value || '',
            maps: document.getElementById('contact-maps')?.value || ''
        };
        localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
        console.log('Data kontak disimpan:', contactInfo);
    }
}

// Fungsi untuk menangani submit form kontak admin
function handleAdminContactSubmit(e) {
    e.preventDefault();
    console.log('Form kontak disubmit');
    
    // Dapatkan nilai dari form
    const phoneInput = document.getElementById('contact-phone');
    const addressInput = document.getElementById('contact-address');
    const emailInput = document.getElementById('contact-email');
    const hoursInput = document.getElementById('contact-hours');
    const mapsInput = document.getElementById('contact-maps');
    
    if (!phoneInput || !addressInput || !emailInput || !hoursInput) {
        console.error('Ada elemen form yang tidak ditemukan');
        showNotification('Terjadi kesalahan saat menyimpan data', 'error');
        return false;
    }
    
    const contactInfo = {
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim(),
        email: emailInput.value.trim(),
        hours: hoursInput.value.trim(),
        maps: mapsInput ? mapsInput.value.trim() : ''
    };
    
    console.log('Data yang akan disimpan:', contactInfo);
    
    try {
        // Simpan ke localStorage
        localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
        console.log('Data berhasil disimpan di localStorage');
        
        // Perbarui tampilan
        updateContactDisplay(contactInfo);
        
        // Tampilkan notifikasi
        showNotification('Informasi kontak berhasil disimpan', 'success');
    } catch (error) {
        console.error('Gagal menyimpan data:', error);
        showNotification('Gagal menyimpan data: ' + error.message, 'error');
    }
    
    return false;
}

/* ============================================
   FUNGSI-FUNGSI PRODUK
   ============================================ */

/**
 * Menampilkan daftar produk di halaman utama
 * @param {Array} productsToShow - Array produk yang akan ditampilkan (default: semua produk)
 */
function displayProducts(productsToShow = products) {
    const container = document.getElementById('produk-container');
    if (!container) return;
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<p class="no-products">Produk tidak ditemukan</p>';
        return;
    }
    
    let html = '';
    const createPlaceholderImage = (text) => {
        const displayText = text ? encodeURIComponent(text) : 'No+Image';
        return `data:image/svg+xml;charset=UTF-8,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" preserveAspectRatio="none"%3E%3Crect width="300" height="200" fill="%23f0f0f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" fill="%23999" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" dy=".3em"%3E${displayText}%3C/text%3E%3C/svg%3E`;
    };
    
    productsToShow.forEach(product => {
        const placeholderImage = createPlaceholderImage(product.name);
        
        html += `
            <div class="produk-item">
                <img src="${product.image || placeholderImage}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="harga">Rp ${product.price.toLocaleString('id-ID')}</p>
                <p class="stok">Stok: ${product.stock}</p>
                <button onclick="addToCart(${product.id})" class="btn">Tambah ke Keranjang</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Fungsi untuk menampilkan produk di halaman admin
function displayAdminProducts(productsToShow = products) {
    const container = document.getElementById('products-list');
    if (!container) return;
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center">Tidak ada produk</td></tr>';
        return;
    }
    
    let html = '';
    productsToShow.forEach((product, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>Rp ${product.price.toLocaleString('id-ID')}</td>
                <td>${product.stock}</td>
                <td>
                    <button onclick="editProduct(${product.id})" class="btn-edit">Edit</button>
                    <button onclick="deleteProduct(${product.id})" class="btn-delete">Hapus</button>
                </td>
            </tr>
        `;
    });
    
    container.innerHTML = html;
}

// Fungsi untuk menambah produk baru
function addNewProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('product-name').value.trim();
    const price = parseInt(document.getElementById('product-price').value) || 0;
    const stock = parseInt(document.getElementById('product-stock').value) || 0;
    const imageInput = document.getElementById('product-image').value.trim();
    const defaultImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" preserveAspectRatio="none"%3E%3Crect width="300" height="200" fill="%23f0f0f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" fill="%23999" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" dy=".3em"%3EProduk%3C/text%3E%3C/svg%3E';
    const image = imageInput || defaultImage;
    
    if (!name || price <= 0 || stock < 0) {
        alert('Mohon isi data dengan benar');
        return;
    }
    
    const newProduct = {
        id: Date.now(),
        name,
        price,
        stock,
        image
    };
    
    products.push(newProduct);
    saveData();
    
    // Reset form
    event.target.reset();
    
    // Perbarui tampilan
    displayAdminProducts();
    showNotification('Produk berhasil ditambahkan');
}

// Fungsi untuk mengedit produk
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const newName = prompt('Nama Produk:', product.name);
    if (newName === null) return;
    
    const newPrice = parseInt(prompt('Harga:', product.price)) || 0;
    if (newPrice <= 0) {
        alert('Harga tidak valid');
        return;
    }
    
    const newStock = parseInt(prompt('Stok:', product.stock)) || 0;
    if (newStock < 0) {
        alert('Stok tidak valid');
        return;
    }
    
    // Update produk
    product.name = newName;
    product.price = newPrice;
    product.stock = newStock;
    
    saveData();
    
    // Perbarui tampilan
    if (window.location.pathname.includes('admin.html')) {
        displayAdminProducts();
    } else {
        displayProducts();
    }
    
    showNotification('Produk berhasil diperbarui');
}

// Fungsi untuk menghapus produk
function deleteProduct(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        return;
    }
    
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        saveData();
        
        // Perbarui tampilan
        if (window.location.pathname.includes('admin.html')) {
            displayAdminProducts();
        } else {
            displayProducts();
        }
        
        showNotification('Produk berhasil dihapus');
    }
}

/* ============================================
   FUNGSI-FUNGSI KERANJANG BELANJA
   ============================================ */

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (product.stock <= 0) {
        showNotification('Stok produk habis', 'error');
        return;
    }
    
    // Cek apakah produk sudah ada di keranjang
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification('Stok tidak mencukupi', 'error');
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    // Kurangi stok
    product.stock--;
    
    saveData();
    updateCartCount();
    showNotification('Produk ditambahkan ke keranjang');
}

// Fungsi untuk menampilkan keranjang
function displayCart() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    if (!container || !totalElement) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Keranjang kosong</p>';
        totalElement.textContent = 'Rp 0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</p>
                    <p class="item-total">Rp ${itemTotal.toLocaleString('id-ID')}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateCartItem(${index}, 'decrease')">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItem(${index}, 'increase')">+</button>
                    <button onclick="removeFromCart(${index})" class="remove-item">×</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    totalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// Fungsi untuk memperbarui jumlah item di keranjang
function updateCartItem(index, action) {
    if (index < 0 || index >= cart.length) return;
    
    const item = cart[index];
    const product = products.find(p => p.id === item.id);
    
    if (!product) {
        removeFromCart(index);
        return;
    }
    
    if (action === 'increase') {
        if (item.quantity < product.stock + 1) { // +1 karena stok sudah dikurangi 1
            item.quantity++;
            product.stock--;
        } else {
            showNotification('Stok tidak mencukupi', 'error');
            return;
        }
    } else if (action === 'decrease') {
        if (item.quantity > 1) {
            item.quantity--;
            product.stock++;
        } else {
            removeFromCart(index);
            return;
        }
    }
    
    saveData();
    displayCart();
    updateCartCount();
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    
    // Kembalikan stok
    const item = cart[index];
    const product = products.find(p => p.id === item.id);
    if (product) {
        product.stock += item.quantity;
    }
    
    // Hapus dari keranjang
    cart.splice(index, 1);
    
    saveData();
    displayCart();
    updateCartCount();
    
    if (cart.length === 0) {
        showNotification('Keranjang dikosongkan');
    }
}

/* ============================================
   FUNGSI PENCARIAN PRODUK
   ============================================ */

// Fungsi untuk mencari produk
function searchProducts(keyword) {
    if (!keyword || keyword.trim() === '') {
        if (window.location.pathname.includes('admin.html')) {
            displayAdminProducts();
        } else {
            displayProducts();
        }
        return;
    }
    
    keyword = keyword.toLowerCase().trim();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(keyword) ||
        (product.description && product.description.toLowerCase().includes(keyword))
    );
    
    if (window.location.pathname.includes('admin.html')) {
        displayAdminProducts(filteredProducts);
    } else {
        displayProducts(filteredProducts);
    }
}

/* ============================================
   FUNGSI-FUNGSI UTILITAS
   ============================================ */

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Tambahkan ke body
    document.body.appendChild(notification);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Fungsi untuk memperbarui jumlah item di keranjang
function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (!countElement) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    countElement.textContent = totalItems;
    
    // Toggle class 'has-items' pada ikon keranjang
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        if (totalItems > 0) {
            cartIcon.classList.add('has-items');
        } else {
            cartIcon.classList.remove('has-items');
        }
    }
}

/* ============================================
   INISIALISASI SAAT DOKUMEN SIAP
   ============================================ */
// Fungsi untuk menangani submit form tentang kami
function handleAboutFormSubmit(e) {
    e.preventDefault();
    
    const aboutContent = document.getElementById('about-content').value;
    if (aboutContent) {
        localStorage.setItem('aboutContent', aboutContent);
        showNotification('Tentang Kami berhasil diperbarui', 'success');
    }
    
    return false;
}

// Fungsi untuk inisialisasi halaman
function initializePage() {
    console.log('Memulai inisialisasi halaman...');
    
    // Muat data
    loadData();
    
    // Cek apakah ini halaman admin atau halaman utama
    const isAdminPage = window.location.pathname.includes('admin.html');
    
    if (isAdminPage) {
        console.log('Ini adalah halaman admin');
        
        // Inisialisasi form kontak di admin
        const adminContactForm = document.getElementById('contact-form');
        if (adminContactForm) {
            console.log('Form kontak admin ditemukan, menambahkan event listener...');
            adminContactForm.addEventListener('submit', handleAdminContactSubmit);
            
            // Inisialisasi form tentang kami
            const aboutForm = document.getElementById('about-form');
            if (aboutForm) {
                console.log('Form tentang kami ditemukan, menambahkan event listener...');
                aboutForm.addEventListener('submit', handleAboutFormSubmit);
                
                // Muat konten tentang kami yang sudah ada
                const savedAbout = localStorage.getItem('aboutContent');
                if (savedAbout) {
                    console.log('Memuat konten tentang kami dari localStorage');
                    document.getElementById('about-content').value = savedAbout;
                } else {
                    console.log('Tidak ada konten tentang kami yang tersimpan');
                }
            } else {
                console.log('Form tentang kami tidak ditemukan');
            }
            
            // Muat data kontak untuk form admin
            console.log('Memuat data kontak untuk form admin...');
            loadContactInfo();
        }
        
        // Inisialisasi tab
        initTabs();
        
        // Tampilkan produk di admin
        displayAdminProducts();
    } else {
        console.log('Ini adalah halaman utama');
        
        // Muat data kontak untuk ditampilkan
        console.log('Memuat data kontak untuk ditampilkan...');
        loadContactInfo();
        
        // Muat konten tentang kami di halaman depan
        const aboutContent = document.getElementById('about-content');
        if (aboutContent) {
            const savedAbout = localStorage.getItem('aboutContent');
            if (savedAbout) {
                aboutContent.innerHTML = savedAbout;
            } else {
                aboutContent.innerHTML = '<p>Selamat datang di Toko Bangunan Roedie. Kami menyediakan berbagai macam bahan bangunan berkualitas.</p>';
            }
        }
        
        // Tampilkan produk di halaman utama
        displayProducts();
    }
    
    // Inisialisasi komponen umum
    initCommonComponents();
}

// Fungsi untuk inisialisasi komponen yang ada di kedua halaman
function initCommonComponents() {
    // Inisialisasi pencarian
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            searchProducts(searchInput.value);
        });
        
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchProducts(searchInput.value);
            }
        });
    }
}

// Fungsi untuk inisialisasi tab
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Sembunyikan semua tab pane
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Nonaktifkan semua tombol tab
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Tampilkan tab yang dipilih
            const tabPane = document.getElementById(tabId + '-tab');
            if (tabPane) {
                tabPane.classList.add('active');
                this.classList.add('active');
                
                // Muat konten tab yang sesuai
                if (tabId === 'riwayat') {
                    loadOrderHistory();
                } else if (tabId === 'produk') {
                    displayAdminProducts();
                }
            }
        });
    });
    
    // Aktifkan tab pertama secara default jika ada
    const firstTab = document.querySelector('.tab-btn');
    if (firstTab) firstTab.click();
}

// Inisialisasi saat dokumen siap
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dokumen siap, memulai inisialisasi...');
    initializePage();
    
    // Inisialisasi form tambah produk (untuk halaman admin)
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', addNewProduct);
    }
    
    // Inisialisasi pencarian
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            searchProducts(searchInput.value);
        });
        
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchProducts(searchInput.value);
            }
        });
    }
    
    // Inisialisasi tombol kosongkan keranjang
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
                // Kembalikan semua stok
                cart.forEach(item => {
                    const product = products.find(p => p.id === item.id);
                    if (product) {
                        product.stock += item.quantity;
                    }
                });
                
                // Kosongkan keranjang
                cart = [];
                saveData();
                
                // Perbarui tampilan
                displayCart();
                updateCartCount();
                showNotification('Keranjang berhasil dikosongkan');
            }
        });
    }
    
    // Inisialisasi tombol checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Keranjang kosong', 'error');
                return;
            }
            
            const customerName = prompt('Masukkan nama Anda:');
            if (!customerName) return;
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Buat pesanan baru
            const order = {
                id: Date.now(),
                date: new Date().toISOString(),
                customerName,
                items: [...cart],
                total,
                status: 'completed'
            };
            
            // Tambahkan ke riwayat
            orderHistory.unshift(order);
            
            // Kosongkan keranjang
            cart = [];
            
            // Simpan perubahan
            saveData();
            
            // Perbarui tampilan
            displayCart();
            updateCartCount();
            
            // Tampilkan struk
            let receipt = `=== STRUK PEMBAYARAN ===\n`;
            receipt += `Tanggal: ${new Date(order.date).toLocaleString()}\n`;
            receipt += `Nama: ${customerName}\n`;
            receipt += '----------------------------\n';
            
            order.items.forEach(item => {
                receipt += `${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
            });
            
            receipt += '----------------------------\n';
            receipt += `Total: Rp ${total.toLocaleString('id-ID')}\n`;
            receipt += '============================';
            
            alert(receipt);
            showNotification('Pembayaran berhasil', 'success');
        });
    }
    
    // Event listener untuk form kontak admin (sudah dipindahkan ke atas)

    // Inisialisasi modal keranjang
    const cartModal = document.getElementById('cart-modal');
    const cartIcon = document.querySelector('.cart-icon');
    const closeBtn = document.querySelector('.close');
    
    if (cartModal && cartIcon && closeBtn) {
        // Buka modal saat ikon keranjang diklik
        cartIcon.addEventListener('click', () => {
            cartModal.style.display = 'block';
            displayCart();
        });
        
        // Tutup modal saat tombol tutup diklik
        closeBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
        
        // Tutup modal saat klik di luar modal
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }
});

// Fungsi untuk memuat riwayat transaksi
function loadOrderHistory() {
    const container = document.getElementById('order-history');
    if (!container) return;
    
    if (orderHistory.length === 0) {
        container.innerHTML = '<tr><td colspan="5">Belum ada riwayat transaksi</td></tr>';
        return;
    }
    
    let html = '';
    orderHistory.forEach(order => {
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        
        html += `
            <tr>
                <td>#${String(order.id).slice(-6)}</td>
                <td>${new Date(order.date).toLocaleString()}</td>
                <td>${order.customerName || 'Tidak ada nama'}</td>
                <td>${totalItems} item</td>
                <td>Rp ${order.total.toLocaleString('id-ID')}</td>
                <td>
                    <button onclick="viewOrderDetails(${order.id})" class="btn-view">Lihat</button>
                </td>
            </tr>
        `;
    });
    
    container.innerHTML = html;
}


// Fungsi untuk melihat detail pesanan
function viewOrderDetails(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) return;
    
    let details = `=== DETAIL PESANAN ===\n`;
    details += `ID: #${String(order.id).slice(-6)}\n`;
    details += `Tanggal: ${new Date(order.date).toLocaleString()}\n`;
    details += `Nama: ${order.customerName || 'Tidak ada nama'}\n`;
    details += '----------------------------\n';
    
    order.items.forEach(item => {
        details += `${item.name} x${item.quantity} @Rp ${item.price.toLocaleString('id-ID')}\n`;
    });
    
    details += '----------------------------\n';
    details += `Total: Rp ${order.total.toLocaleString('id-ID')}\n`;
    details += '============================';
    
    alert(details);
}

// Inisialisasi form tambah produk (untuk halaman admin)
const addProductForm = document.getElementById('add-product-form');
if (addProductForm) {
    addProductForm.addEventListener('submit', addNewProduct);
}

// Inisialisasi pencarian
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        searchProducts(searchInput.value);
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchProducts(searchInput.value);
        }
    });
}

// Inisialisasi tombol kosongkan keranjang
const clearCartBtn = document.getElementById('clear-cart');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
            // Kembalikan semua stok
            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    product.stock += item.quantity;
                }
            });
            
            // Kosongkan keranjang
            cart = [];
            saveData();
            
            // Perbarui tampilan
            displayCart();
            updateCartCount();
            showNotification('Keranjang berhasil dikosongkan');
        }
    });
}

// Inisialisasi tombol checkout
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Keranjang kosong', 'error');
            return;
        }
        
        const customerName = prompt('Masukkan nama Anda:');
        if (!customerName) return;
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Buat pesanan baru
        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            customerName,
            items: [...cart],
            total,
            status: 'completed'
        };
        
        // Tambahkan ke riwayat
        orderHistory.unshift(order);
        
        // Kosongkan keranjang
        cart = [];
        
        // Simpan perubahan
        saveData();
        
        // Perbarui tampilan
        displayCart();
        updateCartCount();
        
        // Tampilkan struk
        let receipt = `=== STRUK PEMBAYARAN ===\n`;
        receipt += `Tanggal: ${new Date(order.date).toLocaleString()}\n`;
        receipt += `Nama: ${customerName}\n`;
        receipt += '----------------------------\n';
        
        order.items.forEach(item => {
            receipt += `${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
        });
        
        receipt += '----------------------------\n';
        receipt += `Total: Rp ${total.toLocaleString('id-ID')}\n`;
        receipt += '============================';
        
        alert(receipt);
        showNotification('Pembayaran berhasil', 'success');
    });
}

// Inisialisasi modal keranjang
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.querySelector('.cart-icon');
const closeBtn = document.querySelector('.close');

if (cartModal && cartIcon && closeBtn) {
    // Buka modal saat ikon keranjang diklik
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
        displayCart();
    });
    
    // Tutup modal saat tombol tutup diklik
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Tutup modal saat klik di luar modal
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

/* ============================================
   EKSPOR FUNGSI KE GLOBAL SCOPE
   ============================================
   Membuat fungsi-fungsi ini dapat diakses dari HTML
   ============================================ */
window.addToCart = addToCart;
window.updateCartItem = updateCartItem;
window.removeFromCart = removeFromCart;
window.searchProducts = searchProducts;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewOrderDetails = viewOrderDetails;

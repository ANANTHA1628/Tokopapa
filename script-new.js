// Menggunakan variabel global yang sudah dideklarasikan di script.js
// products, cart, dan orderHistory sudah tersedia di scope global

// Fungsi untuk membuat placeholder gambar SVG
const createPlaceholderImage = (text) => {
    const displayText = text ? encodeURIComponent(text) : 'No+Image';
    return `data:image/svg+xml;charset=UTF-8,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" preserveAspectRatio="none"%3E%3Crect width="300" height="200" fill="%23f0f0f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" fill="%23999" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" dy=".3em"%3E${displayText}%3C/text%3E%3C/svg%3E`;
};

// Fungsi untuk memuat data dari localStorage
function loadData() {
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
                name: 'Bata Merah', 
                price: 700, 
                stock: 5000, 
                image: createPlaceholderImage('Bata Merah')
            },
            { 
                id: 3, 
                name: 'Cat Tembok Vinilex', 
                price: 125000, 
                stock: 30, 
                image: createPlaceholderImage('Cat Tembok Vinilex')
            }
        ];
        needsUpdate = true;
    }
    
    // Simpan kembali jika ada perubahan
    if (needsUpdate) {
        saveData();
    }
    
    // Perbarui tampilan
    if (window.location.pathname.includes('admin.html')) {
        displayAdminProducts();
    } else {
        displayProducts();
    }
    
    updateCartCount();
}

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
}

// ========== FUNGSI PRODUK ==========

// Fungsi untuk menampilkan produk di halaman utama
function displayProducts(productsToShow = products) {
    const container = document.getElementById('produk-container');
    if (!container) return;
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<p class="no-products">Produk tidak ditemukan</p>';
        return;
    }
    
    let html = '';
    productsToShow.forEach(product => {
        html += `
            <div class="produk-item">
                <img src="${product.image || createPlaceholderImage(product.name || 'Produk')}" alt="${product.name}">
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
    const defaultImage = createPlaceholderImage('Produk');
    const image = document.getElementById('product-image').value.trim() || defaultImage;
    
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

// ========== FUNGSI KERANJANG ==========

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

// ========== FUNGSI PENCARIAN ==========

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

// ========== FUNGSI UTILITAS ==========

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

// Inisialisasi saat dokumen siap
document.addEventListener('DOMContentLoaded', function() {
    // Muat data
    loadData();
    
    // Inisialisasi tab (untuk halaman admin)
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

// Ekspor fungsi ke global scope
window.addToCart = addToCart;
window.updateCartItem = updateCartItem;
window.removeFromCart = removeFromCart;
window.searchProducts = searchProducts;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewOrderDetails = viewOrderDetails;

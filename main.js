/**
        * Variabel global untuk status login pengguna.
        * @type {boolean}
        */
let isLoggedIn = false;

/**
 * Fungsi untuk merender link navigasi berdasarkan status login.
 */
function renderNavLinks() {
    // Mengambil elemen navigasi
    const navLinks = document.getElementById('nav-links');
    // Mengatur konten berdasarkan status login
    navLinks.innerHTML = isLoggedIn ? `
         <a href="#" onclick="navigateTo('dashboard')">Dashboard</a>
         <a href="#" onclick="navigateTo('add-expense')">Tambah Pengeluaran</a>
         <a href="#" onclick="navigateTo('expenses')">Pengeluaran</a>
         <a href="#" onclick="logout()">Logout</a>
     ` : `
         <a href="#" onclick="navigateTo('register')">Register</a>
         <a href="#" onclick="navigateTo('login')">Login</a>
     `;
}

/**
 * Fungsi untuk menavigasi halaman berdasarkan pilihan pengguna.
 * @param {string} page - Halaman yang akan ditampilkan.
 */
function navigateTo(page) {
    // Mengambil elemen 
    const mainContent = document.getElementById('main-content');
    // Memilih halaman berdasarkan pilihan
    switch (page) {
        case 'dashboard':
            // Render halaman dashboard
            mainContent.innerHTML = `
                 <h1>Dashboard</h1>
                 <div class="dashboard-container">
                     <div class="dashboard-card">
                         <h2>Total Pengeluaran</h2>
                         <p id="total-expenses">0 IDR</p>
                         <button class="add" onclick="navigateTo('add-expense')">Tambah Pengeluaran</button>
                     </div>
                     <div class="dashboard-card">
                         <h2>Pengeluaran Tertinggi</h2>
                         <p id="highest-expense">0 IDR</p>
                     </div>
                    
                 </div>
             `;

            // Memperbarui informasi dashboard
            updateTotalExpenses();
            updateHighestExpense();
            break;
        case 'expenses':
            // Render halaman daftar pengeluaran
            renderExpensesPage();
            break;
        case 'login':
            // Render halaman login
            mainContent.innerHTML = `
                 <div class="loginn">
                     <h1>Login</h1>
                     <form onsubmit="handleLogin(event)">
                         <div class="form-group">
                             <label for="login-email">Email:</label>
                             <input type="email" id="login-email" required>
                         </div>
                         <div class="form-group">
                             <label for="login-password">Password:</label>
                             <input type="password" id="login-password" required>
                         </div>
                         <button class="login" type="submit">Login</button>
                         <div id="error-message"></div>
                          <p>Belum punya akun? <a href="#" onclick="navigateTo('register')">Registrasi disini</a></p>
                     </form>
                 </div>
             `;
            break;
        case 'register':
            // Render halaman registrasi
            mainContent.innerHTML = `
                 <h1>Register</h1>
                 <form onsubmit="handleRegister(event)">
                     <div class="form-group">
                         <label for="register-name">Nama:</label>
                         <input type="text" id="register-name" required>
                     </div>
                     <div class="form-group">
                         <label for="register-email">Email:</label>
                         <input type="email" id="register-email" required>
                     </div>
                     <div class="form-group">
                         <label for="register-password">Password:</label>
                         <input type="password" id="register-password" required>
                     </div>
                     <button class="regis" type="submit">Register</button>
                      <p>Sudah punya akun? <a href="#" onclick="navigateTo('login')">Login disini</a></p>
                 </form>
             `;
            break;
        case 'add-expense':
            // Render halaman tambah pengeluaran
            mainContent.innerHTML = `
                 <h1>Tambah Pengeluaran</h1>
                 <form onsubmit="handleAddExpense(event)">
                     <div class="form-group">
                         <label for="expense-title">Judul:</label>
                         <input type="text" id="expense-title" required>
                     </div>
                     <div class="form-group">
                         <label for="expense-amount">Harga:</label>
                         <input type="number" id="expense-amount" required>
                     </div>
                     <button class="add" type="submit">Tambah Pengeluaran</button>
                 </form>
             `;
            break;
        default:
            // Render halaman default jika tidak ditemukan
            mainContent.innerHTML = '<p>Page not found</p>';
    }
}

/**
 * Fungsi untuk menangani proses login pengguna.
 * @param {Event} event - Objek event dari form submission.
 */
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMessage = document.getElementById('error-message');

    // Mendapatkan informasi pengguna terdaftar dari localStorage
    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

    // Memeriksa keberadaan pengguna terdaftar 
    if (registeredUser && email === registeredUser.email && password === registeredUser.password) {
        isLoggedIn = true;
        renderNavLinks();
        navigateTo('dashboard');
    } else {
        errorMessage.textContent = 'Email atau password salah';
    }
}

/**
 * Fungsi untuk menangani proses registrasi pengguna.
 * @param {Event} event - Objek event dari form submission.
 */
function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // registrasi dengan menyimpan data di localStorage
    localStorage.setItem('registeredUser', JSON.stringify({ name, email, password }));
    //alert('Registrasi berhasil! Silakan login.');
    //navigateTo('login');
    Swal.fire({
        title: 'Registrasi Berhasil!',
        text: 'Silakan login.',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        navigateTo('login');
    });
}

/**
 * Fungsi untuk menangani proses logout pengguna.
 */
function logout() {
    isLoggedIn = false;
    renderNavLinks();
    navigateTo('login');
}

/**
 * Fungsi untuk menangani proses penambahan pengeluaran baru.
 * @param {Event} event - Objek event dari form submission.
 */
function handleAddExpense(event) {
    event.preventDefault();
    const title = document.getElementById('expense-title').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);

    if (!isNaN(amount)) {
        let expenses = getExpensesFromLocalStorage();
        expenses.push({ title, amount });
        localStorage.setItem('expenses', JSON.stringify(expenses));

        // Menggunakan SweetAlert2 untuk alert
        Swal.fire({
            title: 'Pengeluaran Ditambahkan!',
            text: 'Pengeluaran baru berhasil ditambahkan.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            navigateTo('dashboard');
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Jumlah pengeluaran harus berupa angka.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

/**
 * Fungsi untuk memperbarui total pengeluaran berdasarkan data dari localStorage.
 * */
function updateTotalExpenses() {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let total = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
    document.getElementById('total-expenses').textContent = `${total.toFixed(2)} IDR`;
}

/**
 * Fungsi untuk memperbarui pengeluaran tertinggi berdasarkan data dari localStorage.
 * */
function updateHighestExpense() {
    let expenses = getExpensesFromLocalStorage();
    let highest = expenses.length > 0 ? Math.max(...expenses.map(expense => parseFloat(expense.amount))) : 0;
    document.getElementById('highest-expense').textContent = `${highest.toFixed(2)} IDR`;
}

/**
 * Fungsi untuk mengambil daftar pengeluaran dari localStorage.
 * @returns {Array} - Daftar pengeluaran yang tersimpan.
 * */
function getExpensesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}

/**
 * Fungsi untuk merender halaman daftar pengeluaran berdasarkan pencarian dan pengurutan.
 * */
function renderExpensesPage() {
    const mainContent = document.getElementById('main-content');
    let expenses = getExpensesFromLocalStorage();
    mainContent.innerHTML = `
 <h1>Pengeluaran</h1>
 <div class="search-sort">
     <div class="search-container">
         <input type="text" id="search" placeholder="Cari pengeluaran..." oninput="filterExpenses()">
     </div>
     <div class="sort-container">
         <label for="sort">Urutkan: </label>
         <select id="sort" onchange="sortExpenses()">
             <option value="latest">Terbaru</option>
             <option value="amount">Jumlah</option>
             <option value="az">A-Z</option>
             <option value="za">Z-A</option>
         </select>
     </div>
 </div>
 <div class="expenses-list" id="expenses-list">
     ${expenses.length > 0 ? expenses.map((expense, index) => `
         <div class="expense-item" data-index="${index}">
             <h3>${expense.title}</h3>
             <p>${expense.amount.toFixed(2)} IDR</p>
             <div class="btn-item">
                 <button class="edit" onclick="editExpense(${index})">
                      <i class="fas fa-edit"></i>
                      </button>
                 <button class="delete" onclick="deleteExpense(${index})">
                      <i class="fas fa-trash-alt"></i>
                      </button>
             </div>
         </div>
     `).join('') : '<p>Tidak ada pengeluaran tersimpan.</p>'}
 </div>
`;
}

/**
 * Fungsi untuk melakukan filter daftar pengeluaran berdasarkan pencarian.
 * */
function filterExpenses() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const filteredExpenses = expenses.filter(expense => expense.title.toLowerCase().includes(searchValue));
    renderFilteredExpenses(filteredExpenses);
}

/**
 * Fungsi untuk melakukan pengurutan daftar pengeluaran berdasarkan pilihan pengguna.
 * */
function sortExpenses() {
    const sortValue = document.getElementById('sort').value;
    let expenses = getExpensesFromLocalStorage();

    if (sortValue === 'latest') {
        expenses.sort((a, b) => b.index - a.index);
    } else if (sortValue === 'amount') {
        expenses.sort((a, b) => b.amount - a.amount);
    } else if (sortValue === 'az') {
        expenses.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'za') {
        expenses.sort((a, b) => b.title.localeCompare(a.title));
    }

    renderFilteredExpenses(expenses);
}

/**
 * Fungsi untuk mengedit pengeluaran berdasarkan indeks yang diberikan.
 * @param {number} index - Indeks pengeluaran yang akan diedit.
 * */
function editExpense(index) {
    // Ambil semua pengeluaran dari localStorage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Ambil pengeluaran yang sesuai berdasarkan indeks yang diberikan
    let filteredExpenses = getFilteredExpenses();
    let expense = filteredExpenses[index];

    // Temukan indeks pengeluaran yang dipilih di daftar lengkap
    let originalIndex = expenses.findIndex(exp => exp.title === expense.title && exp.amount === expense.amount);

    // Menggunakan SweetAlert2 untuk prompt judul baru
    Swal.fire({
        title: 'Masukkan judul baru:',
        input: 'text',
        inputValue: expense.title,
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            const newTitle = result.value;
            if (newTitle !== null) { // Jika pengguna memasukkan nilai baru (bukan cancel)
                expense.title = newTitle;
            }

            // Menggunakan SweetAlert2 untuk prompt jumlah baru
            Swal.fire({
                title: 'Masukkan jumlah baru:',
                input: 'number',
                inputValue: expense.amount,
                showCancelButton: true,
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    const newAmount = result.value;
                    if (newAmount !== null) { // Jika pengguna memasukkan nilai baru (bukan cancel)
                        expense.amount = parseFloat(newAmount);
                        if (isNaN(expense.amount)) {
                            Swal.fire({
                                title: 'Error',
                                text: 'Jumlah pengeluaran harus berupa angka.',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            });
                            return;
                        }

                        // Update data pengeluaran yang tersimpan di localStorage berdasarkan indeks asli
                        expenses[originalIndex] = expense;
                        localStorage.setItem('expenses', JSON.stringify(expenses));

                        // Render ulang daftar pengeluaran dengan data yang diperbarui
                        renderFilteredExpenses();

                        // Update total pengeluaran dan pengeluaran tertinggi setelah mengedit
                        updateTotalExpenses();
                        updateHighestExpense();
                    }
                }
            });
        }
    });
}

/**
 * Memperbarui tampilan daftar pengeluaran berdasarkan hasil filter dan pengurutan.
 * Mengambil nilai pencarian dari input dengan ID 'search' dan nilai pengurutan dari dropdown dengan ID 'sort'.
 * Jika terdapat pengeluaran yang sesuai dengan kriteria pencarian, mereka akan dirender dalam elemen dengan ID 'expenses-list'.
 * Setiap pengeluaran akan ditampilkan dalam bentuk elemen HTML dengan tombol untuk mengedit dan menghapus.
 * Jika tidak ada pengeluaran yang sesuai, akan menampilkan pesan bahwa tidak ada pengeluaran tersimpan.
 * */
function renderFilteredExpenses() {
    const filteredExpenses = getFilteredExpenses(); // Mendapatkan daftar pengeluaran yang sudah difilter
    const expensesList = document.getElementById('expenses-list'); // Mendapatkan elemen 'expenses-list'

    // Mengubah innerHTML dari 'expenses-list' berdasarkan hasil filter
    expensesList.innerHTML = filteredExpenses.length > 0 ?
        // Jika ada pengeluaran yang sesuai, membangun string HTML untuk setiap pengeluaran
        filteredExpenses.map((expense, index) => `
     <div class="expense-item" data-index="${index}">
         <h3>${expense.title}</h3>
         <p>${expense.amount.toFixed(2)} IDR</p>
         <div class="btn-item">
             <button class="edit" onclick="editExpense(${index})">Edit</button>
             <button class="delete" onclick="deleteExpense(${index})">Delete</button>
         </div>
     </div>
 `).join('') :
        // Jika tidak ada pengeluaran yang sesuai, menampilkan pesan bahwa tidak ada pengeluaran tersimpan
        '<p>Tidak ada pengeluaran tersimpan.</p>';
}

/**
 * Mengambil daftar pengeluaran dari localStorage dan melakukan filter dan pengurutan berdasarkan nilai pencarian dan pengurutan yang diberikan.
 * Nilai pencarian diambil dari elemen input dengan ID 'search' dan nilai pengurutan diambil dari dropdown dengan ID 'sort'.
 * Mengembalikan daftar pengeluaran yang telah difilter dan diurutkan sesuai kriteria.
 * Jika tidak ada pengeluaran dalam localStorage, akan mengembalikan array kosong.
 * @returns {Array} Daftar pengeluaran yang sudah difilter dan diurutkan.
 * */
function getFilteredExpenses() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const sortValue = document.getElementById('sort').value;

    let expenses = JSON.parse(localStorage.getItem('expenses')) || []; // Mengambil daftar pengeluaran dari localStorage atau array kosong jika tidak ada

    // Lakukan filtering berdasarkan pencarian
    expenses = expenses.filter(expense => expense.title.toLowerCase().includes(searchValue));

    // Lakukan sorting berdasarkan nilai sortValue
    if (sortValue === 'latest') {
        expenses.sort((a, b) => b.index - a.index); // Mengurutkan berdasarkan index (terbaru)
    } else if (sortValue === 'amount') {
        expenses.sort((a, b) => b.amount - a.amount); // Mengurutkan berdasarkan jumlah (terbesar)
    } else if (sortValue === 'az') {
        expenses.sort((a, b) => a.title.localeCompare(b.title)); // Mengurutkan secara alfabet (A-Z)
    } else if (sortValue === 'za') {
        expenses.sort((a, b) => b.title.localeCompare(a.title)); // Mengurutkan secara alfabet (Z-A)
    }

    return expenses; // Mengembalikan daftar pengeluaran yang sudah difilter dan diurutkan
}

/**
 * Fungsi untuk menghapus pengeluaran berdasarkan indeks yang diberikan.
 * @param {number} index - Indeks pengeluaran yang akan dihapus.
 * */
function deleteExpense(index) {
    // Menggunakan SweetAlert2 untuk konfirmasi penghapusan
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Anda tidak dapat mengembalikan pengeluaran ini!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            expenses.splice(index, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderExpensesPage();
            updateTotalExpenses();
            updateHighestExpense();
            updateExpenseCount();

            // Menggunakan SweetAlert2 untuk notifikasi sukses
            Swal.fire({
                title: 'Dihapus!',
                text: 'Pengeluaran telah dihapus.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
    });
}

renderNavLinks();
navigateTo('login');